import Diagram from "../diagram.tsx";
import {MantineProvider} from "@mantine/core";
import {theme} from "../theme.ts";

export default function Demopage() {
    return (<MantineProvider theme={theme}>
        <Diagram/>
    </MantineProvider>)
}