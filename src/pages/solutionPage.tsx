import "@mantine/core/styles.css";
import "@mantine/core/styles.css";
import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {useDoc, usePouch} from "use-pouchdb";
import {useDisclosure} from "@mantine/hooks";
import {AppShell, MantineProvider, rgba, Stack, Tabs} from "@mantine/core";
import {theme} from "../theme.ts";
import Header from "../header.tsx";
import SolutionHeader from "../components/solutionHeader.tsx";
import QuickText from "../components/quickText.tsx";
import {SystemComponentList} from "../systemComponentList.tsx";
import {SystemComponent} from "../systemComponent.tsx";
import OverviewDiagram from "../overviewDiagram.tsx";
export default function SolutionPage() {
    const params = useParams();
    const db = usePouch();
    const [editing, {toggle}] = useDisclosure(false);
    const {doc: s} = useDoc(params.solutionId);
    const solution = (s as unknown) as { name: string, description: string, _id: string };
    const [solutionData, setSolutionData] = useState({name: '', description: ''});
    useEffect(() => {
        if (editing) {
            console.log('editing');
            setSolutionData({name: solution.name, description: solution.description});
        } else {
            console.log('not editing');
        }

    }, [editing, solution]);
    const saveSolution = () => {
        db.put({...solution, ...solutionData});
        toggle();
    }
    if (!solution) {
        return <></>
    }

    return (
        <MantineProvider defaultColorScheme="dark" theme={theme}>
            <AppShell
                header={{height: 84}}
                padding="md">
                <AppShell.Header bg={rgba('#FFF', .1)}>
                    <Header/>

                </AppShell.Header>

                <AppShell.Main bg="none">
                    <SolutionHeader editing={editing} toggle={toggle} solutionData={solutionData}
                                    setSolutionData={setSolutionData} solution={solution} saveSolution={saveSolution}/>

                    <Tabs defaultValue="components">
                        <Tabs.List>
                            <Tabs.Tab value="components">
                                Components
                            </Tabs.Tab>
                            <Tabs.Tab value="flow">
                                Flow
                            </Tabs.Tab>
                            <Tabs.Tab value="connections">
                                Connections
                            </Tabs.Tab>
                            <Tabs.Tab value="security">
                                Security
                            </Tabs.Tab>

                        </Tabs.List>

                        <Tabs.Panel value="components">
                            <Stack>
                                <QuickText/>
                                <SystemComponentList/>
                                <SystemComponent/>
                            </Stack>
                        </Tabs.Panel>
                        <Tabs.Panel value="connections">
                            <OverviewDiagram/>
                        </Tabs.Panel>
                    </Tabs>
                </AppShell.Main>
            </AppShell>
        </MantineProvider>
    )

}
