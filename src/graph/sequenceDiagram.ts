import {dia, shapes, util} from "@joint/core";
import log, {Logger} from "loglevel";
import Graph = dia.Graph;
import Rectangle = shapes.standard.Rectangle;
import Link = shapes.standard.Link;

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
                color: 'rgba(20, 20, 40, 0.9)'
            }
        });

    }

    public updateDiagram(flowsteps, swimlanes) {
        let x = 100;
        const bottoms = [];
        for (const swimlane of swimlanes) {
            const role = new Rectangle(
                {
                    id: 'lifestart' + swimlane.id,
                    size: {width: 100, height: 50},
                    position: {x: x, y: 10}
                });
            role.attr({label: {text: util.breakText(swimlane.name, {width: 100})}});
            role.prop('attrs/body', {fill: '#404090'});
            role.prop('attrs/label', {fill: '#FFFFFF'});
            this._graph.addCell(role);
            const role2 = role.clone();
            role2.position(x, 400);
            bottoms.push(role2);
            this._graph.addCell(role2);
            const lifeline = new Link({
                id: 'lifeline' + swimlane.id,
            });
            lifeline.prop('source', {id: role.id});
            lifeline.prop('target', {id: role2.id});
            lifeline.prop('attrs/line', {stroke: '#3030F0', strokeDasharray: '5 10'});

            this._logger.debug('lifeline', lifeline);
            this._graph.addCell(lifeline);
            x = x + 120;
        }
        const factor = 30;
        const data = []
        for (const flowstep of flowsteps) {
            this._logger.debug('flowstep', flowstep);
            const respArray = flowsteps.filter((step) => {
                return step.source === flowstep.destination &&
                    step.destination === flowstep.source &&
                    step.sequence > flowstep.sequence
            });
            respArray.sort((a, b) => {
                return a.sequence - b.sequence
            });

            const reqArray = flowsteps.filter((step) => {
                return step.source === flowstep.source &&
                    step.destination === flowstep.destination &&
                    step.sequence > flowstep.sequence
            });
            reqArray.sort((a, b) => {
                return a.sequence - b.sequence
            });
            const index = reqArray.findIndex((req) => {
                return req._id == flowstep._id
            });
            this._logger.debug('index', index);
            if (respArray && respArray.length > 0) {
                const maxResp = index == -1 ? respArray[0] : respArray[index];
                this._logger.debug('resp', maxResp);
                const reqres = {
                    request: {sequence: flowstep.sequence, stepid: flowstep.source},
                    response: {sequence: maxResp.sequence, stepid: flowstep.destination},
                }
                data.push(reqres);
            }

        }
        let y = 3;
        for (const activation of data) {
            const requestCell = this._graph.getCell('lifestart' + activation.request.stepid);
            const responseCell = this._graph.getCell('lifestart' + activation.response.stepid);
            const xOffset = 0;
            if (requestCell.position().x < responseCell.position().x) {
                y -= .2;


            }
            const life = new Rectangle(
                {
                    id: 'life' + activation.response.stepid + 'b' + y,
                    size: {
                        width: 10,
                        height: activation.response.sequence * factor - activation.request.sequence * factor
                    },
                    position: {x: requestCell.position().x + 45 + xOffset + 2, y: factor * y}
                });

            const life2 = new Rectangle(
                {
                    id: 'life' + activation.request.stepid + 'a' + y,
                    size: {
                        width: 8,
                        height: activation.response.sequence * factor - activation.request.sequence * factor
                    },
                    position: {x: responseCell.position().x + 45 + xOffset - 2, y: factor * y}
                });
            life.attr('body/fill', '#8888DD');
            life2.attr('body/fill', '#00AACC');

            this._graph.addCell(life);
            this._graph.addCell(life2);
            buildLinks(life, activation.request.sequence, life2, activation.response.sequence, y, this._graph);
            y += 2;
        }
        this._logger.debug('data', data);

        bottoms.forEach((bottom) => {
            bottom.position(bottom.position().x, (y + 10) * factor);
        })

    }
}

function buildLinks(source, sourceSequence, target, targetSequence, i, graph) {
    const link = buildLink(source, target, i, 'top');
    link.attr('label/text', sourceSequence);
    link.labels([
        {
            attrs: {


                text: {
                    text: sourceSequence.toString(),
                    fontSize: 16,
                }
            }
        }
    ]);
    graph.addCell(link);
    const linkReturn = buildLink(target, source, i, 'bottom');
    linkReturn.labels([
        {
            attrs: {


                text: {
                    text: targetSequence.toString(),
                    fontSize: 16,
                }
            }
        }
    ]);
    graph.addCell(linkReturn);
}

function buildLink(source, target, i, position) {
    const link = new Link({
        id: 'link' + source.id + target.id + i,
    });
    link.source(source, {anchor: {name: position}});
    link.target(target, {anchor: {name: position}});
    link.prop('attrs/line', {stroke: '#8888FF'});
    return link;
}