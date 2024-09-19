import log from "loglevel";
export const updateComponent = async (db, component) => {
    const logger= log.getLogger('updateComponent');
    try {
        logger.debug('updating', component);

    } catch (err) {
        logger.error(err);
    }
}
export const deleteComponent = async (db, component) => {
    const logger= log.getLogger('deleteComponent');
    if (component.type!='component') {
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
                if (data.type=='flowstep') {
                    logger.debug('removing', data);
                    await db.remove(data);
                }
                if (data.type=='component') {
                    if (data.connections) {
                        data.connections = data.connections.filter((c) => {
                            return c.id !== component._id;
                        });
                        logger.debug('updating', data);
                        await db.put(data);
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
    const logger= log.getLogger('deleteFlowstep');
    try {
        const all = await db.allDocs({include_docs: true});
        logger.debug('all', all);
        all.rows.forEach((row) => {
            logger.debug('row', row);
            if (row.doc.connections) {
                logger.debug('doc with connections', row.doc);
                row.doc.connections = row.doc.connections.filter((c) => {
                    return c.id !== flowstep.source && c.id !== flowstep.destination;
                });
                logger.debug('updating', row.doc);
                db.put(row.doc);
            }
        })
        logger.debug('deleting', flowstep);
        db.remove(flowstep);

    } catch (err) {
        logger.error(err);
    }
}
