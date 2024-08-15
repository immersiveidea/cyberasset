import {theme} from "../theme.ts";
import {AppShell, Button, Card, Center, Group, MantineProvider, Menu, rgba, Stack} from "@mantine/core";
import Header from "../header.tsx";

import {ContentfulClientApi, createClient} from 'contentful';
import {useEffect, useState} from "react";
import Divider = Menu.Divider;
const api_key = 'tYjUo481jD8qWfG1NYfET0GOxMQDZv4ypA6R_R-oOyk';
const space='kyg6ozkh6trk';


const client: ContentfulClientApi  = createClient({
    space: space,
    environment: 'master',
    accessToken: api_key
})

const cardData = [];

export default function PricingPage() {
    const [data, setData] = useState([]);
    useEffect(()=>{
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
                                return {index: index, label: feature.fields.label, description: feature.fields.description}});
                        }
                        cardData.push({
                            id: item.sys.id,
                            title: item.fields.title,
                            price: item.fields.price,
                            description: item.fields.description,
                            ranking: item.fields.ranking,
                            features: features
                        });
                    })
                        cardData.sort((a, b) => {return a.ranking > b.ranking ? 1 : -1});

                    setData(cardData);
                    }

                })
                .catch(console.error)

        return() => {
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
                                <Button fullWidth>Sign Up For {card.title}</Button>
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
                                    return <li key={feature.index}><strong>{feature.label}</strong> {feature.description}</li>
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
                header={{height:80}}>
                <AppShell.Header bg={rgba('#FFF',.1)}>
                    <Header/>
                </AppShell.Header>
                <AppShell.Main>
                    <Stack>
                        <h1>Pricing</h1>
                        <p>Our pricing is simple and straightforward. We offer a free tier for small teams and a
                            competitive pricing model for larger teams. Our pricing is based on the number of users and
                            the number of components in your system. We offer a free trial of our Pro Plan for 30 days.</p>
                    </Stack>

                    <h2>Free Tier</h2>
                    <Group>
                        {buildCards()}
                    </Group>

                </AppShell.Main>
            </AppShell>
        </MantineProvider>
    )
}