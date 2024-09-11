import createEngine, {
    DagreEngine,
    DagreEngineOptions,
    DefaultNodeModel,
    DefaultPortModel,
    DiagramModel,
    NodeModel,
    RightAngleLinkFactory
} from '@projectstorm/react-diagrams';

import {CanvasWidget} from '@projectstorm/react-canvas-core';
import {Affix, Box, Button} from "@mantine/core";
import {useDoc, useFind, usePouch} from "use-pouchdb";
import {useEffect, useState} from "react";
type Rankable = { rank: number };

export default function OverviewDiagram() {
    const [update, setUpdate] = useState(0);
    const COMPONENTS_QUERY = {
        index: {
            fields: ['type']
        },
        selector: {
            type: 'component',
        }
    };
    const {docs: components, state: componentsState} = useFind(COMPONENTS_QUERY);

    const CONNECTION_QUERY = {
        index: {
            fields: ['type', 'components']
        },
        selector: {
            type: 'connection',
        }
    };

    const {docs: connections, state: connectionsState} = useFind(CONNECTION_QUERY);
    const {doc: layoutDoc, error: layoutDocError} = useDoc('layout');
    const db = usePouch();

    if (componentsState !== 'done') return <Box>Loading Components...</Box>;
    if (connectionsState !== 'done') return <Box>Loading Connections...</Box>;
    if (!components || components.length === 0) return <Box>Nothing Here</Box>


    let i = 10;
    const layoutEngine = new DagreEngine({
        graph: {
            rankdir: 'LR',
            align: 'DR',
            marginx: 30,
            marginy: 30,
            nodesep: 120,
            ranksep: 120
        },
        includeLinks: false,
        nodeMargin: 100

    } as DagreEngineOptions);
    const engine = createEngine();
    engine.getLinkFactories().registerFactory(new RightAngleLinkFactory());
    const model = new DiagramModel();
    engine.setModel(model);



    const upsert = (id) => {
        const existing = model.getNodes().find((node) => node.getOptions().id === id);
        if (!existing) {
            const other = components.find((component) => component._id === id);


            if (other) {
                const node = new DefaultNodeModel({
                    id: other._id,
                    name: ((other as unknown) as { name: string }).name,
                    color: 'rgb(0,192,255)',
                });
                if (!layoutDocError && layoutDoc && layoutDoc[id]?.position) {
                    console.log(layoutDoc[id]);
                    node.setPosition(layoutDoc[id].position.x, layoutDoc[id].position.y);
                } else {
                    node.setPosition(i += 30, i += 20);
                }
                model.addNode(node);
            }
        }
    }
    components.forEach((component) => {
        const c = (component as unknown) as { type: string, _id: string };
        if (c.type == 'component') {
            upsert(c._id);
        }

    })

    if (connections && connections.length > 0) {
        const conns = connections.toSorted((a, b) => {
            return ((a as unknown) as  Rankable).rank - ((b as unknown) as Rankable).rank;
        });
        conns.forEach((conn) => {
            const connection = (conn as unknown) as { source: string, destination: string, _id: string, rank: number };
            upsert(connection.source);
            upsert(connection.destination);
            if (connection.source && connection.destination) {
                console.log(connection);
                const source: NodeModel = model.getNode(connection.source);
                const destination: NodeModel = model.getNode(connection.destination);
                if (source && destination) {
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

            } else {
                console.log('no existing node');
            }
        });
        if (layoutDocError) {
            layoutEngine.redistribute(model);

            const obj = {}
            model.getNodes().forEach((node) => {obj[node.getOptions().id] = {position: node.getPosition()}});
            db.post({_id: 'layout', ...obj});
        }
        const saveLayout = () => {
            const obj = {}
            model.getNodes().forEach((node) => {obj[node.getOptions().id] = {position: node.getPosition()}});
            db.put({...layoutDoc, ...obj});
        }
        return (<>
            <Affix position={{top: 20, left: 20}}><Button
                onClick={() =>{ layoutEngine.redistribute(model); setUpdate(update)}}>Auto Layout</Button>
                <Button
                    onClick={saveLayout}>Save Layout</Button>

            </Affix>
            <CanvasWidget className="diagramcanvas" engine={engine}/>
        </>)
    }
}