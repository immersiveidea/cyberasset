import {dia, shapes} from "@joint/core";
import Graph = dia.Graph;
import {Logger} from "loglevel";

export default class SequenceDiagram {
    private _graph: Graph;
    private _paper: dia.Paper;
    private _logger: Logger;
    constructor(el: HTMLElement) {
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
    }
}