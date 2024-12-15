import {Card, Center, Image, Title} from "@mantine/core";

export function MarketingCard(props: {title: string, image: string}) {
    return <Center>
        <Card withBorder={true} radius="xl" p="md" m="md" w={640}>
            <Card.Section p={20}>
                <Title>
                    {props.title}
                </Title>
            </Card.Section>
            <Card.Section p="md">
                <Center>
                    <Image w={512}  src={props.image} alt={props.title}/>
                </Center>
            </Card.Section>
        </Card>
    </Center>
}