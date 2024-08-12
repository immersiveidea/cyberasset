import {useFind, usePouch} from "use-pouchdb";
import {Button, Drawer, Group, Menu, NavLink, ScrollArea, Stack, TextInput} from "@mantine/core";
import {useDisclosure} from "@mantine/hooks";
import {useState} from "react";
import Divider = Menu.Divider;


export function SystemComponentList(data) {
    const selectedComponent = data.selectedComponent;
    const setSelectedComponent = data.setSelectedComponent;
    const db = usePouch();
    const [componentValue, setComponentValue] = useState('');
    const {docs, state, loading, error} = useFind({
        index: {
            fields: ['type', 'name']
        },
        selector: {
            type: 'component'
        }
    });
    const [opened, {open, close}] = useDisclosure();
    const createComponent = () => {
        db.post({
            name: componentValue,
            type: 'component'
        }).then((response) => {
            setSelectedComponent(response.id);
            setComponentValue('');
            const el = document.getElementById(response.id + '-name');
            if (el) {
                el.focus();
            } else {
                window.setTimeout(() => {
                    const el2 = document.getElementById(response.id + '-name');
                    if (el2) {
                        el2.focus();
                    }
                }, 500);
            }

        });
    }

    const selectComponent = (event) => {
        setSelectedComponent(event.currentTarget.id);
        close();
    }

    if (loading && docs && docs.length === 0) return <div>Loading...</div>

    if (state === 'error' && error) {
        return <div>Error: {error.message}</div>
    }
    if (!docs) return createControl()
    const rowRender =
        docs.map((row, index) => {
            if (selectedComponent == row._id) {
                return <NavLink disabled size="compact-md" id={row._id} key={row._id}
                                onClick={selectComponent} label={row.name || row._id}/>
            } else {
                return <NavLink size="compact-md" id={row._id} key={row._id}
                                onClick={selectComponent} label={row.name || row._id}/>
            }

        })
    const createControl = () => {
        return (
            <Stack>

                <Group >
                <TextInput onChange={(event) => {setComponentValue(event.currentTarget.value)}} value={componentValue} label="Component Name"/>
                <Button mt={24} variant="dark" onClick={createComponent}>Add</Button>
                    <Button justify="right" mt={24} onClick={open}>Components</Button>
                </Group>

                <Drawer opened={opened} onClose={close} padding="md" title="Components">
                    <Menu>
                        {rowRender}
                    </Menu>
                </Drawer>

            </Stack>
        )
    }

    return createControl()

}