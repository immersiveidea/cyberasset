import log from "loglevel";
import {useParams} from "react-router-dom";
import {useAllDocs, usePouch} from "use-pouchdb";
import {useEffect, useState} from "react";
import {Box, Button, Group, Select, Table, TextInput, Title} from "@mantine/core";
import {SolutionEntity} from "../solutions/solutionType.ts";

export function SolutionConnections() {
    const logger = log.getLogger('SolutionConnections');
    const params = useParams();
    const {rows: all, state} = useAllDocs({include_docs: true});
    const db = usePouch();
    const [components, setComponents] = useState([]);
    const [solution, setSolution] = useState(null);
    const [flowSteps, setFlowSteps] = useState([]);
    useEffect(() => {
        if (state === 'done') {
            logger.info('params', params);
            setSolution(all.find((doc) => {
                return doc.id === params.solutionId
            }).doc);
            const components2 = [];
            const flowSteps2 = [];
            for (const row of all) {
                const solutionEntity = row.doc as SolutionEntity;
                switch (solutionEntity.type) {
                    case 'component':
                        if (solutionEntity.solution_id === params.solutionId) {
                            components2.push(row.doc);
                        }
                        break;
                    case 'flowstep':
                        if (solutionEntity.solution_id === params.solutionId) {
                            flowSteps2.push(row.doc);
                        }

                        break;
                    case 'solution':
                        if (row.doc._id === params.solutionId) {
                            setSolution(row.doc);
                        }
                        break;
                    default:
                        break;
                }
            }
            flowSteps2.sort((a, b) => {return a.sequence - b.sequence});
            const components3 = [];
            for (const step of flowSteps2) {
                const comp2 = components2.find((comp) => {
                    return comp._id === step.source
                });
                if (comp2) {

                    const exists = components3.find((comp) => {return comp._id == comp2._id});
                    logger.debug('comp2', comp2._id, exists?comp2._id:'');
                    if (!exists) {
                        components3.push(comp2);
                    }
                    //components3.push(comp2);
                }
            }
            setComponents(components3);
            setFlowSteps(flowSteps2);
            logger.debug('solution', solution);
        }
    }, [state])

    const saveComponent = (component) => {
        //db.put(component);
        const otherComponents = components.filter((comp) => {
            logger.debug('comp', comp)
            return comp.connections.find((conn) => {
                logger.debug('conn', conn);
                return conn.id === component._id;
            })
        });
        logger.debug('component', component);
        logger.debug('otherComponents', otherComponents);

        for (const otherComponent of otherComponents) {
            const otherConnection = otherComponent.connections.find((conn) => {
                return conn.id === component._id;
            });
            logger.debug('otherConnection', otherConnection);
            if (otherConnection) {
                otherConnection.protocol = component.connections.find((conn) => {
                    return conn.id === otherComponent._id;
                }).protocol;
                otherConnection.url = component.connections.find((conn) => {
                    return conn.id === otherComponent._id;
                }).url;
                otherConnection.port = component.connections.find((conn) => {
                    return conn.id === otherComponent._id;
                }).port;
                logger.debug('otherConnection', otherConnection);
                const newComp = {...otherComponent};
                db.put(newComp);
            }
        }
        db.put(component);
    }

    const connectionView = (baseComponent) => {
        logger.debug('input', baseComponent);
        if (!baseComponent.connections) {
            return <div>No connections</div>
        }
        return baseComponent.connections.map((step, index) => {

            const component = components.find((comp) => {
                return comp._id === step.id
            });

            if (!component) {
                return <div>{JSON.stringify(components)}</div>
            } else {
                return (<Group key={component._id} bg="#000">
                    <Box key="direction" w={50}>
                        {step.direction === 'in' ? 'In From ' : 'Out To '}
                    </Box>
                    <Box key="name" w={90}>
                        {component.name}
                    </Box>
                    <Select key="protocol" w={90} data={['http', 'https', 'tcp', 'udp', 'ftp', 'sftp']}
                            defaultValue={step.protocol}
                            label="protocol"
                            onChange={(value) => {
                                const newComp = {...baseComponent};
                                newComp.connections[index].protocol = value;
                                saveComponent(newComp);
                            }}/>
                    <TextInput key="host" w={256} label="url/host"
                               defaultValue={step.url} onBlur={(event) => {
                        const newComp = {...baseComponent};
                        newComp.connections[index].url = event.target.value;
                        saveComponent(newComp);
                    }}/>
                    <TextInput key="port" w={90} label="port"
                               defaultValue={step.port} onBlur={(event) => {
                        const newComp = {...baseComponent};
                        newComp.connections[index].port = event.target.value;
                        saveComponent(newComp);
                    }}/>
                    <Button key="payload">Payload</Button>
                    <Button key="notes">Notes</Button>

                </Group>)
            }

        })
    }
    const connectionTable = () => {
        if (state !== 'done') {
            return <></>
        }
        return components.map((step, index) => {
            return (
                <Table.Tr key={index}>
                    <Table.Td key={index + 'left'}>{step.name}</Table.Td>
                    <Table.Td key={index + 'right'}>{connectionView(step)}</Table.Td>
                </Table.Tr>


            )

        })
    }
    return (
        <Group key="group">
            <Title key="connections" order={1}>Connections</Title>
            <Table key="table">
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th>
                            Component
                        </Table.Th>
                        <Table.Th>
                            Connections
                        </Table.Th>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                    {connectionTable()}
                </Table.Tbody>
            </Table>
        </Group>
    )
}
