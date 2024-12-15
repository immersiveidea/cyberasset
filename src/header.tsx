import {
    Box,
    Burger,
    Button,
    Container,
    Grid,
    Group,
    HoverCard, HoverCardDropdown,
    Image,
    NavLink,
    Popover,
    Stack,
    Text
} from "@mantine/core";
import {useAuth0} from "@auth0/auth0-react";
import {Link} from "react-router-dom";
import {useFind} from "use-pouchdb";
import log from "loglevel";
import {RowType} from "./types/rowType.ts";
const local = false;

export default function Header() {
    const logger = log.getLogger('Header');
    const {docs: solutionList, state: solutionState} = useFind({selector: {type: RowType.Solution}});

    logger.debug('solutionList', solutionList);
    let {user, isAuthenticated, loginWithRedirect, logout} = useAuth0();
    if (local) {
        user = {};
        isAuthenticated = true;
    }

    const show = (item) => {
        return item.auth === null || item.auth === isAuthenticated;
    }
    const topNavData = [
        {url: '/', name: 'Home', auth: null},
        {url: '/features', name: 'Features', auth: false},
        {url: '/pricing', name: 'Pricing', auth: false},
        {url: '/components', name: 'Components', auth: true},
        {url: '/admin', name: 'Admin', auth: true},
//        {url: '/signup', name: 'Sign Up', auth: false},
    ]
    const solutionNavData = solutionList.map((solution) => {
        return (
            <NavLink component={Link} to={`/solution/${solution._id}`} label={solution.name}/>
        )
    });
    const solutionNav = () => {
        return (
            <HoverCard>
                <HoverCard.Target><Link to='/solutions'>Solutions</Link></HoverCard.Target>
                <HoverCardDropdown>
                    {solutionNavData}
                </HoverCardDropdown>
            </HoverCard>
        )
    }
    const TopNavItems = topNavData.map((item) => {
        if (show(item)) {
            return <Container size="sm"
                              display="inline-flex"
                              key={item.name}>
                <Link to={item.url}>{item.name}</Link></Container>
        } else {
            return <Container size="sm"
                              display="none"
                              key={item.name}>
                <Link to={item.url}>{item.name}</Link></Container>

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
                        {solutionNav()}
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
                                    {solutionNav()}
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