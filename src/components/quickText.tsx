import {Card, Stack, TextInput} from "@mantine/core";
import {useEffect, useState} from "react";
import {usePouch} from "use-pouchdb";

export default function QuickText() {
    const db = usePouch();
    const [text, setText] = useState('');
    const [components, setComponents] = useState([]);
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
                setComponents(c);
          } else {
                setComponents([{name: text.trim()}]);
          }
       }

    }, [text]);
    const saveData = async () => {
        console.log('saving', components);
        const {docs: data} = await db.allDocs({include_docs: true});


        if (components.length == 0) {
            return;
        }

        let source = await db.post({...components[0], type: 'component'});

        if (components.length > 1) {
            for (let i = 1; i < components.length; i++) {
                const dest = await db.post({...components[i], type: 'component'});
                const conn = await db.post({type: 'connection', rank: 1, source: source.id, destination: dest.id, components: [{id: source.id}, {id: dest.id}]});
                source = dest;
            }
        }
        setText('');
        setComponents([])
    }
    const displayComponents = () => {
        return components.map((component) => {
            return <Card>{component.name}</Card>
        })
    }
    return (
        <Stack>
        <TextInput  value={text} onChange={(e) => {
                setText(e.currentTarget.value)}
        } onKeyPress={(e) => {
            if (e.key === 'Enter') {
                console.log('enter');
                saveData();
            }
        }} label="Quick Entry"/>
        {displayComponents()}
        </Stack>
    )
}