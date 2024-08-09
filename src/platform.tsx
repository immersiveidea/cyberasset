import {NetworkConnections} from "./networkConnections.tsx";
import {Card, Group, Select, Stack, TextInput} from "@mantine/core";
const images = ['ubuntu', 'redhat', 'windows', 'alpine', 'debian']
export function Platform(data) {
    const connections = <NetworkConnections data={data}/>
    switch(data.component_type) {
        case 'Function App':
            return <Stack>
                <Card withBorder radius="md" shadow="sm"><div>{data.name} (Function App)</div>
                <Group>
                    <TextInput label="Language"/>
                    <TextInput label="Runtime"/>
                    <TextInput label="Version"/>
                </Group>
                </Card>
                {connections}
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
            </Stack>
        default:
            return <div>{connections}</div>
    }
}