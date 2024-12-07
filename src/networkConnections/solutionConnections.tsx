import log from "loglevel";
import {useParams} from "react-router-dom";
import {useDoc, useFind, usePouch} from "use-pouchdb";
import {Group, NavLink, Paper, Stack, Title} from "@mantine/core";
import {useEffect} from "react";
import {SolutionFlowStep} from "../types/solutionFlowStep.ts";



export function SolutionConnections() {
    const logger = log.getLogger('SolutionConnections');
    const params = useParams();
    const db = usePouch();

    const FLOW_QUERY = {
        index: {
            fields: ['solution_id', 'type', 'sequence', 'components']
        },
        selector: {
            solution_id: params.solutionId,
            type: 'flowstep',
        }
    };

    const COMPONENTS_QUERY = {
        index: {
            fields: ['solution_id', 'type']
        },
        selector: {
            solution_id: params.solutionId,
            type: 'component',
        }
    };
    const {docs: components, state: componentsState} = useFind(COMPONENTS_QUERY);
    const {docs: flowSteps, state: connectionsState} = useFind(FLOW_QUERY);
    const {doc: solutionFlows, error: solutionFlowsError} = useDoc('solutionFlows');
    useEffect(() => {
        if (solutionFlowsError && solutionFlowsError.status === 404) {
            db.put({_id: 'solutionFLows', solution_id: params.solution_id, list: []});
        }
    }, [components, flowSteps, solutionFlowsError, solutionFlows]);
    logger.debug('flowSteps', connectionsState);
    if (connectionsState != 'done' && flowSteps?.length &&
        componentsState != 'done' && components?.length) {
        return <div>{connectionsState}</div>
    }
    const componentsByID = new Map();
    components.forEach((component) => {
        componentsByID.set(component._id, component);
    });

    const connectionMap = new Map<string, { source: string, destination: string, count?: number }>();
    flowSteps.forEach((step) => {
        const flowStep: SolutionFlowStep = ((step as unknown) as SolutionFlowStep);
        const connKey = flowStep.source > flowStep.destination ? flowStep.source + flowStep.destination : flowStep.destination + flowStep.source;
        if (connectionMap.has(connKey)) {
            const updated = connectionMap.get(connKey);
            if (updated.source == flowStep.source) {
                updated.count++;
                connectionMap.set(connKey, updated);
            }
        } else {
            connectionMap.set(connKey, {source: flowStep.source, destination: flowStep.destination, count: 1});
        }
    });
    if (connectionMap.size == 0) {
        return <div>No connections</div>
    }
    logger.debug('connectionMap', connectionMap.entries());
    logger.debug('flowSteps', flowSteps);
    logger.debug('components', componentsByID);
    const flowStepRows = connectionMap.entries().toArray().map((step) => {
        logger.debug('step', step);
        return (
            <NavLink
                label={componentsByID.get(step[1].source)?.name +
                    componentsByID.get(step[1].destination)?.name}/>

        )
    });


    return (
        <Paper h="calc(100vh - 179px)">
            <Title key="connections" order={1}>Connections</Title>
            <Group align="top" h="100%" bg="#000" key="group">
                <Stack w={200}>
                    {flowStepRows}
                </Stack>
            </Group>
        </Paper>
    )
}
