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
        {value: 'html', label: 'HTML', icon: '<IconText/>'},
        {value: 'text', label: 'Plain Text', icon: '<IconText/>'},
        {value: 'xml', label: 'XML', icon: '<IconXml/>'},
        {value: 'yaml', label: 'YAML', icon: '<IconYaml/>'},
        {value: 'binary', label: 'Binary', icon: '<IconBinary/>'},
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
    const isResponse: boolean = !!currentFlowstep.responseTo;
    const method = () => {
        const width="10ex";
        if ((currentFlowstep.protocol === 'http' || currentFlowstep.protocol === 'https') &&  !isResponse) {
            return <Select label="Method" w={width} value={currentFlowstep.method} id="method" data={methods}
              onChange={(value)=>{
                setCurrentFlowstep({...currentFlowstep, method: value});
              }}/>
        } else {
            return <Select disabled={true} label="Method" w={width} value={currentFlowstep.method} id="method" data={methods}
                    onChange={(value)=>{
                        setCurrentFlowstep({...currentFlowstep, method: value});
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
                setCurrentFlowstep({...currentFlowstep, name: value.currentTarget.value});
            }}/>
            <Textarea autosize minRows={2} label="Description" value={currentFlowstep.description} id="sequence"
                onChange={(value)=>{
                    setCurrentFlowstep({...currentFlowstep, description: value.currentTarget.value});
                }}/>
            <Group>
                <Select label="Protocol" disabled={isResponse} value={currentFlowstep.protocol} id="protocol" data={protocols}
                    onChange={(value) => {
                        let method = currentFlowstep.method;

                        if (value !== 'http' && value !== 'https') {
                            logger.debug('setting method to empty');
                            method = '';
                        }
                        setCurrentFlowstep({...currentFlowstep, protocol: value, method: method});
                    }}/>
                {method()}
                <TextInput label="Host"  disabled={isResponse}  w="30ex" value={currentFlowstep.host} id="host"
                    onChange={(value)=> {
                        setCurrentFlowstep({...currentFlowstep, host: value.currentTarget.value});
                    }}/>
                <TextInput label="Port" w="8ex"  disabled={isResponse} value={currentFlowstep.port} id="port"
                    onChange={(value)=> {

                        setCurrentFlowstep({...currentFlowstep, port: parseInt(value.currentTarget.value)});
                    }}/>
                <TextInput label="path"  disabled={isResponse}  value={currentFlowstep.path} id="path"
                    onChange={(value)=> {
                        setCurrentFlowstep({...currentFlowstep, path: value.currentTarget.value});
                    }}/>
                <Select label="Message Format" value={currentFlowstep.messageformat} id="messageformat" data={messageFormats} onChange={(value) => {
                    setCurrentFlowstep({...currentFlowstep, messageformat: value});
                }}/>
            </Group>
            <ExampleMessageEditor format={currentFlowstep.messageformat} message={currentFlowstep.message || ''} update={(message)=> {
                setCurrentFlowstep({...currentFlowstep, message: message});
            }}/>
            <Button onClick={save}>Save</Button>

        </Modal>
    )
}