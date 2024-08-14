import {useFind, usePouch} from "use-pouchdb";
import {Button, NavLink} from "@mantine/core";
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {IconStar, IconStarFilled} from "@tabler/icons-react";


export function SystemComponentList({selectedComponent, setSelectedComponent}) {
    //const selectedComponent = data.selectedComponent;
    //const setSelectedComponent = data.setSelectedComponent;
    const navigate = useNavigate();
    const db = usePouch();
    const [componentValue, setComponentValue] = useState('');
    const {docs, state, loading, error} = useFind({
        index: {
            fields: ['type', 'name']
        },
        selector: {
            type: 'component'
        }
    });

    const createComponent = () => {
        db.post({
            name: componentValue,
            type: 'component'
        }).then((response) => {
            setSelectedComponent(response.id);
            setComponentValue('');
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

    const selectComponent = (event) => {
        setSelectedComponent(event.currentTarget.id);
        navigate('/inventory');
    }

    if (loading && docs && docs.length === 0) return <div>Loading...</div>

    if (state === 'error' && error) {
        return <div>Error: {error.message}</div>
    }

    const rowRender =
        docs.map((row, index) => {
            if (selectedComponent == row._id) {
                return <NavLink leftSection={<IconStarFilled color="#FF0"/>} size="compact-md" id={row._id} key={row._id}
                                onClick={selectComponent} label={row.name || row._id}/>
            } else {
                return <NavLink leftSection={<IconStar color="#00F"/>} size="compact-md" id={row._id} key={row._id}
                                onClick={selectComponent} label={row.name || row._id}/>
            }

        })

    return (<>
            <Button onClick={() => {createComponent()}} fullWidth={true}>Create</Button>
        {rowRender}
        </>
    )

}