import {theme} from "../theme.ts";
import {AppShell, MantineProvider, rgba} from "@mantine/core";
import Header from "../header.tsx";
import {TemplateComponentList} from "../template/templateComponentList.tsx";

export default function ComponentsPage() {

    return (
        <MantineProvider defaultColorScheme="dark" theme={theme}>
            <AppShell
                header={{height: 64}}>
                <AppShell.Header bg={rgba('#FFF', .1)}>
                    <Header/>
                </AppShell.Header>
                <AppShell.Main>
                    <TemplateComponentList/>
                </AppShell.Main>
            </AppShell>
        </MantineProvider>
    )
}