import {Box, Button, Tooltip} from "@mantine/core";
import {IconPencil, IconSelect} from "@tabler/icons-react";
import {options} from "./buttonDefaults.ts";

export default function SelectButton({onClick, id}) {
    return (<Box key={'delete-' + id} pt={options.pt}>
        <Tooltip label="Select this item">
        <Button size={options.size} color="blue"
                onClick={() => {
                    onClick(id);
                }}>
            <IconPencil/>
        </Button>
        </Tooltip>
    </Box>)
}