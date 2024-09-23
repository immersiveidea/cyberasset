import {MantineProvider} from "@mantine/core";
import {theme} from "../theme.ts";

import SolutionFlowDiagramView from "./solutionFlowDiagramView.tsx";

export default function SolutionDiagramPopoutPage() {
    return (<MantineProvider defaultColorScheme="dark" theme={theme}>
        <SolutionFlowDiagramView/>
    </MantineProvider>);
}