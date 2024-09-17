import {Card, Group, Modal, Select, TextInput, Title} from '@mantine/core';
import {useDoc, useFind, usePouch} from "use-pouchdb";
import {Platform} from "../platform.tsx";
import DeleteButton from "../components/deleteButton.tsx";
import {useNavigate, useParams} from "react-router-dom";
import log from "loglevel";


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
    const logger = log.getLogger('SolutionComponent');
    const db = usePouch();
    const params = useParams();
    const {doc, loading, state, error} = useDoc(params.componentId);
    const updateDoc = async (doc) => {
        await db.put(doc);
    };

    const deleteDoc = async (doc) => {
        try {
            const existing = await db.get(doc);
            await db.remove(existing);
        } catch (err) {
            logger.error(err);
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
        logger.warn('doc not found', params);
        return <Title>Component not found</Title>
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
                    <DeleteButton onClick={deleteDoc} id={params.componentId}/>
                </Group>

            </Modal>
        );
    }
}