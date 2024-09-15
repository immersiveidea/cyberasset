import {theme} from "../theme.ts";
import {AppShell, MantineProvider, rgba} from "@mantine/core";
import Header from "../header.tsx";
import {SolutionComponentList} from "../solutionComponents/solutionComponentList.tsx";

export default function ComponentsPage() {

    return (
        <MantineProvider defaultColorScheme="dark" theme={theme}>
        <AppShell
            header={{height: 44}}>
            <AppShell.Header bg={rgba('#FFF', .1)}>
                <Header/>
            </AppShell.Header>
            <AppShell.Main>
                <SolutionComponentList/>
            </AppShell.Main>
        </AppShell>
        </MantineProvider>
                )
}