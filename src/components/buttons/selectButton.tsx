import {Box, Button, Tooltip} from "@mantine/core";
import {IconSelect} from "@tabler/icons-react";

export default function SelectButton({onClick, id}) {
    return (<Box key={'delete-' + id} pt={24}>
        <Tooltip label="Select this solution">
        <Button size="xs" color="blue"
                onClick={() => {
                    onClick(id);
                }}>
            <IconSelect/>
        </Button>
        </Tooltip>
    </Box>)
}