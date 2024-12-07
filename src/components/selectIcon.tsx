import * as icons from "@tabler/icons-react";
import {SimpleGrid, Stack, TextInput} from "@mantine/core";
import {useEffect, useState} from "react";
import FlexSearch from "flexsearch"
import {TablerIcon} from "@tabler/icons-react";

const iconData = [];
const index = new FlexSearch.Index({preset: 'performance', tokenize: 'full', cache: true});
for (const iconsKey in icons) {
    if (icons[iconsKey].render) {
        const id = iconData.push({key: iconsKey, value: icons[iconsKey]});
        index.add(id-1, iconsKey.toLowerCase().replace('icon',''));
        console.log(id-1, iconsKey);
    }
}



export function SelectIcon(props: { icon: string }) {
    const [icon, setIcon] = useState(props.icon);
    const [iconList, setIconList] = useState([]);
    const [iconCount, setIconCount] = useState(0);
    useEffect(() => {
        const start = performance.now();
        console.log(icon);
        if (icon && icon.trim().length > 0) {
            index.searchAsync(icon)
                .then((dataidx) => {
                    console.log(dataidx);
                    const data = dataidx.map((idx) => {return iconData[idx]});
                    setIconCount(data.length);
                    const end = performance.now();
                    console.log('IconList', end - start);
                    setIconList(data);
                });
            /*const data = iconData.filter((ic) => {
                return ic.value.render && ic.key.toLowerCase().includes(icon.toLowerCase());
            });*/

        }
    }, [icon])
    return (<Stack>
        {iconCount} icons
        <TextInput value={icon} onChange={(event) => {
            setIcon(event.currentTarget.value)
        }}/>
        <SimpleGrid cols={5}>
            {iconList.map((icon) => {
                const Icon = icon.value as TablerIcon;
                return (<Stack><Icon size={32} key={icon.key}/>{icon.key}</Stack>)
            })}
        </SimpleGrid>
    </Stack>)
}
