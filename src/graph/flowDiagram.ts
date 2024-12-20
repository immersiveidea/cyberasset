import {dia, elementTools, highlighters, shapes} from "@joint/core";
import log from "loglevel";
import {defaultLink, buildNode} from "./defaultNodes.ts";
import Graph = dia.Graph;
import Paper = dia.Paper;

export default class FlowDiagram {
    private readonly _logger = log.getLogger('FlowDiagram');
    private readonly _graph: Graph;
    private readonly _paper: Paper;
    private _drop: { id: string, x: number, y: number };
    private _on = [];
    private _lastClicked: { id: string, type: 'element' | 'edge' };

    constructor(el: HTMLElement) {
        this._logger.debug('FlowDiagram constructor called');
        this._graph = new Graph({}, {cellNamespace: shapes});
        this._paper = new dia.Paper({
            el: el,
            width: 900,
            height: 900,
            model: this._graph,
            async: true,
            gridSize: 10,
            clickThreshold: 4,
            cellViewNamespace: shapes,
            drawGrid: {name: "fixedDot"},
            background: {
                color: 'rgba(0, 0, 0, 0.1)'
            }
        });
        this._graph.on('remove', (cell) => {
            this._logger.debug('remove', cell);
            this._on['delete']({id: cell.id});
        })
        this._paper.on('element:mouseenter', function(elementView) {
            elementView.showTools();
        });

        this._paper.on('element:mouseleave', function(elementView) {
            elementView.hideTools();
        });

        this._paper.on('link:mouseenter', function(elementView) {
            elementView.showTools();
        });

        this._paper.on('link:mouseleave', function(elementView) {
            elementView.hideTools();
        });
        this._paper.on('cell:pointerup', () => {
            if (this._drop) {
                //evt.preventDefault();
                this._logger.debug(this._drop);
                if (this._on['drop']) {
                    this._on['drop']({id: this._drop.id, x: this._drop.x, y: this._drop.y});
                }
                this._drop = null;
            }
            // this._logger.debug('cell:pointerup', cellView.data.model.id, x, y);
        });
        this._paper.on('blank:pointerclick', () => {
            highlighters.mask.removeAll(this._paper);
            this._lastClicked = null;
        });
        this._paper.on('link:pointerclick', (cell) => {

            this._logger.debug('link:pointerclick', this._lastClicked?.id, cell.model.id);
            if (this._lastClicked?.id == cell.model.id) {
                highlighters.mask.removeAll(this._paper);
                this._lastClicked = null;
            } else {
                highlighters.mask.removeAll(this._paper);
                highlighters.mask.add(cell, {selector: 'root'}, 'highlight');
                this._lastClicked = {id: cell.model.id as string, type: 'edge'};
            }

        });
        this._paper.on('link:pointerdblclick', (cell) => {
            highlighters.mask.add(cell, {selector: 'root'}, 'highlight');
            this._logger.debug('dblclick', cell);
            this._lastClicked = {id: cell.model.id as string, type: 'edge'};
            //cell.remove();
            //this._on['delete']({id: this._lastClicked.id});

        })
        this._paper.on('element:pointerclick', (cell, evt) => {
            this._logger.debug(evt);
            this._logger.debug('pointerclick', cell.model);
            if (this._lastClicked) {
                if (this._lastClicked?.id != cell.model.id) {
                    if (this._lastClicked.type == 'element') {
                        //this.createEdge(this._lastClicked.id, cell.model.id as string);
                        if (this._on['connect']) {
                            this._on['connect']({source: this._lastClicked.id, destination: cell.model.id});
                        }
                        highlighters.mask.removeAll(this._paper);
                        highlighters.mask.add(cell, {selector: 'root'}, 'highlight');
                        this._lastClicked = {id: cell.model.id as string, type: 'element'};
                    } else {
                        this._logger.debug('unclick', this._lastClicked.id, cell.model);
                        highlighters.mask.removeAll(this._paper);
                        this._lastClicked = null;
                    }
                } else {
                    highlighters.mask.removeAll(this._paper);
                    this._lastClicked = null;
                }

            } else {
                this._logger.debug(cell.model)
                highlighters.mask.add(cell, {selector: 'root'}, 'highlight');
                if (this._on['select']) {
                    this._on['select']({id: cell.model.id});
                }

                this._lastClicked = {id: cell.model.id as string, type: 'element'};
            }
        });
    }

