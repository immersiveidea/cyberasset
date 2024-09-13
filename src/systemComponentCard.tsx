import {ActionIcon, Button, Card} from "@mantine/core";
import {IconPencil, IconTrashX} from "@tabler/icons-react";
import {useNavigate, useParams} from "react-router-dom";
import {usePouch} from "use-pouchdb";

export default function SystemComponentCard({data, selectComponent}) {
    const params = useParams();
    const db = usePouch();
    const navigate = useNavigate();
    const removeComponent = (id) => {
        db.get(id).then((doc) => {
            db.remove(doc);
        }).catch((err) => {
            console.log(err);
        });
    }
    const selected = params.componentId && (params.componentId == data._id);
    /* <NavLink leftSection={<IconStar color={selected? '#FF0': '#00F'}/>} id={data._id} key={data._id}
                        onClick={selectComponent} label={data.name || data._id}/>
    */
    const editComponent = () => {
        if (params.solutionId) {
            navigate('/solution/' + params.solutionId + '/component/' + data._id);
        } else {
            navigate('/component/' + data._id);
        }
    }
    return (<Card>
        <Card.Section>
            {data.name}
        </Card.Section>
        <Card.Section>
            <ActionIcon onClick={editComponent} id={data._id} bg="#00F">
                <IconPencil/>
            </ActionIcon>
            <ActionIcon bg="#F00">
                <IconTrashX onClick={() => removeComponent(data._id)} color="#FFF"/>
            </ActionIcon>
        </Card.Section>
    </Card>)
}