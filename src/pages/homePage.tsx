import {AppShell, Card, Center, Image, MantineProvider, Modal, Title} from "@mantine/core";
import {theme} from "../theme.ts";
import Header from "../header.tsx";
import {useDisclosure} from "@mantine/hooks";
//href="https://www.youtube.com/watch?v=-pVY2rJ0Bc4

export default function HomePage() {
    const [opened, {open, close}] = useDisclosure(false)

    //image.src = '/youtube.webp';
    //image.alt = 'Cyber Security';
    return <MantineProvider defaultColorScheme="dark" theme={theme}>
        <AppShell
            header={{height: 60}}
            padding="md">

            <Header/>
            <AppShell.Main>
                <Modal size="auto" opened={opened} onClose={close}>
                    <Center>
                        <iframe width="800" height="400" src="https://www.youtube.com/embed/-pVY2rJ0Bc4"
                                title="Cyber Security Audit User Experience" frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
                    </Center>
                </Modal>
                <Center>

                    <Card w={400} styles={{root:{ cursor: "pointer"}}} component="a" onClick={open}>
                        <Card.Section>
                            <Image w={400} h={200} src="/youtube.webp" alt="Cyber Security"/>

                        </Card.Section>
                        <Card.Section>
                            <Center>
                                Youtube Tutorial
                            </Center>
                        </Card.Section>

                    </Card>
                </Center>
            </AppShell.Main>
        </AppShell>

    </MantineProvider>;
}