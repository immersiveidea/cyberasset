import {Box, Button} from "@mantine/core";
import {IconTrash} from "@tabler/icons-react";

export default function DeleteButton(data) {
    const onClick = data.onClick;
    const id = data.id;

    return (<Box key={'delete-' + id} pt={24}>
        <Button  size="xs" color="red"
                onClick={(e) => {
                    onClick(id);
                }}>
            <IconTrash/>
        </Button>
    </Box>)
}