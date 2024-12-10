import {Card, Group} from "@mantine/core";
import SelectButton from "./buttons/selectButton.tsx";
import {TemplateComponent} from "../types/templateComponent.ts";
import {useState} from "react";
import {ComponentEditModal} from "./componentEditModal.tsx";
import DeleteButton from "./buttons/deleteButton.tsx";

export function ComponentCard(props: {component: TemplateComponent, update: (data) => void}) {
    const [selected, setSelected] = useState(null);
    const editModal = () => {
        if (selected) {
            return (
                <ComponentEditModal component={selected} onSave={(data) => {
                    if (data) {
                        props.update(data);
                    }
                    setSelected(null);
                }}/>
            )
        }
    }
    const removeComponent = (component) => {
        component._deleted = true;
        props.update(component);
    }
    return (
        <>
            <Card key={props.component._id}>
                <Card.Section key="data" p={5}>
                    {props.component.name}
                </Card.Section>
                <Card.Section key="buttons" p={5}>
                    <Group>
                        <SelectButton key="select" id={props.component._id} onClick={() => setSelected(props.component)}/>
                        <DeleteButton key="delete" id={props.component._id} onClick={() => removeComponent(props.component)}/>
                    </Group>

                </Card.Section>
            </Card>
            {editModal()}
        </>
    )
}