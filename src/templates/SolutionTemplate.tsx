import {theme} from "../theme.ts";
import {
    Anchor,
    AppShell,
    Button,
    Group,
    MantineProvider,
    Modal,
    Paper,
    rgba, Stack,
    Textarea,
    TextInput, Title
} from "@mantine/core";
import Header from "../header.tsx";
import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {useDoc, usePouch} from "use-pouchdb";
import {useDisclosure} from "@mantine/hooks";
import QuickText from "../components/quickText.tsx";

export default function SolutionTemplate({navbar, main}) {
    const params = useParams();
    const db = usePouch();
    const [editing, {toggle}] =useDisclosure(false);

    const {doc: s} = useDoc(params.solutionId);
    const solution = (s as unknown) as {name: string, description: string, _id: string};
    const [solutionData, setSolutionData] = useState({name: '', description: ''});
    useEffect(() => {
        if (editing) {
            console.log('editing');
            setSolutionData({name: solution.name, description: solution.description});
        } else {
            console.log('not editing');
        }

    }, [editing, solution]);
    const saveSolution = () => {
        console.log('saving solution', solutionData);
        console.log(solution._id);
        db.put({...solution, ...solutionData});
        toggle();
    }
    if (!solution) {
        return <></>
    }
    const solutionHeader = () => {
        if (editing) {
            return (
            <Group>
                <Paper><Anchor href={`/solution/${params.solutionId}`}
                               onClick={
                                   (e) => {
                                       e.preventDefault();
                                       toggle();
                                   }}
                >edit</Anchor></Paper>
                <Modal opened={editing} onClose={toggle} title="Edit Solution Information">
                    <TextInput label="name" value={solutionData?.name} onChange={
                        (e) => {
                            setSolutionData({...solutionData, name: e.currentTarget.value});
                        }
                    }/>
                    <Textarea rows={10} label="description" value={solutionData?.description}
                     onChange={ (e) => {
                            setSolutionData({...solutionData, description: e.currentTarget.value});
                     }}/>
                    <Button onClick={saveSolution}>Save</Button>
                </Modal>
            </Group>)
        } else {
            return (
                <Stack>
                <Title>
                    <Anchor href={`/solution/${params.solutionId}`}
                        onClick={
                            (e) => {
                                e.preventDefault();
                                toggle();
                        }}
                    >{solution.name}</Anchor>

                    <Anchor href={`/solution/${params.solutionId}/diagram`}
                            onClick={
                                (e) => {
                                    e.preventDefault();
                                    window.open(`/solution/${params.solutionId}/diagram`,
                                        `/solution/${params.solutionId}/diagram`,
                                        'popup, width=800, height=600,location=false');
                                }}>show a diagram</Anchor>
                </Title>
                    <QuickText/>
                </Stack>


            )
        }
    }
    return (
        <MantineProvider defaultColorScheme="dark" theme={theme}>
            <AppShell
                header={{height: 84}}
                navbar={{width: 256, breakpoint: 'sm'}}
                padding="md">
                <AppShell.Header bg={rgba('#FFF', .1)}>
                    <Header/>


                </AppShell.Header>
                <AppShell.Navbar>
                    {navbar}
                </AppShell.Navbar>
                <AppShell.Main bg="none">
                    {solutionHeader()}
                    {main}
                </AppShell.Main>
            </AppShell>
        </MantineProvider>
    )
}