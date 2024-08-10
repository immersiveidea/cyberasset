
import {AppShell, MantineProvider} from "@mantine/core";
import {theme} from "../theme.ts";
import Header from "../header.tsx";


export default function HomePage() {
    return <MantineProvider defaultColorScheme="dark" theme={theme}>
        <AppShell
            header={{height: 60}}
            padding="md">
            <Header/>

            <AppShell.Main>
                <h1>Home</h1>
                <p>Welcome to the home page of the network builder.</p>
            </AppShell.Main>
        </AppShell>

    </MantineProvider>;
}