import {useDoc, useFind, usePouch} from "use-pouchdb";
import {Affix, Autocomplete, Text, Drawer, NavLink, SimpleGrid, Stack, Group} from "@mantine/core";
import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import log from "loglevel";
import {RowType} from "../types/rowType.ts";

import {ComponentCard} from "../components/componentCard.tsx";
import {TemplateComponent} from "../types/templateComponent.ts";
import {cleanFlowstepsForComponent} from "../dbUtils.ts";
import {useDisclosure} from "@mantine/hooks";
import {IconArrowRight, IconChevronLeft, IconChevronRight, IconComponents} from "@tabler/icons-react";

export function SolutionComponentList() {
    const logger = log.getLogger('SolutionComponentList');
    const params = useParams();
    const db = usePouch();
    const [opened, { open, close }] = useDisclosure(false);
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
        const comp = masterComponents.list.find((val) => val._id === e);
        logger.debug('component result', comp);
        const current = await db.post({type: RowType.SolutionComponent,
            name: comp.name, solution_id: params.solutionId});
        setCurrentComponent({name: '', _id: null, _rev: null, type: RowType.SolutionComponent, shape: 'Rectangle'});
        logger.debug("current", current, currentComponent);
    }
    const componentlabel = () => {
        return <Group><IconComponents size={18} style={{padding: '0px', margin: '0px'}}/>
            <Text w={20}>Components</Text></Group>
}
    return (

        <NavLink label={componentlabel()}>
            <Autocomplete
                key="input"
                value={currentComponent.name}
                placeholder={'Component Name'}
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
                {renderOut}
        </NavLink>


    )
}