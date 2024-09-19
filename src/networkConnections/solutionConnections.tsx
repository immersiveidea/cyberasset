import log from "loglevel";
import {useParams} from "react-router-dom";
import {useAllDocs, usePouch} from "use-pouchdb";
import {useEffect, useState} from "react";
import {Box, Button, Group, Select, Table, TextInput, Title} from "@mantine/core";

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
            logger.debug('params', params);
            logger.debug('all', all);
            setSolution(all.find((doc) => {
                return doc.id === params.solutionId
            }).doc);
            const components = [];
            const flowSteps = [];
            for(const row of all)  {
                switch (row.doc.type) {
                    case 'component':
                        components.push(row.doc);
                        break;
                    case 'flowstep':
                        flowSteps.push(row.doc);
                        break;
                    case 'solution':
                        if (row.doc._id === params.solutionId) {
                            setSolution(row.doc);
                        }
                        break;
                    default:
                        logger.debug(row.doc);
                        break;
                }
            }
            setComponents(components);
            setFlowSteps(flowSteps);
            logger.debug('solution', solution);
        }
    }, [state])

    const saveComponent = (component) => {
        //db.put(component);
        const otherComponents = components.filter((comp) => {
            logger.debug('comp', comp)
            return comp.connections.find((conn) => {
                logger.debug ('conn', conn);
                return conn.id === component._id;
            })
        });
        logger.debug('component' , component);
        logger.debug('otherComponents' , otherComponents);

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
            logger.debug('step', step);
            const component = components.find((comp) => {
                return comp._id === step.id
            });
            logger.debug('component', component);
            if (!component) {
                return <div>{JSON.stringify(components)}</div>
            } else {
                return (<><Group bg="#000">
                    <Box w={50}>
                        {step.direction === 'in' ? 'In From ' : 'Out To '}
                    </Box>
                    <Box w={90}>
                        {component.name}
                    </Box>
                    <Select w={90} data={['http', 'tcp', 'udp', 'ftp', 'sftp']}
                            defaultValue={step.protocol}
                            label="protocol"
                            onChange={(value) => {
                                const newComp = {...baseComponent};
                                newComp.connections[index].protocol = value;
                                saveComponent(newComp, index);
                            }}/>
                    <TextInput w={256} label="url/host"
                               defaultValue={step.url} onBlur={(event) => {
                        const newComp = {...baseComponent};
                        newComp.connections[index].url = event.target.value;
                        saveComponent(newComp, index);
                    }}/>
                    <TextInput w={90} label="port"
                               defaultValue={step.port} onBlur={(event) => {
                        const newComp = {...baseComponent};
                        newComp.connections[index].port = event.target.value;
                        saveComponent(newComp, index);
                    }}/>
                    <Button>Payload</Button>
                    <Button>Notes</Button>

                </Group></>)
            }

        })
    }
    const connectionTable = () => {
        if (state!=='done') {
            return <></>
        }
        return components.map((step, index) => {
            return (<>
                    <Table.Tr>
                        <Table.Td>{step.name}</Table.Td>
                        <Table.Td>{connectionView(step)}</Table.Td>
                    </Table.Tr>

                </>
            )

        })
    }
    return (
        <>
            <Title order={1}>Connections</Title>
            <Table>
                <Table.Th>
                    Component
                </Table.Th>
                <Table.Th>
                    Connections
                </Table.Th>
                <Table.Tbody>
                    {connectionTable()}
                </Table.Tbody>
            </Table>
        </>
    )
}
