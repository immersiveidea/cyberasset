import {AppShell, NavLink} from "@mantine/core";
import {useNavigate} from "react-router-dom";
import {SystemComponentList} from "./systemComponentList.tsx";

export default function Navigation({selectedComponent, setSelectedComponent}) {
    const navigate = useNavigate();
    const changeTab = (tab) => {
        navigate(tab);
    }
    const navLinkData = [
        {url: '/', label: 'Home'},
        {url: '/solutions', label: 'Solutions'},
        {url: '/config', label: 'Admin'}]

    const links = navLinkData.map((link) => {
        return <NavLink onClick={(e) => {
            e.preventDefault();
            changeTab(link.url);
        }} label={link.label}/>
    });
    return (
        <AppShell.Navbar>
            <NavLink label='Solutions'>
                <SystemComponentList selectedComponent={selectedComponent} setSelectedComponent={setSelectedComponent}/>
            </NavLink>
            <NavLink label='Components'>
                <SystemComponentList selectedComponent={selectedComponent} setSelectedComponent={setSelectedComponent}/>
            </NavLink>
            {links}
        </AppShell.Navbar>
    )
}