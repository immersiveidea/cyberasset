import {Anchor, Button, Group, Modal, Paper, Stack, Textarea, TextInput, Title} from "@mantine/core";
import React from "react";
import {useParams} from "react-router-dom";

export default function SolutionHeader({editing, toggle, solutionData, setSolutionData, saveSolution, solution}) {
    const params = useParams();
    if (editing) {
        return (
            <Group>
                <Paper>
                    <Anchor href={`/solution/${params.solutionId}`}
                            onClick={
                                (e) => {
                                    e.preventDefault();
                                    toggle();
                                }}
                    >edit</Anchor>
                </Paper>
                <Modal opened={editing} onClose={toggle} title="Edit Solution Information">
                    <TextInput label="name"
                               value={solutionData?.name}
                               placeholder="Solution Name (Must be > 4 characters)"
                               error={solutionData?.name.length < 4? 'Name must be at least 4 characters': null}
                               onChange={
                        (e) => {
                            setSolutionData({...solutionData, name: e.currentTarget.value});
                        }
                    }/>
                    <Textarea rows={10} label="description" value={solutionData?.description}
                              placeholder="Solution Description"
                              onChange={(e) => {
                                  setSolutionData({...solutionData, description: e.currentTarget.value});
                              }}/>
                    <Button onClick={saveSolution}>Save</Button>
                </Modal>
            </Group>)
    } else {
        return (
            <Stack>
                <Title>
                    <Group>
                        <Anchor href={`/solution/${params.solutionId}`}
                                onClick={
                                    (e) => {
                                        e.preventDefault();
                                        toggle();
                                    }}
                        >{solution.name || solution._id}</Anchor>
                    </Group>
                </Title>

            </Stack>
        )
    }
}