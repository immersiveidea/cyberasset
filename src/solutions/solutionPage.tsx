import "@mantine/core/styles.css";
import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {useDoc, usePouch} from "use-pouchdb";
import {useDisclosure} from "@mantine/hooks";
import {AppShell, MantineProvider, rgba, Tabs} from "@mantine/core";
import {theme} from "../theme.ts";
import Header from "../header.tsx";
import SolutionHeader from "./solutionHeader.tsx";
import QuickText from "../components/quickText.tsx";
import {SolutionComponentList} from "../solutionComponents/solutionComponentList.tsx";
import {SolutionComponent} from "../solutionComponents/solutionComponent.tsx";
import SolutionFlowDiagram from "./solutionFlowDiagram.tsx";
import log from "loglevel";
import {SolutionConnections} from "../networkConnections/solutionConnections.tsx";
import {SolutionSequenceDiagramView} from "./solutionSequenceDiagramView.tsx";

export default function SolutionPage() {
    const logger = log.getLogger('SolutionPage');
    const params = useParams();
    const db = usePouch();
    const navigate = useNavigate();
    const [editing, {toggle}] = useDisclosure(false);
    const {doc: s} = useDoc(params.solutionId);
    const solution = (s as unknown) as { name: string, description: string, _id: string };
    const [solutionData, setSolutionData] = useState({name: '', description: ''});
    useEffect(() => {
        if (editing) {
            logger.debug('editing', solution);
            setSolutionData({name: solution.name, description: solution.description});
        } else {
            logger.debug('not editing', solution);
        }

    }, [editing, solution]);

    const saveSolution = () => {
        db.put({...solution, ...solutionData});
        toggle();
    }
    if (!solution) {
        return <></>
    }
    const solutionContent = () => {
        switch (params.tab) {
            case 'components':
                return <SolutionComponentList/>
            case 'flow':
                return <SolutionFlowDiagram/>
            case 'connections':
                return <SolutionConnections/>
            case 'sequence':
                return <SolutionSequenceDiagramView/>
            case 'security':
                return <QuickText/>
            case 'component':
                return <SolutionComponent/>
            default:
                return <></>
        }
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
                                    setSolutionData={setSolutionData} solution={solution}
                                    saveSolution={saveSolution}/>
                    <Tabs value={params.tab}
                          onChange={(value) => {
                              navigate(`/solution/${params.solutionId}/${value}`)
                          }}>
                        <Tabs.List>
                            <Tabs.Tab value="components">
                                Components
                            </Tabs.Tab>
                            <Tabs.Tab value="flow">
                                Flow Diagram
                            </Tabs.Tab>
                            <Tabs.Tab value="connections">
                                Connections
                            </Tabs.Tab>
                            <Tabs.Tab value="sequence">
                                Sequence Diagram
                            </Tabs.Tab>
                            <Tabs.Tab value="security">
                                Security
                            </Tabs.Tab>
                        </Tabs.List>
                    </Tabs>
                    {solutionContent()}
                </AppShell.Main>
            </AppShell>
        </MantineProvider>
    )

}
