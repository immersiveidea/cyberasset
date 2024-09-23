import {ActionIcon, Card} from "@mantine/core";
import {IconPencil, IconTrashX} from "@tabler/icons-react";
import {useNavigate, useParams} from "react-router-dom";
import {usePouch} from "use-pouchdb";
import log from "loglevel";

type MasterComponents = {
    _id: string;
    _rev: string
    list: { _id: string, name: string }[];
}
export default function SolutionComponentCard({data}) {
    const logger = log.getLogger('SystemComponentCard');
    const params = useParams();
    const db = usePouch();
    const navigate = useNavigate();
    const removeComponent = (id) => {
        if (params.solutionId) {
            db.get(id).then((doc) => {
                db.remove(doc)
                    .then(() => {
                        logger.debug('component removed');
                    })
                    .catch((err) => {
                        logger.error(err);
                    });
            }).catch((err) => {
                logger.error(err);
            })
        } else {
            db.get('components').then((doc) => {
                logger.debug('grabbing master doc', doc);
                const masterDoc = (doc as unknown) as MasterComponents;
                masterDoc.list = masterDoc.list.filter((component) => {
                    return component._id !== id;
                });
                logger.debug('new master doc', masterDoc);
                db.put(masterDoc)
                    .then(() => {
                        logger.debug('master doc updated');
                    }).catch((err) => {
                    logger.error(err);
                });
            }).catch((err) => {
                logger.error(err);
            });
        }

    }
    logger.debug(data);
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