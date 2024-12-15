import {Box, Button, Tooltip} from "@mantine/core";
import {IconTrash} from "@tabler/icons-react";

export default function DeleteButton({onClick, id}) {
    return (<Box key={'delete-' + id}>
        <Tooltip label="Delete this">
        <Button size="24px" color="red" p={2}
                onClick={() => {
                    onClick(id);
                }}>
            <IconTrash size="16px"/>
        </Button>
        </Tooltip>
    </Box>)
}