import {useFind, usePouch} from "use-pouchdb";
import {Button, NavLink} from "@mantine/core";
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {IconStar, IconStarFilled} from "@tabler/icons-react";


export function SolutionList({selectedSolution, setSelectedSolution}) {
    const navigate = useNavigate();

    const db = usePouch();
    const [solutionValue, setSolutionValue] = useState('');
    const {docs, state, loading, error} = useFind({
        index: {
            fields: ['type', 'name']
        },
        selector: {
            type: 'solution'
        }
    });

    const createSolution = () => {
        db.post({
            name: solutionValue,
            type: 'solution'
        }).then((response) => {
            setSelectedSolution(response.id);
            setSolutionValue('');
            const el = document.getElementById(response.id + '-name');
            if (el) {
                el.focus();
            } else {
                window.setTimeout(() => {
                    const el2 = document.getElementById(response.id + '-name');
                    if (el2) {
                        el2.focus();
                    }
                }, 500);
            }

        });
    }

    const selectSolution = (event) => {
        setSelectedSolution(event.currentTarget.id);
        navigate('/solution/' + event.currentTarget.id )
    }

    if (loading && docs && docs.length === 0) return <div>Loading...</div>

    if (state === 'error' && error) {
        return <div>Error: {error.message}</div>
    }

    const rowRender =
        docs.map((row) => {
            if (selectedSolution == row._id) {
                return <NavLink leftSection={<IconStarFilled color="#FF0"/>} size="compact-md" id={row._id} key={row._id}
                                onClick={selectSolution} label={row.name || row._id}/>
            } else {
                return <NavLink leftSection={<IconStar color="#00F"/>} size="compact-md" id={row._id} key={row._id}
                                onClick={selectSolution} label={row.name || row._id}/>
            }

        })

    return (<>
            <Button onClick={() => {createSolution()}} fullWidth={true}>Create</Button>
            {rowRender}
        </>
    )

}