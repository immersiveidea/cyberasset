import "@mantine/core/styles.css";
import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {useDoc, usePouch} from "use-pouchdb";
import {AppShell, MantineProvider, rgba, Tabs} from "@mantine/core";
import {theme} from "../theme.ts";
import Header from "../header.tsx";
import QuickText from "../components/quickText.tsx";
import {SolutionComponentList} from "../solutionComponents/solutionComponentList.tsx";
import SolutionFlowDiagram from "../solutions/solutionFlowDiagram.tsx";
import log from "loglevel";
import {SolutionSequenceDiagramView} from "../solutions/solutionSequenceDiagramView.tsx";
import SolutionOverview from "../solutions/solutionOverview.tsx";


export default function SolutionPage() {
    const logger = log.getLogger('SolutionPage');
    const params = useParams();

    const navigate = useNavigate();
    const {doc: s, state} = useDoc(params.solutionId);
    const solution = (s as unknown) as { name: string, description: string, _id: string };
    const [solutionData, setSolutionData] = useState({name: '', description: ''});
    useEffect(() => {
        if (state === "done") {
            logger.debug('editing', solution);
            setSolutionData({name: solution.name, description: solution.description});
        } else {
            logger.debug('not editing', solution);
        }
    }, [solution]);

    if (!solution) {
        return <></>
    }
    const solutionContent = () => {
        switch (params.tab) {
            case 'components':
                return <SolutionComponentList/>
            case 'flow':
                return <SolutionFlowDiagram/>
            case 'sequence':
                return <SolutionSequenceDiagramView/>
            case 'security':
                return <QuickText/>
            default:
                return <SolutionOverview/>
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
                    <Tabs value={params.tab || 'overview'}
                          onChange={(value) => {
                              navigate(`/solution/${params.solutionId}/${value}`)
                          }}>
                        <Tabs.List>
                            <Tabs.Tab value="overview">
                                Overview
                            </Tabs.Tab>
                            <Tabs.Tab value="components">
                                Components
                            </Tabs.Tab>
                            <Tabs.Tab value="flow">
                                Flow Diagram
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
