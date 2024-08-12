import "@mantine/core/styles.css";
import {AppShell, MantineProvider} from "@mantine/core";
import {theme} from "../theme.ts";
import {useState} from "react";
import MainView, {States} from "../mainView.tsx";
import {SystemComponentList} from "../systemComponentList.tsx";

import Header from "../header.tsx";


export default function InventoryPage() {
    const [state, setState] = useState(States.main);
    const [selectedComponent, setSelectedComponent] = useState('');

    return <MantineProvider defaultColorScheme="dark" theme={theme}>
        <AppShell
            header={{height: 60}}
            padding="md">
            <Header/>
            <AppShell.Main bg="none">
                <SystemComponentList selectedComponent={selectedComponent}
                                     setSelectedComponent={setSelectedComponent}/>

                <MainView bg="none" state={state} selectedComponent={selectedComponent}
                          setSelectedComponent={setSelectedComponent}/>

            </AppShell.Main>
        </AppShell>

    </MantineProvider>;
}
