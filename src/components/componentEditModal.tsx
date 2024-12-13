import {Button, Modal, Select, Stack, Textarea, TextInput} from "@mantine/core";
import {useEffect, useState} from "react";
import {TemplateComponent} from "../types/templateComponent.ts";

export function ComponentEditModal (props: {component: TemplateComponent, onSave: (data) => void}) {
    const [currentComponent, setCurrentComponent] = useState({} as TemplateComponent);
    useEffect(() => {
        setCurrentComponent(props.component);
    }, [props.component]);

    if (!props.component) {
        return <></>
    }
    const shapes = [{value: 'Rectangle', label: 'Rectangle'}, {value: 'Cylinder', label: 'Cylinder'}];
    console.log(props.component);
    const saveData = () => {
        props.onSave(currentComponent);
    }
    return (
        <Modal opened={true} onClose={() => {props.onSave(null);}} title={currentComponent?.name||''}>
            <Stack>
                <TextInput value={currentComponent?.name||''} onChange={(event) => {setCurrentComponent({...currentComponent,  name: event.currentTarget.value})}}/>
                <Textarea value={currentComponent?.description||''} onChange={(event) => {setCurrentComponent({...currentComponent,  description: event.currentTarget.value})}}/>
                <Select data={shapes} label="Select Shape" id="selectShape" placeholder="Select Shape" onChange={(_value) => {
                    setCurrentComponent({...currentComponent, shape: _value});
                }}/>
                <Button onClick={() => { saveData()}}>Save</Button>
            </Stack>
        </Modal>

    )
}