import {SolutionFlowStep} from "../types/solutionFlowStep.ts";
import {Stack, Group, Select, Modal, Textarea, TextInput, Button, Box} from "@mantine/core";
import {useEffect, useState} from "react";
import {TemplateComponent} from "../types/templateComponent.ts";
import {ExampleMessageEditor} from "./exampleMessageEditor.tsx";
import {usePouch} from "use-pouchdb";
import log from "loglevel";


export function FlowStepEditModal(props: {flowStep: SolutionFlowStep, components: Map<string, TemplateComponent>})  {
    const logger = log.getLogger('FlowStepEditModal');
    const [currentFlowstep, setCurrentFlowstep] = useState({} as SolutionFlowStep);
    const db = usePouch();
    const messageFormats = [
        {value: 'json', label: 'JSON', icon: '<IconJson/>'},
        {value: 'xml', label: 'XML', icon: '<IconXml/>'},
        {value: 'yaml', label: 'YAML', icon: '<IconYaml/>'},
        {value: 'binary', label: 'Binary', icon: '<IconBinary/>'},
        {value: 'text', label: 'Plain Text', icon: '<IconText/>'},
        {value: 'base64text', label: 'Base64 Binary', icon: '<IconText/>'},
    ]
    const protocols = [

        {value: 'http', label: 'HTTP', icon: '<IconHttp/>', hasMethod: true},
        {value: 'https', label: 'HTTPS', icon: '<IconHttps/>', hasMethod: true},
        {value: 'amqp', label: 'AMQP', icon: '<IconAmqp/>'},
        {value: 'mqtt', label: 'MQTT', icon: '<IconMqtt/>'},
        {value: 'kafka', label: 'Kafka', icon: '<IconKafka/>'},
        {value: 'nats', label: 'NATS', icon: '<IconNats/>'},
        {value: 'ws', label: 'Websockets', icon: '<IconWebsockets/>'},
        {value: 'tcp', label: 'TCP', icon: '<IconTcp/>'},
        {value: 'udp', label: 'UDP', icon: '<IconUdp/>'},
    ]
    const methods = [
        {value: 'GET', label: 'GET'},
        {value: 'POST', label: 'POST'},
        {value: 'PUT', label: 'PUT'},
        {value: 'DELETE', label: 'DELETE'},
        {value: 'PATCH', label: 'PATCH'},
        {value: 'OPTIONS', label: 'OPTIONS'},
        {value: 'HEAD', label: 'HEAD'},
    ]
    useEffect(() => {
        setCurrentFlowstep(props.flowStep);
        if (props.flowStep) {
            logger.debug('flowstep', props.flowStep);
        }
    }, [props.flowStep]);
    if (currentFlowstep == null || !props.components) {
        return <></>
    }
    const save = async () => {
        logger.debug('flowstep', currentFlowstep);
        try {
            await db.put(currentFlowstep);
        } catch (err) {
            logger.error(err);
        }
        setCurrentFlowstep(null);
        //setCurrentFlowstep({...currentFlowstep});
    }
    const method = () => {
        const width="10ex";
        if (currentFlowstep.protocol === 'http' || currentFlowstep.protocol === 'https') {
            return <Select label="Method" w={width} value={currentFlowstep.method} id="method" data={methods}
              onChange={(value)=>{
                currentFlowstep.method = value;
                setCurrentFlowstep({...currentFlowstep});
              }}/>
        } else {
            return <Select disabled={true} label="Method" w={width} value={currentFlowstep.method} id="method" data={methods}
                    onChange={(value)=>{
                        currentFlowstep.method = value;
                        setCurrentFlowstep({...currentFlowstep});
                    }}/>

        }

    }
    return (
        <Modal opened={true} size="100%" onClose={()=> {setCurrentFlowstep(null)}}>

            <h1>Message Details</h1>

            <Group>
                <TextInput label="Sequence" disabled={true} w="8ex"
                           value={currentFlowstep.sequence} id="sequence" readOnly/>
                <TextInput label="Source" disabled={true} value={props.components.get(currentFlowstep.source)?.name} id="source" readOnly/>
                <TextInput label="Destination" disabled={true} value={props.components.get(currentFlowstep.destination)?.name} id="destination" readOnly/>


            </Group>
            <TextInput label="Message Name" value={currentFlowstep.name} id="name" onChange={(value) => {
                currentFlowstep.name = value.currentTarget.value;
                setCurrentFlowstep({...currentFlowstep});
            }}/>
            <Textarea autosize minRows={2} label="Description" value={currentFlowstep.description} id="sequence"
                onChange={(value)=>{
                    currentFlowstep.description = value.currentTarget.value;
                    setCurrentFlowstep({...currentFlowstep});
                }}/>
            <Group>
                <Select label="Protocol" value={currentFlowstep.protocol} id="protocol" data={protocols}
                    onChange={(value) => {
                        currentFlowstep.protocol = value;
                        if (value !== 'http' && value !== 'https') {
                            logger.debug('setting method to empty');
                            currentFlowstep.method = '';
                        }
                        setCurrentFlowstep({...currentFlowstep});
                    }}/>
                {method()}
                <TextInput label="Host" w="30ex" value={currentFlowstep.host} id="host"
                    onChange={(value)=> {
                        currentFlowstep.host = value.currentTarget.value;
                        setCurrentFlowstep({...currentFlowstep});
                    }}/>
                <TextInput label="Port" w="8ex" value={currentFlowstep.port} id="port"
                    onChange={(value)=> {
                        currentFlowstep.port = parseInt(value.currentTarget.value);
                        setCurrentFlowstep({...currentFlowstep});
                    }}/>
                <TextInput label="path" value={currentFlowstep.path} id="path"
                    onChange={(value)=> {
                        currentFlowstep.path = value.currentTarget.value;
                        setCurrentFlowstep({...currentFlowstep});
                    }}/>
                <Select label="Message Format" value={currentFlowstep.messageformat} id="messageformat" data={messageFormats} onChange={(value) => {
                    currentFlowstep.messageformat = value;
                    setCurrentFlowstep({...currentFlowstep});
                }}/>
            </Group>
            <ExampleMessageEditor format={currentFlowstep.messageformat} message={currentFlowstep.message || ''} update={(message)=> {
                currentFlowstep.message = message;
                setCurrentFlowstep({...currentFlowstep});
            }}/>
            <Button onClick={save}>Save</Button>

        </Modal>
    )
}