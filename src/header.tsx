import {AppShell, Button, Group, NavLink, Tabs, Title} from "@mantine/core";
import {Link, useNavigate} from "react-router-dom";

export default function Header() {
    const navigate = useNavigate();
    const changeTab = (tab) => {
        navigate(tab);
    }
    return (
        <AppShell.Header bg="none">
            <Group grow>
                <Title key="header">Cyber Sec SHIELD</Title>
                <Group key="header-buttons" p={12} justify="flex-end">
                    <Button key="home" width={240} onClick={()=>{changeTab('/')}}>Home</Button>
                    <Button key="inventory" width={240} onClick={()=>{changeTab('/inventory')}}>Inventory</Button>
                    <Button key="admin" width={240} onClick={()=>{changeTab('/admin')}}>Admin</Button>
                </Group>
            </Group>

        </AppShell.Header>)

}