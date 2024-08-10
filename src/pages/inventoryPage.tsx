import "@mantine/core/styles.css";
import {AppShell, MantineProvider} from "@mantine/core";
import {theme} from "../theme.ts";
import {useState} from "react";
import MainView, {States} from "../mainView.tsx";
import {SystemComponentList} from "../systemComponentList.tsx";
import {ConnectionList} from "../networkConnections/connectionList.tsx";
import Header from "../header.tsx";


export default function InventoryPage() {
    const [state, setState] = useState(States.main);
    const [selectedComponent, setSelectedComponent] = useState('');

    return <MantineProvider defaultColorScheme="dark" theme={theme}>
        <AppShell
            header={{height: 60}}
            navbar={{
                width: 240,
                breakpoint: 'sm',
            }} padding="md">
            <Header/>
            <AppShell.Navbar bg="rgba(30,30,20,.2)"  p={20}>
                <SystemComponentList selectedComponent={selectedComponent}
                                     setSelectedComponent={setSelectedComponent}/>
                <ConnectionList/>
            </AppShell.Navbar>
            <AppShell.Main bg="none">
                <MainView bg="none" state={state} selectedComponent={selectedComponent}
                          setSelectedComponent={setSelectedComponent}/>

            </AppShell.Main>
        </AppShell>

    </MantineProvider>;
}
