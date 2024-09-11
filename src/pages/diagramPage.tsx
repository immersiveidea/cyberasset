import {Affix, Button, MantineProvider, Portal} from "@mantine/core";
import {theme} from "../theme.ts";

import OverviewDiagram from "../overviewDiagram.tsx";

export default function DiagramPage() {
    return (<MantineProvider defaultColorScheme="dark" theme={theme}>

        <OverviewDiagram/>
    </MantineProvider>);
}