import {useFind, usePouch} from "use-pouchdb";
import {AppShell, Button, Card, Group, MantineProvider, rgba, SimpleGrid} from "@mantine/core";
import {useNavigate} from "react-router-dom";
import {theme} from "../theme.ts";
import Header from "../header.tsx";
import log from "loglevel";
import {SolutionEntity} from "./solutionType.ts";

export function SolutionList() {
    const logger = log.getLogger('SolutionList');
    const db = usePouch();
    const navigate = useNavigate();

    const {docs: solutions, state} = useFind({
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
    const deleteSolution = async(event) => {
        logger.debug('deleting', event);
        try {
            const solution = await db.get(event);
            await db.remove(solution);
        } catch (err) {
            logger.error(err);
        }
    }

    const cloneSolution = async (event) => {
        logger.debug('cloning', event);
        try {
            const oldSolution = await db.get(event) as SolutionEntity;
            logger.debug('oldSolution', oldSolution);
            const all = await db.allDocs({include_docs: true});
            const clonedData = [];
            const components = [];
            const newSolution = await db.post({name: oldSolution.name + ' (clone)', type: 'solution'});
            logger.debug(newSolution);
            for (const row of all.rows) {
                const solutionEntity = row.doc as SolutionEntity;
                if (solutionEntity.solution_id === event) {
                    const clonedDoc = {...solutionEntity};
                    delete clonedDoc._id;
                    delete clonedDoc._rev;
                    delete clonedDoc._conflicts;
                    delete clonedDoc.connections;
                    clonedDoc.solution_id = newSolution.id;
                    switch (clonedDoc.type) {
                        case 'component':
                            components.push(clonedDoc);
                            break;
                        case 'flowstep':
                            //don't clone these yet
                            break;
                        default:
                            break;
                    }
                    clonedData.push(clonedDoc);
                }
            }
            if (components?.length > 0) {
                await db.bulkDocs(components);
            }
        } catch (err) {
            logger.error(err);
        }
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
                        <Button key="delete" onClick={() => {
                            deleteSolution(solution._id);
                        }}>Delete</Button>
                        <Button key="clone" onClick={() => {
                            cloneSolution(solution._id)
                        }}>Clone</Button>
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