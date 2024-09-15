import {Affix, Button, MantineProvider, Portal} from "@mantine/core";
import {theme} from "../theme.ts";

import SolutionNetworkConnectionDiagram from "./solutionNetworkConnectionDiagram.tsx";

export default function SolutionDiagramPopoutPage() {
    return (<MantineProvider defaultColorScheme="dark" theme={theme}>
        <SolutionNetworkConnectionDiagram/>
    </MantineProvider>);
}