    public on(name, callback: (event) => void) {
        this._on[name] = callback;
    }

    public updateGraph(components, connections, layout) {
        //this._graph.clear();
        const cells = this._graph.getCells().map((cell) => {return {id: cell.id, present: false, cell: cell}});
        for (const cell of cells) {
            if (components.find((comp) => comp._id === cell.id) == null) {
                //this._logger.debug('delete', cell.id);
                //cell.cell.remove();
             //   this._on['delete']({id: cell.id});
            }
        }
        let xCurrent = 10;
        let yCurrent = 10;
        components.forEach((component) => {
            const comp = component as unknown as { _id: string, name: string, shape?: string };
            if (yCurrent > 500) {
                yCurrent = 10;
                xCurrent += 200;
            }
            const pos = layout[comp._id]?.position || {x: xCurrent, y: yCurrent += 50};

            this.createNode(comp._id, pos.x, pos.y, comp.name, comp.shape);
        })

        connections.forEach((connection) => {
            const comp = connection as unknown as {
                _id: string,
                sequence: number,
                source: string,
                destination: string
            };
            try {
                //this._logger.debug('createEdge', comp);
                if (comp.sequence != null) {
                    this._logger.debug('sequence', comp.sequence);
                }
                this.createEdge(comp.sequence, comp._id, comp.source, comp.destination);
                /*if (cells.find((cell) => cell.id == comp._id)) {
                    cells.find((cell) => cell.id == comp._id).present = true;
                }*/
            } catch (err) {
                this._logger.error(err);
                this._on['delete']({id: comp._id});
            }
        })
    }

    public createNode(id: string, x: number, y: number, name: string, shape?: string) {
        const exists = this._graph.getCell(id) != null;
        this._logger.debug(this._graph.getCells());
        if (exists) {
            this._logger.debug('found', id);
            return exists;
        }
        const node = buildNode(id, x, y, name, shape);
        const cell = this._graph.addCell(node);
        cell.on('change:position', (cell, position) => {
            this._drop = {id: cell.id, x: position.x, y: position.y};
        })

        const view = this._paper.findViewByModel(node);
        const removeButton = new elementTools.Remove({name: 'remove', x: '100%', y: '0', scale: 2});

        const toolsView = new dia.ToolsView({
            name: 'basic-tools',
            tools: [removeButton]
        });
        removeButton.hide();

        view.addTools(toolsView);
        this._logger.debug('createNode', id, x, y, name, exists);
        return node;
    }

    public createEdge(sequence: number, id: string, source: string, target: string) {
        const exists = this._graph.getLinks().find((link) => {
            const lnk = link as unknown as { source: { id: string }, target: { id: string } };
            return lnk.source.id == source && lnk.target.id == target;
        }) != null;
        if (exists) {
            return exists;
        }
        this._logger.debug('createEdge', source, target, exists);
        const link = defaultLink(sequence, id, source, target);
        try {
            const s = this._graph.getCell(source);
            const d = this._graph.getCell(target);
            if (s && d) {
                this._graph.addCell(link);
                const view = this._paper.findViewByModel(link);
                const removeButton = new elementTools.Remove({name: 'remove', y: '50%', scale: 2});
                removeButton.hide();
                const toolsView = new dia.ToolsView({
                    name: 'basic-tools',
                    tools: [removeButton]
                })
                view.addTools(toolsView);
            } else {
                this._logger.error('source', s);
                this._logger.error('destination', d);
                throw new Error('missing connection');
            }
        } catch (err) {
            this._logger.error(err);
            throw new Error('missing connection');
        }
    }

    public destroy() {
        this._paper.remove();
    }
}