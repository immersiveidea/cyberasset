import {useFind, usePouch} from "use-pouchdb";
import {AppShell, Button, Card, FileInput, Group, MantineProvider, rgba, SimpleGrid} from "@mantine/core";
import {useNavigate} from "react-router-dom";
import {theme} from "../theme.ts";
import Header from "../header.tsx";
import log from "loglevel";
import {SolutionType} from "../types/solutionType.ts";
import {RowType} from "../types/rowType.ts";
import DeleteButton from "../components/buttons/deleteButton.tsx";
import SelectButton from "../components/buttons/selectButton.tsx";
import CopyButton from "../components/buttons/copyButton.tsx";
import DownloadButton from "../components/buttons/downloadButton.tsx";
import {useAuth0} from "@auth0/auth0-react";
import fileDownload from "js-file-download";

export function SolutionList() {
    const logger = log.getLogger('SolutionList');
    const db = usePouch();
    const navigate = useNavigate();
    const auth0 = useAuth0();

    const {docs: solutions, state} = useFind({
        index: {
            fields: ['type', 'name']
        },
        selector: {
            type: RowType.Solution
        }
    });
    const createSolution = async () => {
        const newSolution = {
            type: RowType.Solution,
            authorEmail: auth0.user.email,
            name: '',
            description: ''
        }
        const response = await db.post(newSolution);
        navigate(`/solution/${response.id}/edit`);
    }
    const deleteSolution = async (event) => {
        logger.debug('deleting', event);
        try {
            const solution = await db.get(event);
            await db.remove(solution);
        } catch (err) {
            logger.error(err);
        }
    }

    const cloneSolution = async (id) => {
        logger.debug('cloning', event);
        try {
            const oldSolution = await db.get(id) as SolutionType;
            logger.debug('oldSolution', oldSolution);
            const all = await db.allDocs({include_docs: true});
            const clonedData = [];
            const components = [];
            const newSolution = await db.post({name: oldSolution.name + ' (clone)', type: RowType.Solution});
            logger.debug(newSolution);
            for (const row of all.rows) {
                const solutionEntity = row.doc as SolutionType;
                if (solutionEntity.solution_id === id) {
                    const clonedDoc = {...solutionEntity};
                    delete clonedDoc._id;
                    delete clonedDoc._rev;
                    delete clonedDoc._conflicts;
                    delete clonedDoc.connections;
                    clonedDoc.solution_id = newSolution.id;
                    switch (clonedDoc.type) {
                        case RowType.SolutionComponent:
                            components.push(clonedDoc);
                            break;
                        case RowType.SolutionFlowStep:
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
    const select = (id) => {
        navigate(`/solution/${id}`);
    }

    const copy = (id) => {
        logger.debug('copy', id);
    }
    const download = async (id) => {

        const QUERY = {
            selector: {
                solution_id: id,
            }
        }
        const {docs: newData} = await db.find(QUERY);
        logger.debug(JSON.stringify(newData));
        fileDownload(JSON.stringify(newData), 'solution.json');

    }
    const importSolution = async (file: File) => {
        const text = await file.text();
        logger.debug(text);
        const data = JSON.parse(text);
        const conflicts =[];
        if (data.length > 0) {
            for (const item of data) {
                try {
                    let existing= null;
                    try {
                        existing = await db.get(item._id);
                    } catch (error) {
                        logger.debug('not found', item);
                        existing = null;
                    }
                    if (!existing) {
                        logger.debug('adding', item);
                        delete item._rev;
                        await db.put(item);
                    } else {
                        if (existing._rev === item._rev) {
                            logger.debug('Existing', existing);
                            logger.debug('Imported', item);
                        } else {
                            conflicts.push({myItem: existing, thierItem: item});
                        }
                    }
                } catch (err) {
                    logger.error(err);
                }
            }
        }
        if (conflicts.length > 0) {
            logger.debug('conflicts', conflicts);
        } else {
            logger.debug('no conflicts');
        }

    }
    const solutionCard = (solution) => {
        return (
            <Card w={300} h={256} key={solution._id}>
                <Card.Section key="header">
                    {solution.name}
                </Card.Section>
                <Card.Section h={190} key="description">
                    {solution.description}
                </Card.Section>
                <Card.Section key="actions">
                    <Group justify="space-evenly">
                        <SelectButton onClick={select} id={solution._id}/>
                        <DeleteButton onClick={deleteSolution} id={solution._id}/>
                        <CopyButton onClick={cloneSolution} id={solution._id}/>
                        <DownloadButton onClick={download} id={solution._id}/>
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
                            <Group>
                                <Button w="200px" key="create" onClick={createSolution}>Create New Solution</Button>

                                <FileInput placeholder="Open File" w="200px" accept=".json" onChange={importSolution}>Import Solution File</FileInput>
                            </Group>
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