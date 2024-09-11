import {Button, SimpleGrid} from "@mantine/core";
import {usePouch} from "use-pouchdb";

export default function AdminActions() {
    const data = usePouch();
    const clearComponents = () => {
        data.destroy();

    }
    const clearConnections = () => {
        data.destroy();
    }
    return (
        <SimpleGrid>
            <Button onClick={clearComponents} fullWidth>Clear Components</Button>
            <Button onClick={clearConnections} fullWidth>Clear Connections</Button>
        </SimpleGrid>
    );
}