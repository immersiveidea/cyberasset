import {useFind, usePouch} from "use-pouchdb";
import {AppShell, Button, Card, Group, MantineProvider, rgba, SimpleGrid} from "@mantine/core";
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {theme} from "../theme.ts";
import Header from "../header.tsx";

export function SolutionList() {
    const db = usePouch();
    const navigate = useNavigate();
    const [solution, setSolution] = useState({id: '', name: '', description: ''});

    const {docs: solutions, state, loading, error} = useFind({
        index: {
            fields: ['type', 'name']
        },
        selector: {
            type: 'solution'
        }
    });
    const createSolution = async () => {
        const newSolution = {
            type: 'solution',
            name: '',
            description: ''
        }
        const response = await db.post(newSolution);
        navigate(`/solution/${response.id}`);
    }
    const solutionCard = (solution) => {
        return (
            <Card w={256} h={256} key={solution._id}>
                <Card.Section key="header">
                    {solution.name}
                </Card.Section>
                <Card.Section h={190} key="description">
                    {solution.description}
                </Card.Section>
                <Card.Section key="actions">
                    <Group justify="space-evenly">
                        <Button key="use" onClick={
                            () => {
                                navigate(`/solution/${solution._id}`);
                            }
                        }>Select</Button>
                        <Button key="delete">Delete</Button>
                    </Group>
                </Card.Section>
            </Card>
        )
    }
    if (state === 'loading') {
        return <div>Loading</div>
    } else {

        return (
            <>
                <MantineProvider defaultColorScheme="dark" theme={theme}>
                    <AppShell
                        header={{height: 44}}
                        padding="md">
                        <AppShell.Header bg={rgba('#FFF', .1)}>
                            <Header/>
                        </AppShell.Header>
                        <AppShell.Main bg="none">
                            <Button onClick={createSolution}>Create New Solution</Button>
                            <SimpleGrid cols={3}>
                                {solutions.map((solution) => {
                                    console.log(solution);
                                    return (
                                        solutionCard(solution)
                                    )
                                })}
                            </SimpleGrid>
                        </AppShell.Main>
                    </AppShell>
                </MantineProvider>
            </>
        )
    }
}