import {theme} from "../theme.ts";
import {AppShell, MantineProvider, rgba} from "@mantine/core";
import Header from "../header.tsx";

export default function SolutionsListTemplate(props) {
    return (
        <MantineProvider defaultColorScheme="dark" theme={theme}>
            <AppShell
                header={{height: 44}}
                padding="md">
                <AppShell.Header bg={rgba('#FFF', .1)}>
                    <Header/>
                </AppShell.Header>
                <AppShell.Main bg="none">
                    {props.children}
                </AppShell.Main>
            </AppShell>
        </MantineProvider>
    )
}