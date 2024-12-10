import {Card} from "@mantine/core";
import SelectButton from "./buttons/selectButton.tsx";
import {TemplateComponent} from "../types/templateComponent.ts";
import {useState} from "react";
import {ComponentEditModal} from "../template/componentEditModal.tsx";

export function ComponentCard(props: {component: TemplateComponent, update: (data) => void}) {
    const [selected, setSelected] = useState(null);
    const editModal = () => {
        if (selected) {
            return (
                <ComponentEditModal component={selected} closed={(data) => {
                    if (data) {
                        props.update(data);
                    }
                    setSelected(null);
                }}/>
            )
        }
    }
    return (
        <>
            <Card key={props.component._id}>
                <Card.Section>
                    {props.component.name}
                </Card.Section>
                <Card.Section>
                    <SelectButton id={props.component._id} onClick={() => setSelected(props.component)}/>
                </Card.Section>
            </Card>
            {editModal()}
        </>

    )
}