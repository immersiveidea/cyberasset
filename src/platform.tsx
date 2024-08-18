import {NetworkConnections} from "./networkConnections/networkConnections.tsx";
import {Card, Group, Select, Stack, TextInput} from "@mantine/core";
import Diagram from "./diagram.tsx";

const images = ['ubuntu', 'redhat', 'windows', 'alpine', 'debian']

export function Platform({component, connections}) {
    const connectionElement = <NetworkConnections component={component} connections={connections}/>

    switch (component.component_type) {
        case 'Function InventoryPage':
            return <Stack>
                <Card withBorder radius="md" shadow="sm">
                    <div>{component.name} (Function App)</div>
                    <Group>
                        <TextInput label="Language"/>
                        <TextInput label="Runtime"/>
                        <TextInput label="Version"/>
                    </Group>
                </Card>
                {connectionElement}
                <Diagram data={component}/>
            </Stack>
        case 'Microservice API':
            return <Stack>
                <div>{component.name} (Microservice API)</div>
                <Group>
                    <TextInput label="Language"/>
                    <TextInput label="Runtime"/>
                    <Select data={images} label="Base Image"/>
                </Group>
                {connectionElement}
                <Diagram data={component}/>
            </Stack>
        default:
            return <Stack>{connectionElement}
                <Diagram data={component}/>
            </Stack>
    }
}