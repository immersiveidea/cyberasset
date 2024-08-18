import {Button, Card, Group, Stack, Table, Title} from "@mantine/core";
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

export function NetworkConnections({component, connections}) {
    const db = usePouch();
    const {docs: components} = useFind(COMPONENT_QUERY);
    const componentId = component._id;

    //const {docs: connections} = useFind(CONNECTION_QUERY);

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

    const items = connections && connections.length>0? connections.map((conn, index) => {
        const connection = conn;

        return (<NetworkConnection key={'connection-' + connection._id} db={db} connection={connection}
                                   components={components} componentId={componentId}/>)
    }) : [];
    return <Card m={20} withBorder radius="md" bg="rgba(1,1,1,.5)" p={40}  shadow="sm">
        <Title order={4} key='connections'>{connections.length} Connections</Title>
        <Table>
            <Table.Thead>
                <Table.Tr>
                    <Table.Th>Direction</Table.Th>
                    <Table.Th>Source</Table.Th>
                    <Table.Th>Destination</Table.Th>
                    <Table.Th>Protocol</Table.Th>
                    <Table.Th>Port</Table.Th>
                    <Table.Th>Actions</Table.Th>
                </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
                {items}
            </Table.Tbody>
        </Table>
        <Group key='buttons'>
            {button(<IconArrowRightToArc/>, addInboundConnection, 'New Inbound Connection', 'inbound')}
            {button(<IconArrowLeftFromArc/>, addOutboundConnection, 'New Outbound Connection', 'outbound')}
        </Group>
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