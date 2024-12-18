import {Box, Button, Tooltip} from "@mantine/core";
import {IconTrash} from "@tabler/icons-react";
import {options} from "./buttonDefaults.ts";

export default function DeleteButton({onClick, id}) {
    return (<Box key={'delete-' + id} pt={options.pt}>
        <Tooltip label="Delete this">
        <Button size={options.size} color="red"
                onClick={() => {
                    onClick(id);
                }}>
            <IconTrash/>
        </Button>
        </Tooltip>
    </Box>)
}