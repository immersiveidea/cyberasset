import "@mantine/core/styles.css";
import {AppShell, MantineProvider, rgba} from "@mantine/core";
import {theme} from "../theme.ts";
import {useState} from "react";
import MainView, {States} from "../mainView.tsx";

import Navigation from "../navigation.tsx";
import Header from "../header.tsx";


export default function ComponentPage() {
    const [state, setState] = useState(States.main);
    const [selectedComponent, setSelectedComponent] = useState('');

    return <MantineProvider defaultColorScheme="dark" theme={theme}>
        <AppShell
            header={{height: 80}}
            navbar={{width: 190}}
            padding="md">
            <AppShell.Header bg={rgba('#FFF',.1)}>
                <Header/>
            </AppShell.Header>
            <Navigation selectedComponent={selectedComponent} setSelectedComponent={setSelectedComponent}/>
            <AppShell.Main bg="none">

                <MainView bg="none" state={state} selectedComponent={selectedComponent}
                          setSelectedComponent={setSelectedComponent}/>

            </AppShell.Main>
        </AppShell>

    </MantineProvider>;
}
