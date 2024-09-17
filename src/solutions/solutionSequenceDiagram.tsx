import {useEffect, useRef, useState} from "react";
import log from "loglevel";
import CustomGraph from "../graph/customGraph.ts";
import {useDoc, useFind, usePouch} from "use-pouchdb";
import {NameId} from "../types/nameId.ts";
import {Affix, Loader} from "@mantine/core";
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
    const [position, setPosition] = useState({_id: null,x: 10, y: 10});
    const [working, setWorking] = useState(false);
    const db = usePouch();
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
            const c = document.getElementById('sequencecanvas');
            if (!c) {
                logger.error('canvas not found');
                return;
            }
            setCustomGraph(new CustomGraph(c));
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
            db.post({type: 'connection', source: event.source, destination: event.destination});
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
        setWorking(false);
        logger.debug('layoutDoc', layoutDoc);
        logger.debug('connections', connections);
    }, [customGraph, connections, components, layoutDoc])
    useEffect(() => {
        logger.debug('position', position);
    }, [position])
    useEffect(() => {
        if (componentsState === 'done' && connectionsState === 'done' && !loaded) {
            logger.debug('loaded');
            setLoaded(true);
        }
    }, [componentsState, connectionsState, layoutDocState]);



    return (<>
            <Affix top={10} right={100}>
                {working?<Loader color="blue" />:<> </>}
            </Affix>
            <div style={{zIndex: 1000, width: 800, height: 800}} id="sequencecanvas" ref={canvas}>

            </div>
        </>

    )
}