import {Box, Button, Container, Flex, Grid, Group, Image} from "@mantine/core";
import {useAuth0} from "@auth0/auth0-react";
import {Link} from "react-router-dom";

export default function Header() {
    const {user, isAuthenticated, loginWithRedirect, logout} = useAuth0();

    const topNavData = [
        {url: '/solutions', name: 'Solutions', auth: true},
        {url: '/pricing', name: 'Pricing', auth: false},
        {url: '/features', name: 'Features', auth: false},
        {url: '/admin', name: 'Admin', auth: true},
        {url: '/', name: 'Home', auth: false},
        {url: '/signup', name: 'Sign Up', auth: false},
    ]
    const topNaveItems = topNavData.map((item) => {
        switch (item.auth as boolean | null) {
            case true:
                if (isAuthenticated) {
                    return <Link  component="button" key={item.name} to={item.url} w={120}>{item.name}</Link>
                } else {
                    return <></>
                }
            case false:
                if (!isAuthenticated) {
                    return <Link component="button"  key={item.name} to={item.url} w={120}>{item.name}</Link>
                } else {
                    return <></>
                }
            default:
                return <Link component="button" key={item.name} to={item.url} w={120}>{item.name}</Link>
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
                <Box visibleFrom="sm" component="span">{picture()}</Box>
                <Button  onClick={() => logout({logoutParams: {returnTo: window.location.origin}})}>Logout</Button>
            </Group>
        } else {
            return <Button key="login" onClick={() => loginWithRedirect()}>Login</Button>
        }
    }
    return (
        <>
        <Grid  bg="#000">
                <Grid.Col span={8}>
                    <Group>
                        SHIELD
                        {topNaveItems}
                    </Group>
                </Grid.Col>
                <Grid.Col span={4}>
                    <Group justify="flex-end">
                        {userDisplay()}
                    </Group>
                </Grid.Col>
        </Grid>
        </>
    )
}