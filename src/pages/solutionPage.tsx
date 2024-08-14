import "@mantine/core/styles.css";
import {AppShell, Button, MantineProvider, rgba, TextInput} from "@mantine/core";
import {theme} from "../theme.ts";
import {useState} from "react";

import Navigation from "../navigation.tsx";
import Header from "../header.tsx";
import {useParams} from "react-router-dom";


export default function SolutionPage() {
    const params = useParams();
    const [selectedComponent, setSelectedComponent] = useState(params.componentId || '');
    const [selectedSolution, setSelectedSolution] = useState(params.solutionId ||'');

    return <MantineProvider defaultColorScheme="dark" theme={theme}>
        <AppShell
            header={{height: 80}}
            navbar={{width: 190}}
            padding="md">
            <AppShell.Header bg={rgba('#FFF',.1)}>
                <Header/>
            </AppShell.Header>
            <Navigation selectedComponent={selectedComponent} setSelectedComponent={setSelectedComponent}
                        selectedSolution={selectedSolution} setSelectedSolution={setSelectedSolution}/>
            <AppShell.Main bg="none">
                <h1>{selectedSolution}</h1>
                <Button component="a" href={selectedSolution +'/diagram'} onClick={(e)=> {
                    e.preventDefault();
                    window.open( selectedSolution + '/diagram', 'solution' + selectedSolution, 'width=800,height=600,popup=1');

                }}>View Diagram</Button>
                <TextInput label="Solution Name" value={selectedSolution} defaultValue='' onChange={(e) => {

                }}/>

            </AppShell.Main>
        </AppShell>

    </MantineProvider>;
}