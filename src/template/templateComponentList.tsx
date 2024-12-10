import {useDoc, usePouch} from "use-pouchdb";
import {Button, Card, SimpleGrid, TextInput} from "@mantine/core";
import {getLogger} from "loglevel";
import {useEffect, useState} from "react";
import {v4} from "uuid";
import {SelectIcon} from "../components/selectIcon.tsx";
import {ComponentEditModal} from "./componentEditModal.tsx";
import {TemplateComponent} from "../types/templateComponent.ts";
import SelectButton from "../components/buttons/selectButton.tsx";
import {ComponentCard} from "../components/componentCard.tsx";

export function TemplateComponentList() {
    const logger = getLogger('TemplateComponentList');
    const {doc: templateDoc, error} = useDoc('templatecomponents');
    const [componentName, setComponentName] = useState('');
    const [components, setComponents] = useState(new Map<string, object>);
    const [componentNames, setComponentNames] = useState(new Set<string>);
    const [selected, setSelected] = useState(null);

    const db = usePouch();
    useEffect(() => {
        if (error && error.status === 404) {
            db.put({_id: 'templatecomponents', list: []});
        }
        if (!error && templateDoc) {
            const template = (templateDoc as unknown) as { list: Array<TemplateComponent> };
            if (template.list) {
                const newComponents = new Map<string, object>();
                const newComponentNames = new Set<string>();
                template.list.forEach((component) => {
                    newComponents.set(component._id, component);
                    newComponentNames.add(component.name);
                });
                setComponents(newComponents);
            }
        }
    }, [templateDoc, db, error]);
    const createComponent = async () => {
        logger.debug('createComponent', componentName);
        if (componentName && !componentNames.has(componentName)) {
            const newDoc = {...templateDoc};
            ((newDoc as unknown) as { list: Array<{ _id: string, name: string }> }).list.push({
                _id: v4(),
                name: componentName
            });
            await db.put(newDoc);
        }
        setComponentName('');
    }
    //@ts-expect-error I don't know how to fix this
    if (!templateDoc?.list) return <div>Loading...</div>


    const saveComponent = async (data) => {
        logger.debug(selected);
        try {
            logger.debug(templateDoc);
            const newDoc = ({...templateDoc} as unknown) as { list: Array<TemplateComponent> };
            newDoc.list =
                newDoc.list.map((item) => {
                    if (item._id == data._id) {
                        logger.info('saveComponent', 'found', data);
                        return data;
                    } else {
                        return item;
                    }
                }).filter((item) => { return !item?._deleted == true});
            logger.debug('saveComponent', newDoc);
            await db.put(newDoc);
        } catch (err) {
            logger.error('saveComponent', err);
        }
        setSelected(null);
    }
    //@ts-expect-error I don't know how to fix this
    const componentCards = templateDoc.list.map((component: TemplateComponent) => {
        return (
            <ComponentCard component={component} update={saveComponent}/>
        )
    });
    return (
        <div>
            <h1>TemplateComponentList</h1>
            <TextInput label="Component" value={componentName} id="newComponent"
                       onChange={(evt) => setComponentName(evt.currentTarget.value)}
                       onKeyPress={(evt) => {
                           if (evt.code === "Enter") {
                               createComponent()
                           }
                       }} placeholder="New Component Name"/>
            <SimpleGrid cols={4}>
                {componentCards}
            </SimpleGrid>
        </div>

    )
}