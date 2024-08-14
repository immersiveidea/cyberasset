import {Button, Group} from "@mantine/core";

export default function Header() {
    const topNavData = [
        {url: '/try', name: 'Try It Out'},
        {url: '/pricing', name: 'Pricing'},
        {url: '/features', name: 'Features'},
        {url: '/admin', name: 'Admin'},
    ]
    const topNaveItems = topNavData.map((item) => {
        return <Button href={item.url} component="a" w={120}>{item.name}</Button>
    });
    return (
        <Group justify="center">
            <Group justify="left" p={22}>
                Cyber SHIELD
            </Group>
            <Group justify="right" p={22}>
                {topNaveItems}
            </Group>
        </Group>

    )
}