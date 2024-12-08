import {useEffect, useRef, useState} from "react";
import log from "loglevel";

import {useDoc, useFind, usePouch} from "use-pouchdb";
import FlowDiagram from "../graph/flowDiagram.ts";
import {Box, Center, Grid, Group, Stack} from "@mantine/core";
import {useParams} from "react-router-dom";
import {solutionGraphSetup, solutionEffect} from "./solutionEffects.ts";
import {RowType} from "../types/rowType.ts";
import {SolutionFlowStep} from "../types/solutionFlowStep.ts";
import {TemplateComponent} from "../types/templateComponent.ts";

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
        sort : ['solution_id', 'type', 'sequence']
    };
    const {docs: flowSteps, state: connectionsState} = useFind(FLOW_QUERY);
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
           loaded, logger, params, canvas, setCustomGraph, setCurrentComponent);
    }, [components, customGraph, db, layoutDoc, layoutDocError, loaded, logger, params]);

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
    logger.debug(components);
    const componentName = (flowStep: SolutionFlowStep) => {
        const solutionComponent = components.find((comp) => {
            return comp._id==flowStep.source}) as TemplateComponent;
        if (solutionComponent) {
            return solutionComponent.name;
        } else {
            return 'Unknown';
        }
    }
    logger.debug(currentComponent);
    return (
        <>
            {working ? <Center>Working...</Center> : <></>}
            <Grid>
                <Grid.Col span={2}>
                    <Box>
                        <Center>
                            <Stack>
                                <h1>Flow</h1>
                                {flowSteps.map((step) => {
                                    const flowStep: SolutionFlowStep = ((step as unknown) as SolutionFlowStep);
                                    return <Group key={flowStep._id}>
                                        <div>{flowStep.sequence}</div>
                                        <div>{componentName(flowStep)}</div>
                                    </Group>
                                })}
                            </Stack>
                        </Center>
                    </Box>
                </Grid.Col>
                <Grid.Col span={10}>
                <Center>
                    <Box style={{width: 800, height: 800}} id="sequencecanvas" ref={canvas}>

                    </Box>
                </Center>
                </Grid.Col>

            </Grid>
        </>
    )
}

