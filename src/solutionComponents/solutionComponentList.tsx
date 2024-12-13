import {useDoc, useFind, usePouch} from "use-pouchdb";
import {Autocomplete, SimpleGrid, Stack} from "@mantine/core";
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
    const [currentComponent, setCurrentComponent] = useState({} as TemplateComponent);
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
            const values = [];
            for (const value of  masterComponents.list) {
                if (values.find((x) => x.value === value._id ||
                    x.label === value.name)) {
                    logger.debug('duplicate', value);
                } else {
                    values.push({value: value._id, label: value.name});
                }
            }
            //const values = masterComponents.list.map((x) => {return {value: getKey(x.name), label: x.name}});
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
        const text = getKey(currentComponent.name);
        logger.debug(currentComponent);
        if (text.length > 0) {
            // @ts-expect-error - this is a hack to get around the fact that the list is not typed
            const list = masterComponents?.list || [];
            const existing = list.find((component) => {
                return component._id === getKey(text) || component.name === currentComponent.name;
            });
            if (!existing) {
                // @ts-expect-error - this is a hack to get around the fact that the list is not typed

                const newList = [...masterComponents?.list || [], { _id: getKey(text), name: currentComponent.name}];
                newList.sort((a, b) => {
                    return (a?._id < b?._id ? -1 : (a?._id > b?._id ? 1 : 0));
                });
                db.put({...masterComponents, list: newList}).then(() => {
                    if (params.solutionId) {
                        db.post({
                            type: RowType.SolutionComponent,
                            name: currentComponent.name,
                            shape: currentComponent.shape,
                            solution_id: params.solutionId
                        }).then(() => {

                        });
                        setCurrentComponent({name: '', _id: null, _rev: null, type: RowType.SolutionComponent, shape: 'Rectangle'});
                    }
                });
            } else {
                if (params.solutionId) {
                    db.post({type: RowType.SolutionComponent, name: currentComponent.name, shape: currentComponent.shape, solution_id: params.solutionId});
                }
            }
        }

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
        setCurrentComponent({name: e, _id: null, _rev: null, type: RowType.SolutionComponent, shape: 'Rectangle'});
    }
    return (
        <Stack>

            <Autocomplete
                key="input"
                label={'Add Component'}
                value={currentComponent.name}
                placeholder={'Component'}
                data={componentValues}
                onChange={(e) => {
                    setCurrentComponent({...currentComponent, name: e});
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