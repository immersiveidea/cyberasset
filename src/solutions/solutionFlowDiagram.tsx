import {useEffect, useRef, useState} from "react";
import log from "loglevel";

import {useDoc, useFind, usePouch} from "use-pouchdb";
import CustomGraph from "../graph/customGraph.ts";
import {Box, Center} from "@mantine/core";
import {useParams} from "react-router-dom";
import {deleteComponent, deleteFlowstep} from "../dbUtils.ts";

export default function SolutionFlowDiagram() {
    const params = useParams();
    const logger = log.getLogger('SolutionFlowDiagram');
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
    const [loaded, setLoaded] = useState(false);
    const [customGraph, setCustomGraph] = useState(null as CustomGraph);
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
                setCustomGraph(new CustomGraph(c));
            }
        }
    }, [loaded]);
    useEffect(() => {
        if (layoutDocState !== 'done' || componentsState !== 'done' || connectionsState !== 'done'
            || !customGraph) {
            return;
        }
        logger.debug('customGraph', customGraph);

        customGraph.on('drop', (event) => {
            logger.debug(event);
            const newLayout = {...layoutDoc};
            newLayout[event.id] = {position: {x: event.x, y: event.y}};
            logger.debug('layout doc', newLayout);
            db.put(newLayout);
        })
        customGraph.on('connect',async (event) => {
            logger.debug(components);
            logger.debug(event);
            const sequence = flowSteps?.length || 0;
            const sourceComponent = components.find((comp)=>{
                return comp._id === event.source;
            });
            logger.debug(sourceComponent);
            const destComponent = components.find((comp)=>{
                return comp._id === event.destination;
            });
            logger.debug(destComponent);
            const flowStep = await db.post({type: 'flowstep', solution_id: params.solutionId,
                sequence: sequence,
                source: event.source,
                destination: event.destination});

            if (!sourceComponent.connections) {
                sourceComponent.connections = [];
            }

            if (!sourceComponent.connections.find((c) => {return c.id === event.destination})) {
                sourceComponent.connections.push({id: event.destination, direction: 'out'});
            }
            await db.put(sourceComponent);
            logger.debug('sourceComponent', sourceComponent);
            if (!destComponent.connections) {
                destComponent.connections = [];
            }
            if (!destComponent.connections.find((c) => {return c.id === event.source})) {
                destComponent.connections.push({id: event.source, direction: 'in'});
            }
            await db.put(destComponent);
            logger.debug('destComponent', destComponent);

            logger.debug('flowStep', flowStep);
        });
        customGraph.on('delete', async (event) => {
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
                //await db.remove(doc);
            } catch (err) {
                logger.error(err);
            }
        });
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