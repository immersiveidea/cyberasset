import {Button, Stack} from "@mantine/core";
import {useAllDocs} from "use-pouchdb";

export function ConnectionList() {
    const {rows, loading, state, error} = useAllDocs({
        include_docs: true,
        db: 'connections'
    })
    if (loading && rows.length === 0) return <div>Loading...</div>

    if (state === 'error' && error) {
        return <div>Error: {error.message}</div>
    }
    const selectConnection = (event) => {

    }
    const data = [
        {_id: '1', name: 'Connection 1'},
        {_id: '2', name: 'Connection 2'},
    ]
    const rowRender =
        rows.map((r, index) => {
            const row = r.doc;

            return (
                <Button size="xs" key={row._id}>
                    {row.name || row._id}
                </Button>
            )
        })
    return <Stack gap="md">
        <h1>Connections</h1>
        <Stack gap="xs">
            {rowRender}
        </Stack>
    </Stack>
}