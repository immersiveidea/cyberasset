import {theme} from "../theme.ts";
import {AppShell, Box, Button, Card, Center, List, MantineProvider, rgba, Stack, Title} from "@mantine/core";
import Header from "../header.tsx";
import {useAuth0} from "@auth0/auth0-react";
import {IconCheck} from "@tabler/icons-react";


export default function PricingPage() {
    const {user, isAuthenticated, loginWithRedirect} = useAuth0();
    const freeTier = () => {
        if (isAuthenticated) {
            return <Card p={50} h={630}>
                <Card.Section p={20}>
                    <Title order={4}>Currently Subscribed to Free Tier</Title>
                </Card.Section>
                <Card.Section>
                    <List icon={<IconCheck/>}>
                        <List.Item>Local Storage Only</List.Item>
                        <List.Item>Unlimited Solutions</List.Item>
                        <List.Item>Unlimited Components</List.Item>
                    </List>
                </Card.Section>
                <Card.Section>
                    <Button onClick={() => loginWithRedirect()}>Upgrade</Button>
                </Card.Section>
            </Card>
        } else {
            return <Button onClick={() => loginWithRedirect()}>Login</Button>
        }
    }
    return (
        <MantineProvider defaultColorScheme="dark" theme={theme}>
            <AppShell
                header={{height: 44}}>
                <AppShell.Header bg={rgba('#FFF', .1)}>
                    <Header/>
                </AppShell.Header>
                <AppShell.Main>
                    <Stack>
                        <Card ml={100} mr={100} mt={20}>
                            <Title>
                                Pricing
                            </Title>
                            <Card>
                                Our pricing is simple and straightforward. We offer a free tier for small teams and a
                                competitive pricing model for larger teams. Our pricing is based on the number of users
                                and
                                the number of components in your system. We offer a free trial of our Pro Plan for 30
                                days.
                            </Card>
                        </Card>
                    </Stack>

                    <Center>
                        <Box m={20} h={670} r={20} bg="#fff" w={700} p={20}>
                            <Card>
                                <Card.Section>
                                    <Center>
                                        {freeTier()}
                                    </Center>
                                </Card.Section>
                            </Card>
                        </Box>
                        <Box m={20} r={20} bg="#fff" w={700} p={20}>
                            <stripe-pricing-table width="1000" pricing-table-id="prctbl_1PoUHDIgscFP7VKKUNTFDdkQ"
                                                  publishable-key="pk_test_51MyftTIgscFP7VKKnW1j2rvFgh7OwXwhBjLZ2aZg5YpfakxqcpRUHkYS8tJIq8mXU9luZYFh1PnSO2ku6xjARi0f00sqBNuDki">
                            </stripe-pricing-table>
                        </Box>
                    </Center>

                </AppShell.Main>
            </AppShell>
        </MantineProvider>
    )
}