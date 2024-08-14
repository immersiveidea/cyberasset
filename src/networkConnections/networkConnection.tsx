import {Box, Button, NumberInput, Select, Table} from "@mantine/core";
import {IconArrowLeftFromArc, IconArrowRightToArc, IconTrash} from "@tabler/icons-react";
import DeleteButton from "../components/deleteButton.tsx";

const protocols = [
    {value: 'ftp', label: 'FTP', defaultPort: 21},
    {value: 'ssh', label: 'SSH', defaultPort: 44},
    {value: 'http', label: 'HTTP', defaultPort: 80},
    {value: 'https', label: 'HTTPS', defaultPort: 443},
    {value: 'tcp', label: 'TCP', defaultPort: null},
    {value: 'udp', label: 'UDP', defaultPort: null},
]
export default function NetworkConnection({componentId, connection, db, components}) {

    const addMoreOptions = (id) => {
        console.log(id);
    }
    const removeConnection = async (connectionId) => {
        const doc = await db.get(connectionId);
        await db.remove(doc);
    }
    const updateSource = async (connectionId, value) => {
        const doc = await db.get(connectionId)
        doc.source = value;
        doc.components = [{id: doc.source}, {id: doc.destination}];
        await db.put(doc);

    }
    const updateDestination = async (connectionId, value) => {
        const doc = await db.get(connectionId)
        doc.destination = value;
        doc.components = [{id: doc.source}, {id: doc.destination}];
        await db.put(doc);
    }
    const selectConnection = (connection, direction) => {
        const highlight = !(connection.source && connection.destination);
        if (direction === 'source' && connection.source === componentId) {
            return <>This Component</>
        }
        if (direction === 'destination' && connection.destination === componentId) {
            return <>This Component</>
        }

        return (<Select
            searchable={true}
            size="xs"
            error={highlight}
            key={'external-' + connection._id}
            onChange={(source) => {
                if (direction === 'source') {
                    updateSource(connection._id, source)
                } else {
                    updateDestination(connection._id, source)
                }
            }}
            data={components && components.length > 0 ? components.map((doc) => {
                return {value: doc._id, label: doc.name}
            }) : []}
            value={direction == 'source' ? connection.source : connection.destination}
            placeholder="Select Existing Component"/>);
    }
    const rowIcon = (connection) => {
        if (connection.destination == componentId) {
            return <Box key={'row-icon-' + connection._id}>
                <IconArrowRightToArc/>
            </Box>
        }
        if (connection.source == componentId) {
            return <Box key={'row-icon-' + connection._id}>
                <IconArrowLeftFromArc/>
            </Box>
        }
        return <></>
    }
    return (<Table.Tr key={'group-' + connection._id}>
        <Table.Td>{rowIcon(connection)}
            </Table.Td>
            <Table.Td>{selectConnection(connection, 'source')}
            </Table.Td>
            <Table.Td>{selectConnection(connection, 'destination')}
            </Table.Td>

            <Table.Td><Select
                searchable={true}
                size="xs"
                data={protocols.map((protocol) => { return {value: protocol.value, label: protocol.label}})}
                key={'protocol-' + connection._id}
                onChange={(protocol) => {
                  if (protocols.find((p) => p.value === protocol).defaultPort) {
                    document.getElementById('port-' + connection._id).value = protocols.find((p) => p.value === protocol).defaultPort
                  } else {
                      document.getElementById('port-' + connection._id).value = '';
                  }
                }}
                placeholder="Select protocol"/>
            </Table.Td>
            <Table.Td>
                <NumberInput
                    size="xs"
                    key={'port-' + connection._id}
                    id={'port-' + connection._id}
                    placeholder="Custom Port"
                /></Table.Td>
            <Table.Td>
                <Button size="xs" onClick={(evt) => {
                    addMoreOptions(connection._id)
                }}>More Options</Button>
            </Table.Td>
            <Table.Td>
                <Button color="#f00" size="xs" key={'delete-' + connection._id} id={connection._id}
                              onClick={(e) => {removeConnection(connection._id)}}>
                    <IconTrash/>
                </Button>
            </Table.Td>


    </Table.Tr>)
}