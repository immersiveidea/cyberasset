import {Box, Button, Tooltip} from "@mantine/core";
import {IconArrowDown} from "@tabler/icons-react";
import {options} from "./buttonDefaults.ts";

export default function DownloadButton({onClick, id}) {
    return (<Box key={'delete-' + id} pt={options.pt}>
        <Tooltip label="Download this to a json file">
            <Button size={options.size} color="blue"
                    onClick={() => {
                        onClick(id);
                    }}>
                <IconArrowDown/>
            </Button>
        </Tooltip>
    </Box>)
}