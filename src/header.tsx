import {Button, Group, Image} from "@mantine/core";
import {useAuth0} from "@auth0/auth0-react";
import {Link} from "react-router-dom";

export default function Header() {
    const {user, isAuthenticated, loginWithRedirect, logout} = useAuth0();

    const topNavData = [
        {url: '/solutions', name: 'Solutions', auth: true},
        {url: '/signup', name: 'Sign Up', auth: false},
        {url: '/pricing', name: 'Pricing', auth: null},
        {url: '/features', name: 'Features', auth: null},
        {url: '/admin', name: 'Admin', auth: null},
        {url: '/', name: 'Home', auth: null}
    ]
    const topNaveItems = topNavData.map((item) => {
        switch (item.auth as boolean | null) {
            case true:
                if (isAuthenticated) {
                    return <Link key={item.name} to={item.url} w={120}>{item.name}</Link>
                } else {
                    return <></>
                }
            case false:
                if (!isAuthenticated) {
                    return <Link key={item.name} to={item.url} w={120}>{item.name}</Link>
                } else {
                    return <></>
                }
            default:
                return <Link key={item.name} to={item.url} w={120}>{item.name}</Link>
        }
    });
    const picture = () => {
        if (user.picture) {
            return <Image w="32" h="32" src={user.picture} alt="user"/>
        } else {
            return <></>
        }
    }
    const userDisplay = () => {
        if (isAuthenticated) {
            return <Group>
                {user.name}
                {picture()}
                <Button onClick={() => logout({logoutParams: {returnTo: window.location.origin}})}>Logout</Button>
            </Group>
        } else {
            return <Button key="login" onClick={() => loginWithRedirect()}>Login</Button>
        }
    }
    return (
        <Group bg="#000" justify="center">
            <Group justify="left" p={22}>
                Cyber SHIELD
            </Group>
            <Group justify="right" p={22}>
                {topNaveItems}
                {userDisplay()}
            </Group>
        </Group>
    )
}