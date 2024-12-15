import {Button, Group, NavLink, Text} from "@mantine/core";
import {TemplateComponent} from "../types/templateComponent.ts";
import {useState} from "react";
import {ComponentEditModal} from "./componentEditModal.tsx";
import DeleteButton from "./buttons/deleteButton.tsx";
import {Link, useParams} from "react-router-dom";

export function ComponentCard(props: {component: TemplateComponent, update: (data) => void}) {
    const [selected, setSelected] = useState(null);
    const params = useParams();
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
                    <NavLink key={props.component._id} m={4}
                        label={props.component.name} onClick={() => {setSelected(props.component)}}>
                    </NavLink>
            {editModal()}
        </>
    )
}