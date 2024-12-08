import {Button, Modal, Stack, Textarea, TextInput} from "@mantine/core";
import {useEffect, useState} from "react";
import {TemplateComponent} from "../types/templateComponent.ts";

export function TemplateComponentView(props: {component: TemplateComponent, closed: (data) => void}) {
    const [currentComponent, setCurrentComponent] = useState({} as TemplateComponent);
    useEffect(() => {
        setCurrentComponent(props.component);
    }, [props.component]);

    if (!props.component) {
        return <></>
    }
    console.log(props.component);
    const saveData = () => {
        props.closed(currentComponent);
    }
    return (
        <Modal opened={true} onClose={() => {props.closed(null);}} title={currentComponent?.name||''}>
            <Stack>
                <TextInput value={currentComponent?.name||''} onChange={(event) => {setCurrentComponent({...currentComponent,  name: event.currentTarget.value})}}/>
                <Textarea value={currentComponent?.description||''} onChange={(event) => {setCurrentComponent({...currentComponent,  description: event.currentTarget.value})}}/>
                <Button onClick={() => { saveData()}}>Save</Button>
            </Stack>
        </Modal>

    )
}