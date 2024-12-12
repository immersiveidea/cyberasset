import {useDoc, useFind, usePouch} from "use-pouchdb";
import {Autocomplete, SimpleGrid, Stack, useCombobox} from "@mantine/core";
import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import log from "loglevel";
import {RowType} from "../types/rowType.ts";

import {ComponentCard} from "../components/componentCard.tsx";
import {TemplateComponent} from "../types/templateComponent.ts";
import {cleanFlowstepsForComponent} from "../dbUtils.ts";

export function SolutionComponentList() {
    const logger = log.getLogger('SolutionComponentList');
    const params = useParams();
    const db = usePouch();
    const [searchText, setSearchText] = useState('');
    const [componentValues, setComponentValues] = useState([]);
    const {docs: solutionComponents, loading: solutionComponentsLoading} = useFind({
        index: {
            fields: ['type', 'solution_id', 'name']
        },
        selector: {
            solution_id: params.solutionId,
            type: RowType.SolutionComponent
        }
    });
    const {doc: masterComponents, error: componentsError} = useDoc('templatecomponents');
    const getKey = (name) => {
        return name.toLowerCase().trim().replace(/[^\p{L}\d]/gu, '');
    }
    useEffect(() => {
        logger.debug('masterComponents', masterComponents);

        if (masterComponents?.list) {
            const values = masterComponents.list.map((x) => x.name);
            setComponentValues(values);
        }
    }, [masterComponents]);
    if (componentsError) {
        if (componentsError.status === 404) {
            db.put({
                _id: 'templatecomponents',
                type: 'components',
                list: []
            });
        }
    }
    // @ts-expect-error - this is a hack to get around the fact that the list is not typed
    //store={masterComponents?.list ? masterComponents.list.map((x) => x.name) : []}/>
    if (solutionComponentsLoading &&
        solutionComponents &&
        solutionComponents.length === 0) return <div>Loading...</div>

    const saveComponent = () => {
        const text = getKey(searchText);
        logger.debug(searchText);
        if (text.length > 0) {
            // @ts-expect-error - this is a hack to get around the fact that the list is not typed
            const list = masterComponents?.list || [];
            const existing = list.find((component) => {
                return component._id === getKey(text)
            });
            if (!existing) {
                // @ts-expect-error - this is a hack to get around the fact that the list is not typed

                const newList = [...masterComponents?.list || [], {_id: getKey(text), name: searchText}];
                newList.sort((a, b) => {
                    return (a?._id < b?._id ? -1 : (a?._id > b?._id ? 1 : 0));
                });
                db.put({...masterComponents, list: newList}).then(() => {
                    if (params.solutionId) {
                        db.post({
                            type: RowType.SolutionComponent,
                            name: searchText,
                            solution_id: params.solutionId
                        }).then(() => {

                        });
                        setSearchText('');
                    }
                });
            } else {
                if (params.solutionId) {
                    db.post({type: RowType.SolutionComponent, name: searchText, solution_id: params.solutionId});
                }
            }
        }
        setSearchText('');
    }
    // @ts-expect-error - this is a hack to get around the fact that the list is not typed
    const renderData = params.solutionId ? solutionComponents : masterComponents.list;
    const update = async (data) => {
        try {
            logger.debug('update', data);
            if (data._deleted == true) {
                cleanFlowstepsForComponent(db, data._id);
            }
            await db.put(data);
        } catch (err) {
            logger.error(err);
        }

    }
    const renderOut =
        renderData.map((row) => {
            const data = (row as unknown) as TemplateComponent;
            return <ComponentCard key={data._id} component={data} update={update}/>
        })

    const onOptionSubmit = async (e) => {
        logger.debug('onOptionSubmit', e);
        await db.post({type: RowType.SolutionComponent,
            name: e, solution_id: params.solutionId});
        setSearchText('');
    }
    return (
        <Stack>

            <Autocomplete
                key="input"
                label={'Add Component'}
                value={searchText}
                placeholder={'Component'}
                data={componentValues}
                onChange={(e) => {
                    setSearchText(e);
                }}
                onOptionSubmit={onOptionSubmit}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        saveComponent();
                    }
                }}/>

            <SimpleGrid cols={4}>
                {renderOut}
            </SimpleGrid>
        </Stack>
    )
}