import {useEffect, useRef, useState} from "react";
import log from "loglevel";

import {useDoc, useFind, usePouch} from "use-pouchdb";
import FlowDiagram from "../graph/flowDiagram.ts";
import {Box, Button, Grid, Group, Stack} from "@mantine/core";
import {useNavigate, useParams} from "react-router-dom";
import {solutionEffect, solutionGraphSetup} from "./solutionEffects.ts";
import {RowType} from "../types/rowType.ts";
import SolutionFlows from "./solutionFlows.tsx";

export default function SolutionFlowDiagram() {
    const params = useParams();
    const navigate = useNavigate();
    const logger = log.getLogger('SolutionFlowDiagram');
    const canvas = useRef(null);

    const COMPONENTS_QUERY = {
        index: {
            fields: ['type', 'solution_id']
        },
        selector: {
            solution_id: params.solutionId,
            type: RowType.SolutionComponent,
        }
    };
    const {docs: components, state: componentsState} = useFind(COMPONENTS_QUERY);
    const [loaded, setLoaded] = useState(false);
    const [customGraph, setCustomGraph] = useState(null as FlowDiagram);
    const FLOW_QUERY = {
        index: {
            fields: ['solution_id', 'type', 'sequence', 'components']
        },
        selector: {
            solution_id: params.solutionId,
            type: RowType.SolutionFlowStep,
        },
        sort: ['solution_id', 'type', 'sequence']
    };
    const {docs: flowSteps, state: connectionsState, error: flowError} = useFind(FLOW_QUERY);
    logger.debug('flowSteps', params, flowSteps, connectionsState, flowError);
    const [currentComponent, setCurrentComponent] = useState(null);
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
    }, [logger, db, layoutDocError]);

    useEffect(() => {
        solutionGraphSetup(components, customGraph, db, layoutDoc, layoutDocError,
            loaded,  params.solutionId, canvas, setCustomGraph, setCurrentComponent);
    }, [components, customGraph, db, layoutDoc, layoutDocError, loaded, params]);

    useEffect(() => {
        solutionEffect(layoutDocState, componentsState, connectionsState, customGraph,
            flowSteps, components, layoutDoc, logger, setWorking);
    }, [layoutDocState, componentsState, connectionsState, logger, customGraph,
        flowSteps, components, layoutDoc, setWorking]);

    useEffect(() => {
        if (componentsState === 'done' && connectionsState === 'done' && !loaded) {
            logger.debug('loaded');
            setLoaded(true);
        }
    }, [logger, loaded, componentsState, connectionsState, layoutDocState]);
    const clearFlow = async () => {
        const steps = await db.find(FLOW_QUERY);
        for (const doc of steps.docs){
            await db.remove(doc);
        }
        setCustomGraph(null);
    }
    return (
        <>
            <Grid id="solutionGrid" m={20}>
                <Grid.Col span={2}>
                    <SolutionFlows></SolutionFlows>
                </Grid.Col>
                <Grid.Col span={10}>
                    <Stack style={{width: 800, height: 800}}>
                        <Group>
                            <Button onClick={clearFlow}>Clear</Button>
                        </Group>
                        <Box id="sequencecanvas" ref={canvas}>
                        </Box>
                    </Stack>

                </Grid.Col>
            </Grid>
        </>

    )
}

