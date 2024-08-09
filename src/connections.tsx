import {
    Badge,
    Box,
    Button,
    Card,
    Checkbox,
    Chip,
    Group,
    Notification,
    NumberInput,
    Select,
    Stack,
    Title
} from "@mantine/core";
import {useFind, usePouch} from "use-pouchdb";
import {
    IconArrowLeftFromArc,
    IconArrowRightToArc,
    IconTrash
} from "@tabler/icons-react";

const protocols = ['HTTP', 'HTTPS', 'TCP', 'UDP', 'MQTT', 'AMQP', 'CoAP', 'Websockets']
const COMPONENT_QUERY = {
    index: {
        fields: ['type', 'name']
    },
    selector: {
        type: 'component'
    },
    sort: ['type', 'name'],
    fields: ['_id', 'name']
};

export function Connections(data) {
    const db = usePouch('connections');
    //const [components, setComponents] = useFind({selector: {type: 'component'}});

    const {docs: components} = useFind(COMPONENT_QUERY);
    const componentId = data.data._id;

    const CONNECTION_QUERY = {
        index: {
            fields: ['type', 'components']
        },
        selector: {
            type: 'connection',
            components: {
                $elemMatch: {
                    id: {
                        $eq: componentId
                    }
                }
            }
        },
        db: 'connections'
    };

    const {docs: connections} = useFind(CONNECTION_QUERY);

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
    const addOutboundConnection = () => {
        db.post({name: 'New Connection', type: 'connection', source: componentId, components: [{id: componentId}]});
    }
    const addInboundConnection = () => {
        db.post({
            name: 'New Connection',
            type: 'connection',
            destination: componentId,
            components: [{id: componentId}]
        });
    }
    const removeConnection = async (connectionId) => {
        const doc = await db.get(connectionId);
        await db.remove(doc);
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
    const items = connections ? connections.map((conn, index) => {
        const connection = conn;

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
    }) : [];
    return <Card withBorder radius="md" shadow="sm">
        <Stack>
            <Title order={4} key='connections'>{connections.length} Connections</Title>
            <Group key='buttons'>
                {button(<IconArrowRightToArc/>, addInboundConnection, 'New Inbound Connection', 'inbound')}
                {button(<IconArrowLeftFromArc/>, addOutboundConnection, 'New Outbound Connection', 'outbound')}
            </Group>
            {items}
        </Stack>
    </Card>
}

const button = (icon, onChange, label, key) => {
    if (key === 'inbound') {
        return (<Button key={key} leftSection={icon}
                        onClick={(e) => {
                            onChange();
                        }}>{label}</Button>);
    } else {
        return (<Button key={key} rightSection={icon}
                        onClick={(e) => {
                            onChange();
                        }}>{label}</Button>);
    }

}