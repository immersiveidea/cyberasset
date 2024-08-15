import {Button, Group} from "@mantine/core";
import {useAuth0} from "@auth0/auth0-react";
export default function Header() {
    const {user, isAuthenticated, loginWithRedirect} = useAuth0();

    const topNavData = [
        {url: '/try', name: 'Try It Out'},
        {url: '/pricing', name: 'Pricing'},
        {url: '/features', name: 'Features'},
        {url: '/admin', name: 'Admin'},
        {url: '/', name: 'Home'}
    ]
    const topNaveItems = topNavData.map((item) => {
        return <Button key={item.name} href={item.url} component="a" w={120}>{item.name}</Button>
    });
    const userDisplay = isAuthenticated ? <div key="login">{user.name}</div> : <></>;
    const login = isAuthenticated ? userDisplay : <Button key="login" onClick={() => loginWithRedirect()}>Login</Button>;
    return (
        <Group justify="center">
            <Group justify="left" p={22}>
                Cyber SHIELD
            </Group>
            <Group justify="right" p={22}>
                {topNaveItems}
                {login}
            </Group>
        </Group>
    )
}