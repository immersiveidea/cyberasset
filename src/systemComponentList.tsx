import {useFind} from "use-pouchdb";
import {usePouch} from "use-pouchdb";
import {Button, ScrollArea, Stack, Title} from "@mantine/core";


export function SystemComponentList(data) {
    const selectedComponent = data.selectedComponent;
    const setSelectedComponent = data.setSelectedComponent;
    const db = usePouch();
    const { docs, warning, state, loading, error } = useFind({
        index: {
            fields: ['type', 'name']
        },
        selector: {
            type: 'component'
        }
    });
    const setCurrentComponent = async (id) => {
        try {
            const doc = await db.get('state', {include_docs: true});
            await db.put({...doc, selectedComponent: id});
        } catch (error) {
            await db.put({_id: 'state', selectedComponent: id});
        }
    }
    const  createComponent = () => {
        db.post({
            name: 'New Component',
            type: 'component'
        });
    }

    const selectComponent = (event) => {
        setSelectedComponent(event.currentTarget.id);
    }

    if (loading && docs && docs.length === 0) return <div>Loading...</div>

    if ( state === 'error' && error) {
        return <div>Error: {error.message}</div>
    }
    if (!docs) return <Button variant="dark" size="xl" onClick={createComponent}>New Component</Button>

    const  rowRender =
        docs.map((row, index) => {
            if (selectedComponent == row._id) {
                return <Button disabled fullWidth size="compact-md" id={row._id} key={row._id} variant= "light" onClick={selectComponent}>{row.name || row._id}</Button>
            } else {
                return <Button fullWidth size="compact-md" id={row._id} key={row._id} variant= "light" onClick={selectComponent}>{row.name || row._id}</Button>
            }

        })
    return (
        <div>

            <Stack>
                <Title order={3}>Components</Title>
                <Button variant="dark" onClick={createComponent}>New Component</Button>
                <ScrollArea h={250} type="auto" scrollbarSize={20}>
                    <Stack gap="xs">
                        {rowRender}
                    </Stack>
                </ScrollArea>
            </Stack>

        </div>
    )
}