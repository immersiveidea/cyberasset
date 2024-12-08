import {Box, Button, Tooltip} from "@mantine/core";
import {IconCopy} from "@tabler/icons-react";

export default function CopyButton({onClick, id}) {
    return (<Box key={'copy-' + id} pt={24}>
        <Tooltip label="Clone this solution">
            <Button size="xs" color="blue"
                onClick={() => {
                    onClick(id);
                }}>
            <IconCopy/>
        </Button>
        </Tooltip>
    </Box>)
}