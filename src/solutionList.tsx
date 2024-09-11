import {useFind, usePouch} from "use-pouchdb";
import {Button, Card, Group, SimpleGrid} from "@mantine/core";
import SolutionsListTemplate from "./templates/SolutionsListTemplate.tsx";
import {useState} from "react";
import {useNavigate} from "react-router-dom";

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

        return (<SolutionsListTemplate>
                <Button onClick={createSolution}>Create New Solution</Button>
                <SimpleGrid cols={3}>
                    {solutions.map((solution) => {
                        console.log(solution);
                        return (
                            solutionCard(solution)
                        )
                    })}
                </SimpleGrid>
            </SolutionsListTemplate>
        )
    }
}