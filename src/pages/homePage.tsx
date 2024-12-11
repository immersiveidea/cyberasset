import {AppShell, Card, Center, Image, MantineProvider, Modal, rgba, SimpleGrid, Title} from "@mantine/core";
import {theme} from "../theme.ts";
import {useDisclosure} from "@mantine/hooks";
import {useNavigate} from "react-router-dom";
import Header from "../header.tsx";
import {MarketingCard} from "./marketingCard.tsx";
//href="https://www.youtube.com/watch?v=-pVY2rJ0Bc4

export default function HomePage() {
    const [opened, {open, close}] = useDisclosure(false);
    const navigate = useNavigate();
    const changeTab = (tab) => {
        navigate(tab);
    }

    //image.src = '/youtube.webp';
    //image.alt = 'Cyber Security';
    return <MantineProvider defaultColorScheme="dark" theme={theme}>
        <AppShell
            header={{height: 44}}>
            <AppShell.Header bg={rgba('#FFF', .1)}>
                <Header/>
            </AppShell.Header>
            <AppShell.Main>
                <Modal size="auto" opened={opened} onClose={close}>
                    <Center>
                        <iframe width="800" height="400" src="https://www.youtube.com/embed/-pVY2rJ0Bc4"
                                title="Cyber Security Audit User Experience" frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
                    </Center>
                </Modal>
                <SimpleGrid cols={{xs: 1, sm: 1, lg: 1}}>
                    <MarketingCard title="Create multiple solutions and collaborate with your your team." image="/solutions.png"/>
                    <MarketingCard title="Add and share components between solutions." image="/solution_components.png"/>
                    <MarketingCard title="Document the flow of data for your solution." image="/solution_flow.png"/>

                </SimpleGrid>
            </AppShell.Main>
        </AppShell>

    </MantineProvider>;
}