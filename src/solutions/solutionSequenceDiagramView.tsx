import {useEffect, useRef, useState} from "react";
import log from "loglevel";

import {useAllDocs, useFind} from "use-pouchdb";
import {Box, Center, ScrollArea} from "@mantine/core";
import {useParams} from "react-router-dom";
import SequenceDiagram from "../graph/sequenceDiagram.ts";
import {RowType} from "../types/rowType.ts";
import {SolutionFlowStep} from "../types/solutionFlowStep.ts";
import {TemplateComponent} from "../types/templateComponent.ts";
import {FlowStepEditModal} from "../components/flowStepEditModal.tsx";



export function SolutionSequenceDiagramView() {
    const logger = log.getLogger('SolutionSequenceDiagramView');
    const params = useParams();
    const canvas = useRef(null);
    const [selected, setSelected] = useState(null as SolutionFlowStep);

    const COMPONENTS_QUERY = {
        index: {
            fields: ['type', 'solution_id']
        },
        selector: {
            solution_id: params.solutionId,
            type: RowType.SolutionComponent,
        }
    };
    const {docs: components, state: componentsState, error: componentsError} = useFind(COMPONENTS_QUERY);
    const FLOWSTEP_QUERY = {
        index: {
            fields: ['type', 'solution_id', 'sequence']
        },
        selector: {
            type: RowType.SolutionFlowStep,
            solution_id: params.solutionId

        },
        sort: ['type', 'solution_id', 'sequence']
    };
    const {docs: flowsteps, state: flowstepsState, error: flowstepsError} = useFind(FLOWSTEP_QUERY);
    useEffect(() => {
        if (flowstepsError) {
            logger.error(flowstepsError);
        }
        if (componentsError) {
            logger.error(componentsError);
        }
        if (flowstepsState === 'done' && componentsState === 'done') {

            //setFlowSteps(tmpFlowSteps);
            logger.debug('flowSteps', flowsteps);
            //setComponents(tmpComponents);
            const c = canvas.current;
            logger.debug(c);
            if (!c) {
                logger.error('canvas not found');
            } else {
                const diagram = new SequenceDiagram(c, setSelected);
                diagram.updateDiagram(flowsteps, components);
            }

        }
    }, [flowstepsState, componentsState]);
    const flowStepModal = () => {
        if (selected) {
            const componentMap: Map<string, TemplateComponent> = new Map();
            for (const component of components) {
                componentMap.set(component._id, (component as unknown) as TemplateComponent);
            }
            return <FlowStepEditModal flowStep={selected} components={componentMap}/>;
        }
    }
    return (
        <>
            <ScrollArea type="always" scrollbarSize={18} scrollHideDelay={4000}>
                <Center>
                <Box style={{width: 800, height: 800}} id="sequencecanvas" ref={canvas}>

                </Box>
            </Center>
            </ScrollArea>
            {flowStepModal()}
        </>
    )
}