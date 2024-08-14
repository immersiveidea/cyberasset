import {AppShell, NavLink} from "@mantine/core";
import {useNavigate} from "react-router-dom";
import {SystemComponentList} from "./systemComponentList.tsx";
import {SolutionList} from "./solutionList.tsx";

export default function Navigation({selectedComponent, setSelectedComponent, selectedSolution, setSelectedSolution}) {
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
                <SolutionList selectedSolution={selectedSolution} setSelectedSolution={setSelectedSolution}/>
            </NavLink>
            <NavLink opened={selectedSolution && true} label='Components'>
                <SystemComponentList selectedComponent={selectedComponent} setSelectedComponent={setSelectedComponent}/>
            </NavLink>
            {links}
        </AppShell.Navbar>
    )
}