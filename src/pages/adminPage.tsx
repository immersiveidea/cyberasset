import {AppShell, MantineProvider} from "@mantine/core";
import {theme} from "../theme.ts";
import AdminActions from "../adminActions.tsx";
import Header from "../header.tsx";
import Diagram from "../diagram.tsx";


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

            </AppShell.Navbar>
            <AppShell.Main>
                <AdminActions/>
            </AppShell.Main>
        </AppShell>
    </MantineProvider>
}