import {Modal} from "@mantine/core";

export default function ConnectionOptions() {
    const closed = () => {
        console.log('closed');
    }
    return (
        <Modal opened={true} centered onClose={closed} withCloseButton={true}>
            Test
        </Modal>
    )
}