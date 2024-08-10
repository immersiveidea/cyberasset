import {NetworkConnections} from "./networkConnections/networkConnections.tsx";
import {Card, Group, Select, Stack, TextInput} from "@mantine/core";
import Diagram from "./diagram.tsx";

const images = ['ubuntu', 'redhat', 'windows', 'alpine', 'debian']

export function Platform(data) {
    const connections = <NetworkConnections data={data}/>
    switch (data.component_type) {
        case 'Function InventoryPage':
            return <Stack>
                <Card withBorder radius="md" shadow="sm">
                    <div>{data.name} (Function App)</div>
                    <Group>
                        <TextInput label="Language"/>
                        <TextInput label="Runtime"/>
                        <TextInput label="Version"/>
                    </Group>
                </Card>
                {connections}
                <Diagram data={data}/>
            </Stack>
        case 'Microservice API':
            return <Stack>
                <div>{data.name} (Microservice API)</div>
                <Group>
                    <TextInput label="Language"/>
                    <TextInput label="Runtime"/>
                    <Select data={images} label="Base Image"/>
                </Group>
                {connections}
                <Diagram data={data}/>
            </Stack>
        default:
            return <Stack>{connections}
                <Diagram data={data}/>
            </Stack>
    }
}