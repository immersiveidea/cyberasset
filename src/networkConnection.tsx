import {Badge, Box, Button, Group, NumberInput, Select} from "@mantine/core";
import {IconArrowLeftFromArc, IconArrowRightToArc, IconTrash} from "@tabler/icons-react";
const protocols = ['HTTP', 'HTTPS', 'TCP', 'UDP', 'MQTT', 'AMQP', 'CoAP', 'Websockets']
export default function NetworkConnection(data) {
    const componentId = data.componentId;
    const connection = data.connection;
    const db = data.db;
    const components = data.components;
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
        if (direction==='source' && connection.source === componentId) {
            return (
                <></>
            )
        }
        if (direction==='destination' && connection.destination === componentId) {
            return (
                <></>
            )
        }

        return( <Select
            label={direction==='source' ? 'From' : 'To'}
            size="xs"
            key={'source-' + connection._id}
            onChange={(source) => {
                if (direction==='source') {
                    updateSource(connection._id, source)
                } else {
                    updateDestination(connection._id, source)
                }
            }}
            data={components && components.length > 0 ? components.map((doc) => {
                return {value: doc._id, label: doc.name}
            }) : []}
            value={direction=='source'?connection.source:connection.destination}
            placeholder="Select Existing Component"/>);
    }
    const rowIcon = (connection) => {
        if (connection.source != componentId) {
            return <Box w={120} pt={28}>
                <Badge leftSection={<IconArrowRightToArc/>}>Inbound</Badge>
            </Box>
        } else {
            return <Box w={120} pt={20}>
                <Badge rightSection={<IconArrowLeftFromArc/>}>Outbound</Badge>
            </Box>
        }
    }
    return (<Group key={'group-' + connection._id}>
        {rowIcon(connection)}
        {selectConnection(connection, 'source')}
        {selectConnection(connection, 'destination')}

        <Select
            size="xs"
            label="Protocol"
            data={protocols}
            key={'protocol-' + connection._id}
            placeholder="Select protocol"/>

        <NumberInput
            size="xs"
            label="Port"
            key={'port-' + connection._id}
            placeholder="Port"
        />
        <Box pt={24}>
            <Button size="xs" onClick={(evt)=>{ addMoreOptions(connection._id)}}>More Options</Button>
        </Box>
        <Box pt={24}>
            <Button leftSection={<IconTrash/>} size="xs" color="red" key={'delete-' + connection._id}
                    onClick={(e) => {
                        removeConnection(connection._id);
                    }}>Delete</Button>
        </Box>

    </Group>)
}