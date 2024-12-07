import log from "loglevel";
import {RowType} from "./types/dbTypes.ts";

export const getFlowsteps = async (db, solutionId) => {
    const logger = log.getLogger('getFlowsteps');
    const FLOW_QUERY = {
        index: {
            fields: ['solution_id', 'type', 'components']
        },
        selector: {
            solution_id: solutionId,
            type: 'flowstep',
        },
        sort: ['sequence']
    };
    try {
        const steps =  await db.find(FLOW_QUERY);
        return steps.docs;
    } catch (err) {
        logger.error(err);
        return [];
    }
}

export const updateComponent = async (db, component) => {
    const logger = log.getLogger('updateComponent');
    try {
        logger.debug('updating', component);
    } catch (err) {
        logger.error(err);
    }
}

export const deleteComponent = async (db, component) => {
    const logger = log.getLogger('deleteComponent');
    if (component.type != 'component') {
        logger.warn('deleteComponent called with non-component', component);
    }
    try {
        const all = await db.allDocs({include_docs: true});
        logger.debug('all', all);
        if (component.connections) {
            for (const connection of component.connections) {
                logger.debug('connection', connection.id);
                const data = all.rows.filter((row) => {
                    return row.doc._id === connection.id ||
                        row.doc.source === connection.id ||
                        row.doc.destination === connection.id;
                });
                logger.debug('flowstep data', data);
                for (const row of data) {
                    if (row.type == 'flowstep') {
                        logger.debug('removing', row);
                        await db.remove(row);
                    }
                    if (row.type == 'component') {
                        if (row.connections) {
                            row.connections = row.connections.filter((c) => {
                                return c.id !== component._id;
                            });
                            logger.debug('updating', row);
                            await db.put(row);
                        }
                    }
                }
            }
        }
        logger.debug('deleting', component);
        db.remove(component);
    } catch (err) {
        logger.error(err);
    }
}
export const deleteFlowstep = async (db, flowstep) => {
    const logger = log.getLogger('deleteFlowstep');
    try {
        const all = await db.allDocs({include_docs: true});
        const remainingFlowsteps = [];
        const componentsConnected = new Set([]);

        for (const row of all.rows) {
            switch (row.doc.type) {
                case RowType.SolutionComponent:
                    if (row.doc.solution_id === flowstep.solution_id) {
                        if (row.doc.connections &&
                            row.doc.connections.length > 0) {
                            for (const connection of row.doc.connections) {
                                if (connection.id == flowstep.source ||
                                    connection.id == flowstep.destination) {
                                    logger.debug('found connection', connection);
                                    componentsConnected.add(connection.id);
                                }
                            }
                        }
                    }
                    break;
                case RowType.SolutionFlowStep:
                    if (row.doc.solution_id === flowstep.solution_id &&
                        row.doc._id !== flowstep._id) {
                        remainingFlowsteps.push(row.doc);
                    }
                    break;
            }
        }
        logger.debug('componentsConnected', componentsConnected);
        for (const componentId of componentsConnected) {
            try {
                const otherSteps = remainingFlowsteps.find((step) => {
                    return (step._id !== flowstep._id &&
                        (step.source === componentId || step.destination === componentId))
                });
                if (!otherSteps) {
                    logger.debug('getting', componentId);
                    const component = await db.get(componentId);
                    logger.debug('updating', component);
                    component.connections = component.connections.filter((c) => {
                        return (c.id !== flowstep.source && flowstep.direction == 'in') ||
                            (c.id !== flowstep.destination && flowstep.direction == 'out')
                    });
                    logger.debug('updated', component);
                    await db.put(component);
                }

            } catch (err) {
                logger.error('components connected', err);
            }
        }
        remainingFlowsteps.sort((a, b) => {
            return a.sequence - b.sequence
        });
        for (const [index, step] of remainingFlowsteps.entries()) {
            if (step.sequence != index) {
                step.sequence = index;
                logger.debug('updating', step);
                try {
                    await db.put(step);
                } catch (err) {
                    logger.error(err);
                }
            }
        }
        logger.debug('remaining', remainingFlowsteps);
        logger.debug('deleting', flowstep);
        await db.remove(flowstep);

    } catch (err) {
        logger.error(err);
    }
}

