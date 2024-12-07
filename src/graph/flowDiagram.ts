import {dia, highlighters, shapes} from "@joint/core";
import log from "loglevel";
import {defaultLink, defaultNode} from "../solutionComponents/defaultNodes.ts";
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
        document.addEventListener('keydown', (evt) => {
            if (this._lastClicked && evt.key === 'Backspace') {
                this._logger.debug(this._lastClicked);
                this._logger.debug(evt);
                this._on['delete']({id: this._lastClicked.id});
            }
        });
        this._graph = new Graph({}, {cellNamespace: shapes});
        this._paper = new dia.Paper({
            el: el,
            width: 800,
            height: 800,
            model: this._graph,
            async: true,
            gridSize: 10,
            cellViewNamespace: shapes,
            drawGrid: {name: "fixedDot"},
            background: {
                color: 'rgba(0, 0, 0, 0.1)'
            }
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
        this._paper.on('link:pointerclick', (cell) => {
            this._logger.debug('here');
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
            this._on['delete']({id: this._lastClicked.id});
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
                        this._lastClicked = null;
                    } else {
                        this._logger.debug('unclick', this._lastClicked.id, cell.model);
                        highlighters.mask.removeAll(this._paper);
                        highlighters.mask.add(cell, {selector: 'root'}, 'highlight');
                        this._lastClicked = {id: cell.model.id as string, type: 'element'};
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
        this._graph.clear();
        //const cells = this._graph.getCells().map((cell) => {return {id: cell.id, present: false, cell: cell}});
        components.forEach((component) => {
            const comp = component as unknown as { _id: string, name: string };
            const pos = layout[comp._id]?.position || {x: 10, y: 10};
            this.createNode(comp._id, pos.x, pos.y, comp.name);
            /*if (cells.find((cell) => cell.id == comp._id)) {
                cells.find((cell) => cell.id == comp._id).present = true;
            }*/
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

    public createNode(id: string, x: number, y: number, name: string) {
        const exists = this._graph.getCell(id) != null;
        if (exists) {
            return exists;
        }
        const rect = defaultNode(id, x, y, name);
        const cell = this._graph.addCell(rect);
        cell.on('change:position', (cell, position) => {
            this._drop = {id: cell.id, x: position.x, y: position.y};
        })
        this._logger.debug('createNode', id, x, y, name, exists);
        return rect;
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