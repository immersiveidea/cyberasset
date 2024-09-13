import {theme} from "../theme.ts";
import {AppShell, MantineProvider, rgba} from "@mantine/core";
import Header from "../header.tsx";
import {SystemComponentList} from "../systemComponentList.tsx";

export default function ComponentsPage() {

    return (
        <MantineProvider defaultColorScheme="dark" theme={theme}>
        <AppShell
            header={{height: 44}}>
            <AppShell.Header bg={rgba('#FFF', .1)}>
                <Header/>
            </AppShell.Header>
            <AppShell.Main>
                <SystemComponentList/>
            </AppShell.Main>
        </AppShell>
        </MantineProvider>
                )
}