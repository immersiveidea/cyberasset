import {Card, Stack, TextInput} from "@mantine/core";
import {useEffect, useState} from "react";
import {useDoc, usePouch} from "use-pouchdb";
import log from "loglevel";
import {useParams} from "react-router-dom";
import {NameIdList} from "../types/nameIdlist.ts";

export default function QuickText() {
    const logger = log.getLogger('QuickText');
    const params = useParams();
    const db = usePouch();
    const {doc: componentsMaster} = useDoc('components')
    const [text, setText] = useState('');
    const [quickSetComponents, setQuickSetComponents] = useState([]);
    useEffect(() => {
       if (text.length > 0) {
          if (text.indexOf('->')>-1) {
                const parts = text.split('->');
                const c = [];
                parts.forEach(
                    (part) => {
                        const r = RegExp('(.+)\\((.+)\\)');
                        const type = part.match(r);
                        if (type && type.length == 3) {
                            c.push({name: type[1].trim(), componentType: part[2].trim()});
                        } else {
                            c.push({name: part.trim(), componentType: null})
                        }
                    });
                setQuickSetComponents(c);
          } else {
                setQuickSetComponents([{name: text.trim()}]);
          }
       }

    }, [text]);
    const upsertMasterComponent = async (components: Array<{ name: string; }>) => {
        const missingList = [];
        components.forEach((component) => {
            const existing = (componentsMaster as NameIdList).list.find((c) => {
                return c.name.toLowerCase() === component.name.toLowerCase();
            });
            if (!existing) {
                missingList.push({_id: component.name.replace(/[^\p{L}\d]/gu, ''), name: component.name});
            }
        })

        logger.debug('missingList', missingList);
        if (missingList.length > 0) {
            const newList = [...(componentsMaster as NameIdList).list, ...missingList];
            logger.debug('newList', newList);
            newList.sort((a, b) => {
                return (a?._id<b?._id?-1:(a?._id>b?._id?1:0));
            });
            logger.debug('newList sorted', newList);
            await db.put({...componentsMaster, list: newList});
        }
    }
    const saveData = async () => {
        logger.debug('saving', quickSetComponents);
        if (quickSetComponents.length == 0 || !componentsMaster) {
            return;
        }

        let source = null;
        if (params.solutionId) {
            source = await db.post({...quickSetComponents[0], solution_id: params.solutionId, type: 'component'});
        }

        logger.debug('source', source);
        logger.debug('params', params);
        logger.debug('quickSetComponents', quickSetComponents);
        await upsertMasterComponent(quickSetComponents);
        if (quickSetComponents.length > 1) {
            for (let i = 1; i < quickSetComponents.length; i++) {
                if (params.solutionId) {
                    const dest = await db.post({...quickSetComponents[i], solution_id: params.solutionId, type: 'component'});
                    logger.debug('dest', dest);
                    if (source) {
                        const conn = await db.post({type: 'connection', rank: 1, source: source.id, solution_id: params.solutionId, destination: dest.id, components: [{id: source.id}, {id: dest.id}]});
                        logger.debug('connection created', conn);
                    }
                    source = dest;
                }

            }
        }
        setText('');
        setQuickSetComponents([])
    }
    const displayComponents = () => {
        return quickSetComponents.map((component) => {
            return <Card>{component.name}</Card>
        })
    }
    return (
        <Stack>
        <TextInput  value={text} onChange={(e) => {
                setText(e.currentTarget.value)}
        } onKeyPress={(e) => {
            if (e.key === 'Enter') {
                logger.debug('enter key pressed');
                saveData();
            }
        }} label="Quick Entry"/>
        {displayComponents()}
        </Stack>
    )
}