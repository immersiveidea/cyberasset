import {Button, SimpleGrid, Stack} from "@mantine/core";
import {usePouch} from "use-pouchdb";

export default function AdminActions() {
    const connectionDb = usePouch('connections');
    const componentDb = usePouch('components');
    const clearComponents = () => {
        componentDb.destroy();

    }
    const clearConnections = () => {
        connectionDb.destroy();
    }
    return (
        <SimpleGrid>
            <Button onClick={clearComponents} fullWidth>Clear Components</Button>
            <Button onClick={clearConnections} fullWidth>Clear Connections</Button>
        </SimpleGrid>
    );
}