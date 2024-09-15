import {Card, Group, Modal, Select, TextInput} from '@mantine/core';
import {useDoc, useFind, usePouch} from "use-pouchdb";
import {Platform} from "../platform.tsx";
import DeleteButton from "../components/deleteButton.tsx";
import {useNavigate, useParams} from "react-router-dom";


type ComponentType = {
    _id: string;
    _rev: string;
    type: string;
    name: string;
    network_location: string;
    component_type: string;
    connections: string[];
}

export function SolutionComponent() {
    const db = usePouch();
    const params = useParams();
    const {doc, loading, state, error} = useDoc(params.componentId);



    const updateDoc =async (doc) => {
        await db.put(doc);
    };

    const deleteDoc = async (doc) => {
        try {
            const existing = await db.get(doc);
            await db.remove(existing);
        } catch (err) {
            console.log(err);
        }

    }

    const options = [
        'Function App',
        'Microservice API',
        'SaaS Platform',
        'Web App',
        'Hosted Platform',
        'Network Device',
        'Platform Process',
        'Virtual Machine'
    ]

    if (!params.componentId) return <h1>Empty</h1>;


    if (loading) return <div>Loading...</div>
    if (state === 'error' && error) {
        switch (error.status) {
            case 404:
                return <div>Deleted</div>
            default:
                return <div>Error: {error.message}</div>
        }

    }
    if (!doc) {
        return <></>
    } else {
        const renderDoc: ComponentType= doc as ComponentType;
        return (
            <Modal w="xl" opened={true} onClose={() => {history.back()}}>
                <Group>
                    <TextInput
                        id={params.componentId + '-name'}
                        withAsterisk
                        label="Name"
                        defaultValue={renderDoc.name || ''}
                        onBlur={(e) => {
                            if (renderDoc.name != e.currentTarget.value) {
                                renderDoc.name = e.currentTarget.value;
                                updateDoc(doc);
                            }
                        }}
                        placeholder="Name of Component"
                        size='sm'/>
                    <TextInput label="Network Location"
                               placeholder="IP Address, hostname, container name"
                               defaultValue={renderDoc.network_location || ''}
                               size='sm'
                               onBlur={(e) => {
                                   if (renderDoc.network_location != e.currentTarget.value) {
                                       renderDoc.network_location = e.currentTarget.value;
                                       updateDoc(doc);
                                   }
                               }}/>
                    <Select searchable={true} label="Type" placeholder="Select type"
                            data={options}
                            defaultValue={renderDoc.component_type || ''}
                            onChange={(e, option) => {
                                renderDoc.component_type = option.value;
                                updateDoc(doc);
                            }}/>
                    <DeleteButton onClick={deleteDoc} id={params.componentId}/>
                </Group>
                <Platform/>
            </Modal>
        );
    }
}