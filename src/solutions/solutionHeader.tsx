import {Anchor, Button, Group, Modal, Paper, Stack, Textarea, TextInput, Title} from "@mantine/core";
import React from "react";
import {useParams} from "react-router-dom";

export default function SolutionHeader ({editing, toggle, solutionData, setSolutionData, saveSolution, solution}) {
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
                    <TextInput label="name" value={solutionData?.name} onChange={
                        (e) => {
                            setSolutionData({...solutionData, name: e.currentTarget.value});
                        }
                    }/>
                    <Textarea rows={10} label="description" value={solutionData?.description}
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

                        <Anchor href={`/solution/${params.solutionId}/diagram`}
                                onClick={
                                    (e) => {
                                        e.preventDefault();
                                        window.open(`/solution/${params.solutionId}/diagram`,
                                            `/solution/${params.solutionId}/diagram`,
                                            'popup, width=800, height=600,location=false');
                                    }}>network connections</Anchor>
                    </Group>
                </Title>

            </Stack>
        )
    }
}