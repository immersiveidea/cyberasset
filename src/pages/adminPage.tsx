import {AppShell, MantineProvider} from "@mantine/core";
import {theme} from "../theme.ts";
import AdminActions from "../adminActions.tsx";
import Header from "../header.tsx";


export default function AdminPage() {
    return <MantineProvider theme={theme}>
        <AppShell
            header={{height: 60}}
            navbar={{
                width: 300,
                breakpoint: 'sm',
            }} padding="md">
            <Header/>
            <AppShell.Navbar>
                <AdminActions/>
            </AppShell.Navbar>
            <AppShell.Main>

            </AppShell.Main>
        </AppShell>
    </MantineProvider>
}