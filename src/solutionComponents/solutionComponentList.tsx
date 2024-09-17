import {useDoc, useFind, usePouch} from "use-pouchdb";
import {Button, Group, MultiSelect, SimpleGrid, Stack} from "@mantine/core";
import {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";

import SolutionComponentCard from "./solutionComponentCard.tsx";
import {NameId} from "../types/nameId.ts";
import log from "loglevel";

export function SolutionComponentList() {
    const logger = log.getLogger('SolutionComponentList');
    const params = useParams();
    const navigate = useNavigate();
    const db = usePouch();
    const [searchText, setSearchText] = useState('');
    const [componentValues, setComponentValues] = useState([]);

    const {docs: solutionComponents,  loading: solutionComponentsLoading} = useFind({
        index: {
            fields: ['type', 'solution_id', 'name']
        },
        selector: {
            solution_id: params.solutionId,
            type: 'component'
        }
    });
    useEffect(() => {
        setComponentValues(solutionComponents.map((component) => {
            return component.name;
        }));
    }, [solutionComponents])
    const {doc: masterComponents, error: componentsError} = useDoc('components');
    useEffect(() => {

       // db.post({type: 'component', solution_id: params.solutionId, name: 'test'});
    },[componentValues]);

    if (componentsError) {
        if (componentsError.status === 404) {
            db.put({
                _id: 'components',
                type: 'components',
                list: []
            });
        }
    }
    if (solutionComponentsLoading &&
        solutionComponents &&
        solutionComponents.length === 0) return <div>Loading...</div>

    const selectComponent = (event) => {
        navigate('/solution/' + params.solutionId + '/component/' + event.currentTarget.id );
    }
    const saveComponent =  () => {
        const text = searchText.toLowerCase().trim().replace(/[^\p{L}\d]/gu, '');

        if (text.length > 0) {
            // @ts-expect-error - this is a hack to get around the fact that the list is not typed
            const existing = masterComponents.list.find((component) => {return component.name.toLowerCase() === text});
            if (!existing) {
                // @ts-expect-error - this is a hack to get around the fact that the list is not typed
                const newList = [...masterComponents.list, {_id: text.replace(/[^\p{L}\d]/gu, ''), name: searchText}];
                newList.sort((a, b) => {
                    return (a?._id<b?._id?-1:(a?._id>b?._id?1:0));
                });
                db.put({...masterComponents, list: newList}).then(() => {
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
    // @ts-expect-error - this is a hack to get around the fact that the list is not typed
    const renderData = params.solutionId ? solutionComponents : masterComponents.list;

    const renderOut =
        renderData.map((row) => {
            const data = (row as unknown) as NameId;
            return <SolutionComponentCard key={data._id} data={data} selectComponent={selectComponent}/>
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
        logger.debug('onOptionSubmit', e);
    }
    return (<>

            <Stack>
                <Group>
                    <MultiSelect searchable
                                 key="select"
                             searchValue={searchText}
                             value={componentValues}
                             onChange={setComponentValues}
                             onOptionSubmit={onOptionSubmit}
                             onKeyDown={(e) => {
                                 if (e.key === 'Enter') {
                                     saveComponent();
                                 }
                             }}
                             onSearchChange={setSearchText}
                            // @ts-expect-error - this is a hack to get around the fact that the list is not typed
                             data={masterComponents.list.map((x) => x.name)}/>
                <Button key="save">Save</Button>
                </Group>
                <SimpleGrid cols={6}>
                    {renderOut}
                </SimpleGrid>

            </Stack>

        </>
    )
}