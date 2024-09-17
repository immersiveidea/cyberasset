import {useEffect, useRef, useState} from "react";
import log from "loglevel";

import {useDoc, useFind, usePouch} from "use-pouchdb";
import CustomGraph from "../graph/customGraph.ts";
import {Box, Center} from "@mantine/core";

export default function SolutionFlowDiagram() {
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
    const CONNECTION_QUERY = {
        index: {
            fields: ['type', 'components']
        },
        selector: {
            type: 'connection',
        }
    };
    const {docs: connections, state: connectionsState} = useFind(CONNECTION_QUERY);
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
            const doc = {...layoutDoc};

            doc[event.id] = {position: {x: event.x, y: event.y}};
            logger.debug('layout doc', doc);
            db.put(doc);
        })
        customGraph.on('connect', (event) => {
            const sequence = connections?.length || 0;
            db.post({type: 'connection', sequence: sequence, source: event.source, destination: event.destination});
        });
        customGraph.on('delete', async (event) => {
            logger.debug('delete', event);
            try {
                const doc = await db.get(event.id);
                await db.remove(doc);
            } catch (err) {
                logger.error(err);
            }
        });
        setWorking(true);
        customGraph.updateGraph(components, connections, layoutDoc);

        logger.debug('layoutDoc', layoutDoc);
        logger.debug('connections', connections);
        setWorking(false);
    }, [customGraph, connections, components, layoutDoc])
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