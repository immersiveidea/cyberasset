import "@mantine/core/styles.css";
import {AppShell, Button, MantineProvider} from "@mantine/core";
import {theme} from "./theme";
import {Link} from "react-router-dom";
import AdminActions from "./adminActions.tsx";


export default function AdminApp() {

    return <MantineProvider theme={theme}>
        <AppShell
            header={{height: 60}}
            navbar={{
                width: 300,
                breakpoint: 'sm',
            }} padding="md">
            <AppShell.Header>
                <Button><Link to="/">Network Builder</Link></Button>
                <Button><Link to="/admin">Admin</Link></Button>
            </AppShell.Header>
            <AppShell.Navbar>
                <AdminActions/>
            </AppShell.Navbar>
            <AppShell.Main>

            </AppShell.Main>
        </AppShell>

    </MantineProvider>;
}