import {Card, Textarea} from '@mantine/core';

import log from "loglevel";
import {Editor} from "@monaco-editor/react";


export function ExampleMessageEditor(props: {message: string, format: string, update: (data) => void}) {
    const logger = log.getLogger('ExampleMessageEditor');
    logger.debug(props.format);
    if (props?.format) {
        return (
            <Card h="20em">
                <Editor height="100%" defaultLanguage = {props.format} defaultValue={props.message} onChange={(value) => props.update(value)}/>
            </Card>


        )
    } else {
        return (
            <Textarea value={props.message} autosize label="Example Message"
                      onChange={(event) => props.update(event.currentTarget.value)}/>

        )
    }
}