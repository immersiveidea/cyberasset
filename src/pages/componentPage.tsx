import "@mantine/core/styles.css";
import {AppShell, MantineProvider, rgba} from "@mantine/core";
import {theme} from "../theme.ts";
import {useState} from "react";
import MainView from "../mainView.tsx";

import Navigation from "../navigation.tsx";
import Header from "../header.tsx";
import {useParams} from "react-router-dom";


export default function ComponentPage() {
    const params = useParams();
    const [selectedComponent, setSelectedComponent] = useState(params.componentId||'');
    const [selectedSolution, setSelectedSolution] = useState(params.solutionId || '');

    return <MantineProvider defaultColorScheme="dark" theme={theme}>
        <AppShell
            header={{height: 44}}
            navbar={{width: 190}}
            padding="md">
            <AppShell.Header bg={rgba('#FFF',.1)}>
                <Header/>
            </AppShell.Header>
            <Navigation selectedComponent={selectedComponent} setSelectedComponent={setSelectedComponent}
                selectedSolution={selectedSolution} setSelectedSolution={setSelectedSolution}/>
            <AppShell.Main bg="none">

                <MainView bg="none" selectedComponent={selectedComponent}
                          setSelectedComponent={setSelectedComponent}/>

            </AppShell.Main>
        </AppShell>

    </MantineProvider>;
}
