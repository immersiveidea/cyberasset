import {ActionIcon, Box, Button, NumberInput, Select, Table} from "@mantine/core";
import {
    IconArrowDown,
    IconArrowLeftFromArc,
    IconArrowRightToArc,
    IconArrowUp, IconBoxAlignBottomFilled, IconBoxAlignTopFilled,
    IconCircle,
    IconTrash
} from "@tabler/icons-react";
const protocols = [
    {value: 'ftp', label: 'FTP', defaultPort: 21},
    {value: 'ssh', label: 'SSH', defaultPort: 44},
    {value: 'http', label: 'HTTP', defaultPort: 80},
    {value: 'https', label: 'HTTPS', defaultPort: 443},
    {value: 'tcp', label: 'TCP', defaultPort: null},
    {value: 'udp', label: 'UDP', defaultPort: null},
]
export default function NetworkConnection({componentId, connection, db, components, index, last}) {
    console.log(connection);
    const addMoreOptions = (id) => {
        console.log(id);
    }
    const removeConnection = async () => {
        console.log('remove', connection._id);
        await db.remove(connection);
    }
    const updateSource = async (value) => {
        connection.source = value;
        connection.components = [{id: connection.source}, {id: connection.destination}];
        await db.put(connection);
    }
    const updateDestination = async (value) => {
        connection.destination = value;
        connection.components = [{id: connection.source}, {id: connection.destination}];
        await db.put(connection);
    }
    const selectConnection = (direction) => {
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
                    updateSource(source)
                } else {
                    updateDestination(source)
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
    const moveUp= () => {
        connection.rank = connection.prev;
        db.put(connection);

    }
    const moveDown= () => {
        connection.rank = connection.next;
        db.put(connection);
    }
    return (<Table.Tr key={'group-' + connection._id}>
        <Table.Td>{rowIcon(connection)}
            </Table.Td>
        <Table.Td>
            {index>0?<ActionIcon onClick={moveUp}><IconArrowUp/></ActionIcon>:<IconBoxAlignTopFilled/>}
            {!last?<ActionIcon onClick={moveDown}><IconArrowDown/></ActionIcon>:<IconBoxAlignBottomFilled/>}
        </Table.Td>
            <Table.Td>{selectConnection( 'source')}
            </Table.Td>
            <Table.Td>{selectConnection('destination')}
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
                              onClick={removeConnection}>
                    <IconTrash/>
                </Button>
            </Table.Td>
    </Table.Tr>)
}