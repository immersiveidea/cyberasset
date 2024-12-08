import {AppShell, MantineProvider, rgba} from "@mantine/core";
import {theme} from "../theme.ts";
import AdminActions from "../admin/adminActions.tsx";
import Header from "../header.tsx";

export default function AdminPage() {
    return <MantineProvider defaultColorScheme="dark" theme={theme}>
        <AppShell
            header={{height: 64}}>
            <AppShell.Header bg={rgba('#FFF', .1)}>
                <Header/>
            </AppShell.Header>
            <AppShell.Main>
                <AdminActions/>
            </AppShell.Main>
        </AppShell>
    </MantineProvider>
}