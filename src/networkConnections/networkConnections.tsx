import {Button, Card, Group, Stack, Table, Title} from "@mantine/core";
import {useFind, usePouch} from "use-pouchdb";
import {IconArrowLeftFromArc, IconArrowRightToArc} from "@tabler/icons-react";
import NetworkConnection from "./networkConnection.tsx";
import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";


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

export function NetworkConnections() {
    const db = usePouch();
    const params = useParams();
    const {docs: components, state: componentsState} = useFind(COMPONENT_QUERY);
    const CONNECTION_QUERY = {
        index: {
            fields: ['type', 'components', 'rank']
        },
        selector: {
            type: 'connection',
            components: {
                $elemMatch: {
                    id: {
                        $eq: params.componentId
                    }
                }
            }
        }
    };
    const {docs: connections, error: connectionError, state: connectionState} = useFind(CONNECTION_QUERY);

    const [maxRank, setMaxRank] = useState(connections?.length);
    const [connDisplay, setConnDisplay] = useState([]);
    console.log(connections.length);
    useEffect(() => {
        const conns = connections.toSorted((a, b) => { return a.rank - b.rank });
        if (conns.length > 1) {
            setMaxRank(conns[conns.length-1].rank+1);
        } else {
            if (conns.length == 1) {
                setMaxRank(conns[0].rank);
            }

        }

        for (let i = 0; i < conns?.length || 0; i++) {
            const c = conns[i];
            if (i == 1) {
                c.prev = conns[0].rank/2;
            }
            if (i>1) {
                c.prev = (conns[i-1].rank + conns[i-2].rank)/2;
            }
            if (i<connections.length-2) {
                c.next = (conns[i+1].rank + conns[i+2].rank) /2;
            }
            if (i == connections.length-2) {
                c.next = conns[connections.length-1].rank + 1;
            }
        }
        setConnDisplay(conns);

    }, [connections]);
    if (connectionState !== 'done') return <div>Loading Connections...</div>;
    if (componentsState !== 'done') return <div>Loading Components...</div>;

    const componentId = params.componentId;

    const addOutboundConnection =() => {
        db.post({name: 'New Connection',
            type: 'connection',
            source: componentId,
            rank: maxRank+1,
            components: [{id: componentId}]});
    }
    const addInboundConnection = () => {
        db.post({
            name: 'New Connection',
            type: 'connection',
            destination: componentId,
            rank: maxRank+1,
            components: [{id: componentId}]
        });
    }

    const items = connDisplay && connDisplay.length>0? connDisplay.map((conn, index) => {
        const connection = conn;
        console.log('connection', connection);
        return (<NetworkConnection key={'connection-' + connection.rank + '-' + connection._id} db={db} connection={connection}
                                   components={components} componentId={componentId} index={index} last = {index == connDisplay.length-1}/>)
    }) : [];

    return <Card m={20} withBorder radius="md" bg="rgba(1,1,1,.5)" p={40}  shadow="sm">
        <Title order={4} key='connections'>{connections.length} Connections</Title>
        <Table>
            <Table.Thead>
                <Table.Tr>
                    <Table.Th miw={64} w={64}>Direction</Table.Th>
                    <Table.Th miw={80} w={80}>Order</Table.Th>
                    <Table.Th miw={88}>Source</Table.Th>
                    <Table.Th miw={88}>Destination</Table.Th>
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