import {Box, Button, Tooltip} from "@mantine/core";
import {IconCopy} from "@tabler/icons-react";
import {options} from "./buttonDefaults.ts";

export default function CopyButton({onClick, id}) {
    return (<Box key={'copy-' + id} pt={options.pt}>
        <Tooltip label="Clone this">
            <Button size={options.size} color="blue"
                onClick={() => {
                    onClick(id);
                }}>
            <IconCopy/>
        </Button>
        </Tooltip>
    </Box>)
}