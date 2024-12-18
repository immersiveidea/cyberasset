import {Box, Button, Tooltip} from "@mantine/core";
import {IconCirclePlus} from "@tabler/icons-react";
import {options} from "./buttonDefaults.ts";

export default function NewButton({onClick, id}) {
    return (<Box key={'delete-' + id} pt={options.pt}>
        <Tooltip label="Create new">
            <Button size={options.size} color="blue"
                    onClick={() => {
                        onClick(id);
                    }}>
                <IconCirclePlus/>
            </Button>
        </Tooltip>
    </Box>)
}