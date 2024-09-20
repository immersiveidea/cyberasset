import {useEffect, useRef, useState} from "react";
import log from "loglevel";

import {useAllDocs, useDoc, useFind, usePouch} from "use-pouchdb";
import CustomGraph from "../graph/customGraph.ts";
import {Box, Center} from "@mantine/core";
import {useParams} from "react-router-dom";

import {deleteComponent, deleteFlowstep} from "../dbUtils.ts";
import SequenceDiagram from "../graph/sequenceDiagram.ts";


export function SequenceDiagramView() {
        const logger = log.getLogger('SequenceDiagramView');
        const params = useParams();
        const canvas = useRef(null);
        const {rows: all, state} = useAllDocs({include_docs: true});
        const [flowSteps, setFlowSteps] = useState([]);
        const [components, setComponents] = useState([]);
        const [sequenceDiagram, setSequenceDiagram] = useState(null as SequenceDiagram);
        useEffect(() => {
            if (state === 'done') {
                const tmpFlowSteps = [];
                const tmpComponents = [];
                for (const row of all) {
                    logger.debug(row.doc);
                    logger.debug(params);
                    if (row.doc.solution_id === params.solutionId) {
                        switch (row.doc.type) {
                            case 'flowstep':
                                tmpFlowSteps.push(row.doc);
                                break;
                            case 'component':
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
                setFlowSteps(tmpFlowSteps);
                logger.debug('flowSteps', tmpFlowSteps);
                setComponents(tmpComponents);

                const swimlanes = [];
                for (const flowStep of tmpFlowSteps) {
                    const component = tmpComponents.find((comp) => {return comp._id == flowStep.source});
                    const lane = swimlanes.find((lane) => {
                        return lane.id === flowStep.source;
                    });
                    if (lane) {
                        lane.interactions.push({sequence: flowStep.sequence, destination: flowStep.destination});
                    } else {
                        swimlanes.push({id: flowStep.source, name: component.name, interactions: [{sequence: flowStep.sequence, destination: flowStep.destination}]});
                    }
                }
                logger.debug('swimlanes', swimlanes);
                const c = canvas.current;
                logger.debug(c);
                if (!c) {
                    logger.error('canvas not found');
                } else {
                    const diagram = new SequenceDiagram(c);
                    setSequenceDiagram(diagram);
                    diagram.updateDiagram(tmpFlowSteps, swimlanes);
                }

            }
        }, [state]);
        return (
            <>
                <Center>
                    <Box style={{width: 800, height: 800}} id="sequencecanvas" ref={canvas}>

                    </Box>
                </Center>
            </>
        )
}