import "@mantine/core/styles.css";
import React, {useEffect, useState} from "react";
import {Link, useNavigate, useParams} from "react-router-dom";
import {useDoc} from "use-pouchdb";
import {Affix, AppShell, Burger, MantineProvider, NavLink, rgba} from "@mantine/core";
import {theme} from "../theme.ts";
import Header from "../header.tsx";
import QuickText from "../components/quickText.tsx";
import {SolutionComponentList} from "../solutionComponents/solutionComponentList.tsx";
import SolutionFlowDiagram from "../solutions/solutionFlowDiagram.tsx";
import log from "loglevel";
import {SolutionSequenceDiagramView} from "../solutions/solutionSequenceDiagramView.tsx";
import SolutionOverview from "../solutions/solutionOverview.tsx";
import {useDisclosure} from "@mantine/hooks";


export default function SolutionPage() {
    const logger = log.getLogger('SolutionPage');
    const params = useParams();
    const [mobileOpened, {toggle: toggleMobile}] = useDisclosure();
    const [desktopOpened, {toggle: toggleDesktop}] = useDisclosure(true);
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
                navbar={{width: 220, breakpoint: 'xs', collapsed: {mobile: !mobileOpened, desktop: !desktopOpened}}}
                padding="md">
                <Affix position={{top: 90, left: 10}}>
                    <Burger opened={mobileOpened} onClick={toggleMobile} hiddenFrom="sm" size="sm"/>
                    <Burger opened={desktopOpened} onClick={toggleDesktop} visibleFrom="sm" size="sm"/>

                </Affix>
                <AppShell.Header bg={rgba('#FFF', .1)}>
                    <Header/>

                </AppShell.Header>
                <AppShell.Navbar pt={30}>
                    <NavLink component={Link} to={`/solution/${params.solutionId}/overview`}
                             label={`Solution: ${solution.name}`}>
                    </NavLink>
                    <SolutionComponentList/>
                    <NavLink component={Link} to={`/solution/${params.solutionId}/flow`}
                             label="Flow Diagram">
                    </NavLink>
                    <NavLink component={Link} to={`/solution/${params.solutionId}/sequence`}
                             label="Sequence Diagram">
                    </NavLink>
                    <NavLink component={Link} to={`/solution/${params.solutionId}/security`}
                             label="Security">
                    </NavLink>
                </AppShell.Navbar>
                <AppShell.Main>
                    {solutionContent()}
                </AppShell.Main>
            </AppShell>
        </MantineProvider>
    )

}
