import createEngine, {
    DagreEngine, DagreEngineOptions,
    DefaultNodeModel,
    DefaultPortModel,
    DiagramModel,
    NodeModel
} from '@projectstorm/react-diagrams';

import {CanvasWidget} from '@projectstorm/react-canvas-core';
import {Box, Card} from "@mantine/core";
import {useAllDocs, useFind} from "use-pouchdb";

export default function Diagram({data}) {
    const {rows: components, state: componentsState} = useAllDocs({
        include_docs: true,
        db: 'components'
    })

    const componentId = data._id;
    const CONNECTION_QUERY = {
        index: {
            fields: ['type', 'components']
        },
        selector: {
            type: 'connection',
            components: {
                $elemMatch: {
                    id: {
                        $eq: componentId
                    }
                }
            }
        },
        db: 'connections'
    };

    const {docs: connections, state: connectionsState} = useFind(CONNECTION_QUERY);
    if (componentsState !== 'done') return <Box>Loading Components...</Box>;
    if (connectionsState !== 'done') return <Box>Loading Connections...</Box>;

    if (!components || components.length === 0) return <Box>Nothing Here</Box>
    if (!data) return <Box>Nothing Here</Box>
    const engine = createEngine();
    const model = new DiagramModel();
    let i = 10;
    const mainNode = new DefaultNodeModel({
        id: data._id,
        name: data.name,
        color: 'rgb(0,192,255)'
    });
    mainNode.setPosition(i, 100);
    mainNode.registerListener(
        {
            positionChanged: (event) => {


            }
        }
    );
    model.addNode(mainNode);
    const upsert = (id) => {
        const existing = model.getNodes().find((node) => node.getOptions().id === id);
        if (!existing) {
            const other = components.find((component) => component.doc._id === id);
            if (other) {
                const node = new DefaultNodeModel({
                    id: other.doc._id,
                    name: other.doc.name,
                    color: 'rgb(0,192,255)',
                    width: 100,
                    height: 20
                });
                node.setPosition(i += 100, 100);
                model.addNode(node);
            }
        }
    }
    if (connections && connections.length >0 ) {
        connections.forEach((connection) => {
            upsert(connection.source);
            upsert(connection.destination);
            if (connection.source && connection.destination) {
                const source: NodeModel = model.getNode(connection.source);
                const destination: NodeModel = model.getNode(connection.destination);
                const outPort = new DefaultPortModel(false, connection._id + '-out', 'Out')
                const inPort = new DefaultPortModel(true, connection._id + '-in', 'In')
                source.addPort(outPort);
                destination.addPort(inPort);
                const link = outPort.link(inPort);
                console.log(link);
                model.addLink(link);
            } else {
                console.log('no existing node');
            }
        });
        engine.setModel(model);
        const layoutEngine = new DagreEngine({
            graph: {
                rankdir: 'LR',
                ranker: 'tight-tree',
                marginx: 40,
                marginy: 40,
                nodesep: 100,
                ranksep: 150
            },
            includeLinks: true,
            nodeMargin: 100

        } as DagreEngineOptions);
        layoutEngine.redistribute(model);
        layoutEngine.refreshLinks(model);

        return <CanvasWidget className="diagramcanvas" engine={engine}/>
    }
}