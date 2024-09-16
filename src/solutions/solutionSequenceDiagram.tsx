import {useEffect, useRef, useState} from "react";
import log from "loglevel";
import CustomGraph from "../graph/customGraph.ts";
import {useDoc, useFind, usePouch} from "use-pouchdb";
import {NameId} from "../types/nameId.ts";
export default function SolutionSequenceDiagram() {
    const logger = log.getLogger('SolutionSequenceDiagram');
    const canvas = useRef(null);
    const COMPONENTS_QUERY = {
        index: {
            fields: ['type']
        },
        selector: {
            type: 'component',
        }
    };
    const {docs: components, state: componentsState} = useFind(COMPONENTS_QUERY);

    const CONNECTION_QUERY = {
        index: {
            fields: ['type', 'components']
        },
        selector: {
            type: 'connection',
        }
    };
    const [position, setPosition] = useState({_id: null,x: 10, y: 10});

    const {docs: connections, state: connectionsState} = useFind(CONNECTION_QUERY);
    const {doc: layoutDoc, error: layoutDocError} = useDoc('layout');
    const db = usePouch();
    useEffect(() => {
        if (componentsState !== 'done') return;
        if (connectionsState !== 'done') return;
        if (!components || components.length === 0) return;
        if (!layoutDoc) return;
        logger.debug(layoutDocError);
        const c = document.getElementById('sequencecanvas');
        if (!c) {
            logger.error('canvas not found');
            return;
        }
        const customGraph = new CustomGraph(c);
        logger.debug('components', components);
        components.forEach((component) => {
            logger.debug('component', component);
            const comp = component as unknown as NameId;
            if (layoutDoc[comp._id]?.position) {
                logger.debug('layout', layoutDoc[comp._id].position);
                const pos = layoutDoc[comp._id].position;
                customGraph.createNode(comp._id, pos.x, pos.y, comp.name);
            } else {
                logger.debug('no layout', comp);
                customGraph.createNode(comp._id, 10, 10, comp.name);
            }
        });
        try {
            connections.forEach((connection) => {
                logger.debug('connection', connection);
                const conn = connection as unknown as { source: string, destination: string};
                //const conn = connection as unknown as { components: string[] };
                try {
                    customGraph.createEdge(conn.source, conn.destination);
                } catch (err) {
                    logger.error('missing connection' , err);
                    db.remove(connection)
                        .then(() => {
                            logger.debug('connection removed');
                        })
                        .catch((err) => {
                            logger.error(err);
                        });
                }

            });
        } catch (err) {
            logger.error(err);
        }

        customGraph.on('drop', (event) => {
            logger.debug(event);
            const doc = {...layoutDoc};

            doc[event.id] = {position: {x: event.x, y: event.y}};
            logger.debug('layout doc', doc);
            db.put(doc);
        })
        customGraph.on('connect', (event) => {
            db.post({type: 'connection', source: event.source, destination: event.destination});
        });
        customGraph.on('delete', (event) => {
            logger.debug('delete', event);

            db.get(event.id)
                .then((doc) => {
                    db.remove(doc)
                        .then(() => {
                            logger.debug('connection removed');
                        })
                        .catch((err) => {
                            logger.error(err);
                        });
                })
                .catch((err) => {
                    logger.error(err);
                })
        });
        logger.debug('layoutDoc', layoutDoc);
        logger.debug('connections', connections);
    }, [connections, components, layoutDoc]);
    useEffect(() => {
        logger.debug('position', position);
    }, [position])
    logger.debug('SolutionSequenceDiagram');


    return (
        <div style={{zIndex: 1000, width: 800, height: 800}} id="sequencecanvas" ref={canvas}>

        </div>
    )
}