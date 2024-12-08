import {Box, Button, Tooltip} from "@mantine/core";
import {IconTrash} from "@tabler/icons-react";

export default function DeleteButton({onClick, id}) {
    return (<Box key={'delete-' + id} pt={24}>
        <Tooltip label="Delete this solution">
        <Button size="xs" color="red"
                onClick={() => {
                    onClick(id);
                }}>
            <IconTrash/>
        </Button>
        </Tooltip>
    </Box>)
}