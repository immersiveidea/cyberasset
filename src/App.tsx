import "@mantine/core/styles.css";
import {AppShell, Button, MantineProvider} from "@mantine/core";
import {theme} from "./theme";
import {useState} from "react";
import MainView, {States} from "./mainView.tsx";
import {SystemComponentList} from "./systemComponentList.tsx";
import {ConnectionList} from "./connectionList.tsx";
import {Link} from "react-router-dom";


export default function App() {
    const [state, setState] = useState(States.main);
    const [selectedComponent, setSelectedComponent] = useState('');

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
                <SystemComponentList selectedComponent={selectedComponent} setSelectedComponent={setSelectedComponent}/>
                <ConnectionList/>
            </AppShell.Navbar>
            <AppShell.Main>
                <MainView state={state} selectedComponent={selectedComponent}
                          setSelectedComponent={setSelectedComponent}/>

            </AppShell.Main>
        </AppShell>

    </MantineProvider>;
}
