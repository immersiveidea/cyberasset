import {Modal, MultiSelect, Stack, Textarea, TextInput, Title} from '@mantine/core';
import {useDoc, usePouch} from "use-pouchdb";

import DeleteButton from "../components/deleteButton.tsx";
import {useParams} from "react-router-dom";
import log from "loglevel";
import {deleteComponent} from "../dbUtils.ts";

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
            await deleteComponent(db, doc);
        } catch (err) {
            logger.error(err);
        }
    }

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
        const renderDoc: ComponentType = doc as ComponentType;
        return (
            <Modal w="xl" opened={true} onClose={() => {
                history.back()
            }}>
                <Stack>
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
                    />
                    <Textarea rows={10} label="Description"
                              description="Enter details describing what this component does"
                              placeholder="(i.e.) Web service that does something useful"></Textarea>
                    <MultiSelect label="component type" data={['web', 'database', 'service', 'other']}></MultiSelect>
                    <DeleteButton onClick={deleteDoc} id={params.componentId}/>
                </Stack>
            </Modal>
        );
    }
}