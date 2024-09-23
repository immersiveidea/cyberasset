import {theme} from "../theme.ts";
import {AppShell, Box, Button, Card, Center, MantineProvider, rgba, Stack} from "@mantine/core";
import Header from "../header.tsx";

import {ContentfulClientApi, createClient} from 'contentful';
import {useEffect, useState} from "react";
import {useAuth0} from "@auth0/auth0-react";


const api_key = '9GBUuEluE7T4uGQjaTOkoZKzrSgpDaXBwIUE-tWrheI';
const space = 'sat4eqi9td0e';


const client: ContentfulClientApi = createClient({
    space: space,
    environment: 'master',
    accessToken: api_key
})

const cardData = [];

export default function OldPricingPage() {
    const {user, isAuthenticated, loginWithRedirect} = useAuth0();
    const [data, setData] = useState([]);
    useEffect(() => {
        let ignore = false;
        if (data.length === 0) {
            client.getEntries({content_type: 'plan'})
                .then((response) => {
                    if (!ignore) {
                        console.log('Response', response.items);
                        response.items.forEach((item) => {
                            let features = [];
                            if (item.fields.features) {
                                features = item.fields.features.map((feature, index) => {
                                    return {
                                        index: index,
                                        label: feature.fields.label,
                                        description: feature.fields.description
                                    }
                                });
                            }
                            cardData.push({
                                id: item.sys.id,
                                title: item.fields.title,
                                price: item.fields.price,
                                description: item.fields.description,
                                ranking: item.fields.ranking,
                                tier: item.fields.tier,
                                features: features
                            });
                        })
                        cardData.sort((a, b) => {
                            return a.ranking > b.ranking ? 1 : -1
                        });

                        setData(cardData);
                    }

                })
                .catch(console.error)

            return () => {
                ignore = true;
            }
        }
    });
    const cardSize = {w: 350, h: 500};

    const buildCards = () => {
        return (
            data.map((card) => {
                    return (
                        <Card key={card.id} w={cardSize.w} h={cardSize.h} p={30}>
                            <Card.Section>
                                <Center>
                                    {user?.metadata?.tier != card?.tier ?
                                        <Button onClick={() => loginWithRedirect()}>Change to
                                            This</Button> : 'Current Level'}
                                </Center>
                            </Card.Section>
                            <Card.Section p={10}>
                                <h3>{card.title}</h3>
                                {card.price}
                            </Card.Section>
                            <Card.Section h={160}>
                                {card.description}
                            </Card.Section>
                            <Card.Section p={10} h={200} bg="#002">
                                <h4>Features</h4>
                                <ul>
                                    {card.features.map((feature) => {
                                        return <li key={feature.index}>
                                            <strong>{feature.label}</strong> {feature.description}</li>
                                    })}
                                </ul>
                            </Card.Section>
                        </Card>
                    )
                }
            )
        )
    }
    return (
        <MantineProvider defaultColorScheme="dark" theme={theme}>
            <AppShell
                header={{height: 80}}>
                <AppShell.Header bg={rgba('#FFF', .1)}>
                    <Header/>
                </AppShell.Header>
                <AppShell.Main>
                    <Stack>
                        <h1>Pricing</h1>
                        <p>Our pricing is simple and straightforward. We offer a free tier for small teams and a
                            competitive pricing model for larger teams. Our pricing is based on the number of users and
                            the number of components in your system. We offer a free trial of our Pro Plan for 30
                            days.</p>
                    </Stack>

                    <Center>
                        <Box r={20} bg="#fff" w={700} p={20}>
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