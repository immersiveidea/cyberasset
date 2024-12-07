import FlowDiagram from "../graph/flowDiagram.ts";
import {SolutionType} from "../types/solutionType.ts";
import {deleteComponent, deleteFlowstep} from "../dbUtils.ts";
import log from "loglevel";
import {RowType} from "../types/rowType.ts";

export const solutionEffect  = (layoutDocState, componentsState, connectionsState,
                                customGraph, flowSteps, components,
                                layoutDoc, logger, setWorking) => {
    if (layoutDocState !== 'done' || componentsState !== 'done' || connectionsState !== 'done'
        || !customGraph) {
        return;
    }

    logger.debug('customGraph', customGraph);

    setWorking(true);
    customGraph.updateGraph(components, flowSteps, layoutDoc);
    logger.debug('layoutDoc', layoutDoc);
    logger.debug('flowSteps', flowSteps);
    setWorking(false);
}

export const solutionGraphSetup = (components, customGraph, db, layoutDoc,
                                   layoutDocError, loaded, logger, params,
                                   canvas, setCustomGraph, setCurrentComponent) => {
    if (loaded && !customGraph) {
        logger.debug(layoutDocError);
        const c = canvas.current;
        logger.debug(c);
        if (!c) {
            logger.error('canvas not found');
        } else {
            const cgraph: FlowDiagram = new FlowDiagram(c);
            cgraph.on('drop', async (event) => {
                try {
                    logger.debug(event);
                    const newLayout = await db.get(layoutDoc._id);
                    newLayout[event.id] = {position: {x: event.x, y: event.y}};
                    logger.debug('layout doc', newLayout);
                    await db.put(newLayout);
                } catch (err) {
                    logger.error(err);
                }
            });
            cgraph.on('connect', async (event) => {
                try {
                    logger.debug('connect', 'components', components);
                    logger.debug('connect', 'event', event);
                    const all = await db.allDocs({include_docs: true});
                    logger.debug('all', all);
                    const count = all.rows.filter((row) => {
                        const solution = row.doc as SolutionType;
                        return solution.type === RowType.SolutionFlowStep && solution.solution_id === params.solutionId;
                    });
                    logger.debug('count', count);
                    const sequence = count.length;
                    const sourceComponent = components.find((comp) => {
                        return comp._id === event.source;
                    });
                    logger.debug(sourceComponent);
                    const destComponent = components.find((comp) => {
                        return comp._id === event.destination;
                    });
                    logger.debug(destComponent);
                    const flowStep = await db.post({
                        type: RowType.SolutionFlowStep,
                        solution_id: params.solutionId,
                        sequence: sequence,
                        protocol: 'https',
                        port: '443',
                        source: event.source,
                        destination: event.destination
                    });
                    await updateComponent(sourceComponent, event.destination, 'out', db);
                    logger.debug('sourceComponent', sourceComponent);
                    await updateComponent(destComponent, event.source, 'in', db);
                    logger.debug('destComponent', destComponent);
                    logger.debug('flowStep', flowStep);
                } catch (err) {
                    logger.error(err);
                }
            });
            cgraph.on('delete', async (event) => {
                logger.debug('delete', event);
                try {
                    const doc = await db.get(event.id) as SolutionType;
                    logger.debug('deleting', doc);
                    switch (doc.type) {
                        case RowType.SolutionComponent:
                            await deleteComponent(db, doc)
                            break;
                        case RowType.SolutionFlowStep:
                            await deleteFlowstep(db, doc)
                            break;
                    }
                } catch (err) {
                    logger.error(err);
                }
            });
            cgraph.on('select', async(event) => {
                logger.debug('select', event);
                try {
                    const doc = await db.get(event.id);
                    logger.debug('select', doc);
                    setCurrentComponent(doc);
                } catch (err) {
                    logger.error(err);
                }
            })
            setCustomGraph(cgraph);

        }
    }
}
async function updateComponent(component, destination: string, inout: string, db) {
    const dbComp = await db.get(component._id);
    const logger = log.getLogger('updateComponent');
    if (dbComp.connections === undefined || dbComp.connections === null) {
        dbComp.connections = [];
    }
    if (!dbComp.connections.find((c) => {
        return c.id === destination
    })) {
        dbComp.connections.push({id: destination, direction: inout, protocol: 'https', port: '443'});
    }
    logger.debug('component connections', component.connections);
    try {
        await db.put(dbComp);
    } catch (err) {
        logger.error('updateComponent', err);
    }
}