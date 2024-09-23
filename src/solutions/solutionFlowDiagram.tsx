import {useEffect, useRef, useState} from "react";
import log from "loglevel";

import {useDoc, useFind, usePouch} from "use-pouchdb";
import FlowDiagram from "../graph/flowDiagram.ts";
import {Box, Center} from "@mantine/core";
import {useParams} from "react-router-dom";
import {deleteComponent, deleteFlowstep} from "../dbUtils.ts";

export default function SolutionFlowDiagram() {
    const params = useParams();
    const logger = log.getLogger('SolutionFlowDiagram');
    const canvas = useRef(null);
    const COMPONENTS_QUERY = {
        index: {
            fields: ['type', 'solution_id']
        },
        selector: {
            solution_id: params.solutionId,
            type: 'component',
        }
    };
    const {docs: components, state: componentsState} = useFind(COMPONENTS_QUERY);
    const [loaded, setLoaded] = useState(false);
    const [customGraph, setCustomGraph] = useState(null as FlowDiagram);
    const FLOW_QUERY = {
        index: {
            fields: ['solution_id', 'type', 'components']
        },
        selector: {
            solution_id: params.solutionId,
            type: 'flowstep',
        }
    };
    const {docs: flowSteps, state: connectionsState} = useFind(FLOW_QUERY);
    const {doc: layoutDoc, state: layoutDocState, error: layoutDocError} = useDoc('layout');
    const db = usePouch();
    const [working, setWorking] = useState(false);

    useEffect(() => {
        if (layoutDocError?.status === 404) {
            db.put({_id: 'layout'}).catch((err) => {
                logger.error(err);
            });
        }
        logger.debug(layoutDocError);
    }, [layoutDocError]);
    useEffect(() => {
        if (loaded && !customGraph) {
            logger.debug(layoutDocError);
            const c = canvas.current;
            logger.debug(c);
            if (!c) {
                logger.error('canvas not found');
            } else {
                const cgraph = new FlowDiagram(c);
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
                            return row.doc.type === 'flowstep' && row.doc.solution_id === params.solutionId;
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
                            type: 'flowstep', solution_id: params.solutionId,
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
                        const doc = await db.get(event.id);
                        logger.debug('deleting', doc);
                        switch (doc.type) {
                            case 'component':
                                deleteComponent(db, doc)
                                break;
                            case 'flowstep':
                                deleteFlowstep(db, doc)
                                break;
                        }
                    } catch (err) {
                        logger.error(err);
                    }
                });
                setCustomGraph(cgraph);

            }
        }
    }, [loaded]);
    useEffect(() => {
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
    }, [customGraph, flowSteps, components, layoutDoc])
    useEffect(() => {
        if (componentsState === 'done' && connectionsState === 'done' && !loaded) {
            logger.debug('loaded');
            setLoaded(true);
        }
    }, [componentsState, connectionsState, layoutDocState]);
    return (
        <>
            {working ? <Center>Working...</Center> : <></>}
            <Center>
                <Box style={{width: 800, height: 800}} id="sequencecanvas" ref={canvas}>

                </Box>
            </Center>
        </>
    )
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