import {useFind, usePouch} from "use-pouchdb";
import {Button, NavLink} from "@mantine/core";
import {useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {IconStar, IconStarFilled} from "@tabler/icons-react";
type NameId = {
    _id: string;
    name: string;
}

export function SystemComponentList() {
    const params = useParams();
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
        navigate('/solution/' + params.solutionId + '/component/' + event.currentTarget.id );
    }

    if (loading && docs && docs.length === 0) return <div>Loading...</div>

    if (state === 'error' && error) {
        return <div>Error: {error.message}</div>
    }
    console.log(params.componentId);
    const rowRender =
        docs.map((row) => {
            const data = (row as unknown) as NameId;
            if (params.componentId == data._id) {
                return <NavLink leftSection={<IconStarFilled color="#FF0"/>} id={data._id} key={data._id}
                                onClick={selectComponent} label={data.name || data._id}/>
            } else {
                return <NavLink leftSection={<IconStar color="#00F"/>} id={data._id} key={data._id}
                                onClick={selectComponent} label={data.name || data._id}/>
            }

        })

    return (<>
            <Button onClick={() => {createComponent()}} fullWidth={true}>Create</Button>
        {rowRender}
        </>
    )

}