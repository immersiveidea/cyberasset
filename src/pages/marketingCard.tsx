import {Card, Center, Image, Title} from "@mantine/core";

export function MarketingCard(props: {title: string, image: string}) {
    return <Center>
        <Card withBorder={true} radius="xl" p="md" m="md" component="a">
            <Card.Section p={20}>
                <Title>
                    {props.title}
                </Title>
            </Card.Section>
            <Card.Section>
                <Image w={1024}  src={props.image} alt={props.title}/>
            </Card.Section>
        </Card>
    </Center>
}