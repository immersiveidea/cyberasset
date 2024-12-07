import {useEffect, useRef} from "react";
import log from "loglevel";

import {useAllDocs} from "use-pouchdb";
import {Box, Center, ScrollArea} from "@mantine/core";
import {useParams} from "react-router-dom";
import SequenceDiagram from "../graph/sequenceDiagram.ts";
import {RowType} from "../types/rowType.ts";



export function SolutionSequenceDiagramView() {
    const logger = log.getLogger('SolutionSequenceDiagramView');
    const params = useParams();
    const canvas = useRef(null);
    const {rows: all, state} = useAllDocs({include_docs: true});
    useEffect(() => {
        if (state === 'done') {
            const tmpFlowSteps = [];
            const tmpComponents = [];
            for (const row of all) {
                logger.debug(row.doc);
                logger.debug(params);
                const sol = ((row.doc as unknown) as {solution_id: string, type: string});
                if (sol.solution_id === params.solutionId) {
                    switch (sol.type) {
                        case RowType.SolutionFlowStep:
                            tmpFlowSteps.push(row.doc);
                            break;
                        case RowType.SolutionComponent:
                            tmpComponents.push(row.doc);
                            break;
                        default:
                            logger.debug(row.doc);
                            break;
                    }
                }
            }
            tmpFlowSteps.sort((a, b) => {
                return a.sequence - b.sequence
            })
            //setFlowSteps(tmpFlowSteps);
            logger.debug('flowSteps', tmpFlowSteps);
            //setComponents(tmpComponents);

            const swimlanes = [];
            for (const flowStep of tmpFlowSteps) {
                const component = tmpComponents.find((comp) => {
                    return comp._id == flowStep.source
                });
                const lane = swimlanes.find((lane) => {
                    return lane.id === flowStep.source;
                });
                if (lane) {
                    lane.interactions.push({sequence: flowStep.sequence, destination: flowStep.destination});
                } else {
                    swimlanes.push({
                        id: flowStep.source,
                        name: component.name,
                        interactions: [{sequence: flowStep.sequence, destination: flowStep.destination}]
                    });
                }
            }
            logger.debug('swimlanes', swimlanes);
            const c = canvas.current;
            logger.debug(c);
            if (!c) {
                logger.error('canvas not found');
            } else {
                const diagram = new SequenceDiagram(c);
                diagram.updateDiagram(tmpFlowSteps, swimlanes);
            }

        }
    }, [state]);
    return (

            <ScrollArea type="always" scrollbarSize={18} scrollHideDelay={4000}>
                <Center>
                <Box style={{width: 800, height: 800}} id="sequencecanvas" ref={canvas}>

                </Box>
            </Center>
            </ScrollArea>

    )
}