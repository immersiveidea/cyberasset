
import {AppShell, Card, Center, MantineProvider, Paper} from "@mantine/core";
import {theme} from "../theme.ts";
import Header from "../header.tsx";


export default function HomePage() {
    return <MantineProvider defaultColorScheme="dark" theme={theme}>
        <AppShell
            header={{height: 60}}
            padding="md">
            <Header/>
            <AppShell.Main>
                <Center>
                <Card widthBorder bg='#000' radius="10px">
                <iframe width="800" height="400" src="https://www.youtube.com/embed/-pVY2rJ0Bc4"
                        title="Cyber Security Audit User Experience" frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
                </Card>
                </Center>
            </AppShell.Main>
        </AppShell>

    </MantineProvider>;
}