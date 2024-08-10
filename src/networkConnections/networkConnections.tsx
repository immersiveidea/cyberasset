import {Button, Card, Group, Stack, Title} from "@mantine/core";
import {useFind, usePouch} from "use-pouchdb";
import {IconArrowLeftFromArc, IconArrowRightToArc} from "@tabler/icons-react";
import NetworkConnection from "./networkConnection.tsx";

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

export function NetworkConnections(data) {
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

    const items = connections ? connections.map((conn, index) => {
        const connection = conn;
        return (<NetworkConnection key={'connection-' + connection._id} db={db} connection={connection}
                                   components={components} componentId={componentId}/>)
    }) : [];
    return <Card withBorder radius="md" bg="rgba(1,1,1,.5)" p={40}  shadow="sm">
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