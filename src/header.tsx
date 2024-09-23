import {Box, Burger, Button, Container, Grid, Group, Image, Popover, Stack, Text} from "@mantine/core";
import {useAuth0} from "@auth0/auth0-react";
import {Link} from "react-router-dom";

export default function Header() {
    const {user, isAuthenticated, loginWithRedirect, logout} = useAuth0();
    const show = (item) => {
        return item.auth === null || item.auth === isAuthenticated;
    }
    const topNavData = [
        {url: '/solutions', name: 'Solutions', auth: true},
        {url: '/components', name: 'Components', auth: true},
        {url: '/pricing', name: 'Pricing', auth: false},
        {url: '/features', name: 'Features', auth: false},
        {url: '/admin', name: 'Admin', auth: true},
        {url: '/', name: 'Home', auth: null},
        {url: '/signup', name: 'Sign Up', auth: false},
    ]

    const TopNavItems = topNavData.map((item) => {
        if (show(item)) {
            return <Container size="sm"
                              display="inline-flex"
                              component={Link}
                              key={item.name}
                              to={item.url}>{item.name}</Container>
        } else {
            return <Container size="sm"
                              display="none"
                              component={Link}
                              key={item.name}
                              to={item.url}>{item.name}</Container>
        }
    });

    const picture = () => {
        if (user.picture) {
            return <Image key="userImage" w="32" h="32" src={user.picture} alt="user"/>
        } else {
            return <></>
        }
    }

    const userDisplay = () => {
        if (isAuthenticated) {
            return <Group key="user">
                <Box key="picture" visibleFrom="sm" component="span">{picture()}</Box>
                <Button key="button"
                        onClick={() => logout({logoutParams: {returnTo: window.location.origin}})}>Logout</Button>
            </Group>
        } else {
            return <Button key="login" onClick={() => loginWithRedirect()}>Login</Button>
        }
    }
    return (
        <>
            <Grid bg="#000" p="sm" justify="space-evenly">
                <Grid.Col key="left-grid" span={8}>
                    <Group key="left-group" visibleFrom="xs" justify="left" w={512}>
                        <Text key="shield">SHIELD</Text>
                        {TopNavItems}
                    </Group>
                    <Group key="right-group" hiddenFrom="xs">
                        <Text key="shield">SHIELD</Text>
                        <Popover key="popover" position="bottom">
                            <Popover.Target>
                                <Burger hiddenFrom="sm"/>
                            </Popover.Target>
                            <Popover.Dropdown>
                                <Stack>
                                    {TopNavItems}
                                </Stack>
                            </Popover.Dropdown>
                        </Popover>
                    </Group>
                </Grid.Col>
                <Grid.Col key="right" span={4}>
                    <Group justify="right">{userDisplay()}</Group>
                </Grid.Col>
            </Grid>
        </>
    )
}