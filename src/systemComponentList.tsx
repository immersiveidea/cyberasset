import {useDoc, useFind, usePouch} from "use-pouchdb";
import {Button, Grid, MultiSelect, NavLink, SimpleGrid, Stack, TextInput, Title} from "@mantine/core";
import {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {IconStar, IconStarFilled} from "@tabler/icons-react";
import SystemComponentCard from "./systemComponentCard.tsx";
type NameId = {
    _id: string;
    name: string;
}

export function SystemComponentList() {
    const params = useParams();
    const navigate = useNavigate();
    const db = usePouch();
    const [searchText, setSearchText] = useState('');

    const {docs, state, loading, error} = useFind({
        index: {
            fields: ['type', 'solution_id', 'name']
        },
        selector: {
            solution_id: params.solutionId,
            type: 'component'
        }
    });
    const {doc: components, error: componentsError} = useDoc('components');
    if (componentsError) {
        if (componentsError.status === 404) {
            db.put({
                _id: 'components',
                type: 'components',
                list: []
            });
        }
    }
    if (loading && docs && docs.length === 0) return <div>Loading...</div>

    if (state === 'error' && error) {
        return <div>Error: {error.message}</div>
    }

    const selectComponent = (event) => {
        navigate('/solution/' + params.solutionId + '/component/' + event.currentTarget.id );
    }
    const saveComponent =  () => {
        const text = searchText.toLowerCase().trim().replace(/[^\p{L}\d]/gu, '');

        if (text.length > 0) {
            const existing = components.list.find((component) => {return component.name.toLowerCase() === text});
            if (!existing) {
                const newList = [...components.list, {_id: text.replace(/[^\p{L}\d]/gu, ''), name: searchText}];
                newList.sort((a, b) => {
                    return (a?._id<b?._id?-1:(a?._id>b?._id?1:0));
                });
                db.put({...components, list: newList}).then(() => {
                    if (params.solutionId) {
                        db.post({type: 'component', name: searchText, solution_id: params.solutionId}).then(() => {

                        });
                        setSearchText('');
                    }
                });
            } else {
                if (params.solutionId) {
                    db.post({type: 'component', name: searchText, solution_id: params.solutionId});
                }
            }
        }
            setSearchText('');
    }

    const renderData = params.solutionId ? docs : components.list;

    const renderOut =
        renderData.map((row) => {
            const data = (row as unknown) as NameId;
            return <SystemComponentCard key={data._id} data={data} selectComponent={selectComponent}/>
        })

    /*
    <TextInput placeholder="Search" value={searchText}
                   onKeyPress={(e) => {
                       if (e.key === 'Enter') {
                           saveComponent();
                       }
                   }}
                   onChange={(e) => {setSearchText(e.currentTarget.value)}}/>

     */
    const onOptionSubmit = (e) => {
        console.log(e);
    }
    return (<>

            <Stack>
                <MultiSelect searchable
                             searchValue={searchText}
                             onOptionSubmit={onOptionSubmit}
                             onKeyPress={(e) => {
                                 if (e.key === 'Enter') {
                                     saveComponent();
                                 }
                             }}
                             onSearchChange={setSearchText}
                             data={components.list.map((x) => x.name)}/>
                <SimpleGrid cols={6}>
                    {renderOut}
                </SimpleGrid>

            </Stack>

        </>
    )
}