import {dia, linkAnchors, shapes, util} from "@joint/core";
import log, {Logger} from "loglevel";
import Graph = dia.Graph;
import Rectangle = shapes.standard.Rectangle;
import Link = shapes.standard.Link;
import connectionRatio = linkAnchors.connectionRatio;


export default class SequenceDiagram {
    private _graph: Graph;
    private _paper: dia.Paper;
    private _logger: Logger;

    constructor(el: HTMLElement) {
        this._logger = log.getLogger('SequenceDiagram');
        this._graph = new Graph({}, {cellNamespace: shapes});
        this._paper = new dia.Paper({
            el: el,
            width: 1000,
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

    public updateDiagram(flowsteps, swimlanes) {
        let i = 100;
        let seq = 75;
        const bottoms = [];
        for (const swimlane of swimlanes) {
            const role = new Rectangle(
                {
                    id: 'lifestart' + swimlane.id,
                    size: {width: 100, height: 50},
                    position: {x: i, y: 10}
                });
            role.attr({label: {text: util.breakText(swimlane.name, {width: 100})}});
            this._graph.addCell(role);
            const role2 = role.clone();
        //    role2.id = 'lifeend' + swimlane.id;
            role2.position(i, 400);
            bottoms.push(role2);
            this._graph.addCell(role2);
            const lifeline = new Link({
                id: 'lifeline' + swimlane.id,
                attrs: {line: {stroke: 'white',}}
            });
            lifeline.prop('source', {id: role.id});
            lifeline.prop('target', {id: role2.id});
            //lifeline.attr('line/stroke', 'black');
            //lifeline.attr('body/fill', 'black');
            //lifeline.attr('body/refPoints', '-1,-1 -1,1 1,1 1,-1');
            this._logger.debug('lifeline', lifeline);
            this._graph.addCell(lifeline);
            i = i + 150;
        }
        const factor = 50;
        let next = 1;
        const data = []
        for (const flowstep of flowsteps) {
            this._logger.debug('flowstep', flowstep);
            const resp = flowsteps.find((step) => {
                return step.source === flowstep.destination &&
                    step.destination === flowstep.source &&
                    step.sequence > flowstep.sequence
            });
            if (resp) {
                this._logger.debug('resp', resp);
                const reqres = {
                    request: {sequence: flowstep.sequence, stepid: flowstep.source},
                    response: {sequence: resp.sequence, stepid: flowstep.destination},
                }
                data.push(reqres);
            }

        }
        i=2;
        for (const activation of data) {
            const requestCell = this._graph.getCell('lifestart' + activation.request.stepid);
            const responseCell = this._graph.getCell('lifestart' + activation.response.stepid);


            const life = new Rectangle(
                {
                    id: 'life' + activation.response.stepid+'b'+i,
                    size: {width: 10, height: activation.response.sequence*factor - activation.request.sequence*factor},
                    position: {x: requestCell.position().x+45, y: factor*i}
                });
            const life2 = new Rectangle(
                {
                    id: 'life' + activation.request.stepid+'a'+i,
                    size: {width: 10, height: activation.response.sequence*factor - activation.request.sequence*factor},
                    position: {x: responseCell.position().x+45, y: factor*i}
                });
            this._graph.addCell(life);
            this._graph.addCell(life2);
            const link = new Link({
                id: 'link' + i,
                attrs: {line: {stroke: 'white'}}
            });
            link.source(life, {anchor: {name: 'top'}});
            link.target(life2, {anchor: {name: 'top'}});
            this._graph.addCell(link)
            const linkReturn = new Link({
                id: 'linkReturn' + i,
                attrs: {line: {stroke: 'white'}}
            });
            linkReturn.source(life2, {anchor: {name: 'bottom'}});
            linkReturn.target(life, {anchor: {name: 'bottom'}});
            this._graph.addCell(linkReturn)
            i+=1.5;
        }
        this._logger.debug('data', data);

        bottoms.forEach((bottom) => {
            bottom.position(bottom.position().x, (i+3)*factor);
        })

    }
}