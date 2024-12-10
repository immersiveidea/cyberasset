import {Box, Button, Tooltip} from "@mantine/core";
import {IconCirclePlus} from "@tabler/icons-react";

export default function NewButton({onClick, id}) {
    return (<Box key={'delete-' + id} pt={24}>
        <Tooltip label="Create new">
            <Button size="xs" color="blue"
                    onClick={() => {
                        onClick(id);
                    }}>
                <IconCirclePlus/>
            </Button>
        </Tooltip>
    </Box>)
}