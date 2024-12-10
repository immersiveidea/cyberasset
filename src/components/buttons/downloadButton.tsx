import {Box, Button, Tooltip} from "@mantine/core";
import {IconArrowDown} from "@tabler/icons-react";

export default function DownloadButton({onClick, id}) {
    return (<Box key={'delete-' + id} pt={24}>
        <Tooltip label="Download this to a json file">
            <Button size="xs" color="blue"
                    onClick={() => {
                        onClick(id);
                    }}>
                <IconArrowDown/>
            </Button>
        </Tooltip>
    </Box>)
}