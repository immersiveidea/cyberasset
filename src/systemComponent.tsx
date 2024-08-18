import {Card, Group, Select, TextInput} from '@mantine/core';
import {useDoc, useFind, usePouch} from "use-pouchdb";
import {Platform} from "./platform.tsx";
import DeleteButton from "./components/deleteButton.tsx";



export function SystemComponent({selectedComponent}) {
    const db = usePouch();
    const {doc, loading, state, error} = useDoc(selectedComponent);
    const CONNECTION_QUERY = {
        index: {
            fields: ['type', 'components']
        },
        selector: {
            type: 'connection',
            components: {
                $elemMatch: {
                    id: {
                        $eq: selectedComponent
                    }
                }
            }
        }
    };

    const {docs: connections, state: connectionState} = useFind(CONNECTION_QUERY);

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
                        defaultValue={doc.name || ''}
                        onBlur={(e) => {
                            doc.name = e.currentTarget.value;
                            updateDoc(doc);
                        }}
                        placeholder="Name of Component"
                        size='sm'/>
                    <TextInput label="Network Location"
                               placeholder="IP Address, hostname, container name"
                               defaultValue={doc.network_location || ''}
                               size='sm'
                               onBlur={(e) => {
                                   doc.network_location = e.currentTarget.value;
                                   updateDoc(doc);
                               }}/>
                    <Select searchable={true} label="Type" placeholder="Select type"
                            data={options}
                            defaultValue={doc.component_type || ''}
                            onChange={(e, option) => {
                                doc.component_type = option.value;
                                updateDoc(doc);
                            }}/>
                    <DeleteButton onClick={deleteDoc} id={selectedComponent}/>
                </Group>
                <Platform component={doc} connections={connections}/>


            </Card>
        );
    }
}