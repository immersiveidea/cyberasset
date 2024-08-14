import {Card, Group, Select, TextInput} from '@mantine/core';
import {useDoc, usePouch} from "use-pouchdb";
import {Platform} from "./platform.tsx";
import DeleteButton from "./components/deleteButton.tsx";
import {useDebouncedCallback, useThrottledCallback} from "@mantine/hooks";
import {useState} from "react";


export function SystemComponent(data) {
    const db = usePouch('components');

    const selectedComponent = data.selectedComponent;
    const {doc, loading, state, error} = useDoc(selectedComponent || '');

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

    if (!selectedComponent) return <h1>Empty</h1>;


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
        return <div>Empty</div>
    } else {
        return (<Card withBorder={true} m={10} bg="rgba(0,0,0,.3)">
                <Group>
                    <TextInput
                        id={selectedComponent + '-name'}
                        withAsterisk
                        label="Name"
                        value={doc.name || ''}
                        onChange={(e) => {
                            doc.name = e.currentTarget.value;
                            updateDoc(doc);
                        }}
                        placeholder="Name of Component"
                        size='sm'/>
                    <TextInput label="Network Location"
                               placeholder="IP Address, hostname, container name"
                               value={doc.network_location || ''}
                               size='sm'
                               onChange={(e) => {
                                   doc.network_location = e.currentTarget.value;
                                   updateDoc(doc);
                               }}/>
                    <Select searchable={true} label="Type" placeholder="Select type"
                            data={options}
                            value={doc.component_type || ''}
                            onChange={(e) => {
                                doc.component_type = e;
                                updateDoc(doc);
                            }}/>
                    <DeleteButton onClick={deleteDoc} id={selectedComponent}/>
                </Group>
                {Platform(doc)}
            </Card>
        );
    }
}