import {dia, shapes, util} from "@joint/core";
import log, {Logger} from "loglevel";
import Graph = dia.Graph;
import Rectangle = shapes.standard.Rectangle;
import Link = shapes.standard.Link;
import {SolutionFlowStep} from "../types/solutionFlowStep.ts";
import {TemplateComponent} from "../types/templateComponent.ts";

export default class SequenceDiagram {
    private _graph: Graph;
    private _paper: dia.Paper;
    private _logger: Logger;
    private _flowsteps: Map<number, SolutionFlowStep> = new Map();
    private _components: Map<string, TemplateComponent> = new Map();

    constructor(el: HTMLElement, setSelected: (selected: any) => void) {
        this._logger = log.getLogger('SequenceDiagram');
        this._logger.debug('SequenceDiagram constructor called');
        this._graph = new Graph({}, {cellNamespace: shapes});
        //el.style.pointerEvents = 'none';

        this._paper = new dia.Paper({
            el: el,
            width: 1000,
            height: 800,
            model: this._graph,
            async: true,
            gridSize: 10,
            cellViewNamespace: shapes,
            drawGrid: {name: "fixedDot"},
            interactive: false,
            background: {
                color: 'rgba(20, 20, 40, 0.9)'
            }
        });
        this._paper.on('link:pointerclick', (cell) => {
            const seq = cell.model.get('sequence');
            const flowstep = this._flowsteps.get(seq);
            setSelected(flowstep);
            this._logger.debug('link:pointerclick', JSON.stringify(cell.model), JSON.stringify(flowstep));
        });

    }
    private getSwimlanes(flowsteps: SolutionFlowStep[]) {
        const swimlanes = [];
        for (const step of flowsteps) {
            const flowStep = (step as unknown) as SolutionFlowStep;
            const component = this._components.get(flowStep.source);
            const lane = swimlanes.find((lane) => {
                return lane.id === flowStep.source
            });
            if (component) {
                if (lane) {
                    lane.interactions.push({sequence: flowStep.sequence, destination: flowStep.destination});
                } else {
                    swimlanes.push({
                        id: flowStep.source,
                        name: component?.name,
                        interactions: [{sequence: flowStep.sequence, destination: flowStep.destination}]
                    });
                }
            } else {
                this._logger.error('component not found', flowStep.source);
            }
        }
        return swimlanes;
    }

    public updateDiagram(flowsteps: Array<SolutionFlowStep>, components) {
        let x = 100;
        const bottoms = [];
        for (const flowstep of flowsteps) {
            this._flowsteps.set(flowstep.sequence, flowstep);
        }
        for (const component of components) {
            this._components.set(component._id, component);
        }
        const swimlanes = this.getSwimlanes(flowsteps);
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
        const factor = 25;
        const yStart = 80;
        const data = [];
        const responses: Array<SolutionFlowStep> = [];
        for (const flowstep of flowsteps) {
            this._logger.debug('flowstep', flowstep);
            const future = flowsteps.slice(flowstep.sequence+1);
            this._logger.debug('future', future);
            const response = future.find((step) => {
                return step.source === flowstep.destination &&
                    !flowstep.responseTo &&
                    step.destination === flowstep.source &&
                    step.sequence > flowstep.sequence
            });
            if (response) {
                this._logger.debug('response', response);
                if (response?.responseTo !== flowstep._id) {
                    response.responseTo = flowstep._id;
                    responses.push(response);
                }
                data.push({request: {sequence: flowstep.sequence, stepid: flowstep.source},
                    response: {sequence: response.sequence, stepid: flowstep.destination}})
            }
        }
        this._logger.debug(data.length);


        for (const activation of data) {
            const y = activation.request.sequence;
            const requestCell = this._graph.getCell('lifestart' + activation.request.stepid);
            const responseCell = this._graph.getCell('lifestart' + activation.response.stepid);
            if (requestCell && responseCell) {
                const xOffset = 0;
                const requestPosition = {x: requestCell.position().x + 45 + xOffset + 2, y: yStart + factor * y};
                const responsePosition = {x: responseCell.position().x + 45 + xOffset - 2, y: yStart + factor * y};
                const height = (activation.response.sequence - activation.request.sequence) * factor;
                const life = new Rectangle(
                    {
                        id: 'life' + activation.response.stepid + 'b' + y,
                        size: {
                            width: 8,
                            height: height
                        },
                        position: requestPosition
                    });

                const life2 = new Rectangle(
                    {
                        id: 'life' + activation.request.stepid + 'a' + y,
                        size: {
                            width: 8,
                            height: height
                        },
                        position: responsePosition
                    });
                life.attr('body/fill', '#8888DD');
                life2.attr('body/fill', '#00AACC');

                this._graph.addCell(life);
                this._graph.addCell(life2);

                this._logger.debug('life', activation.response.sequence);

                buildLinks(life, activation.request.sequence, life2, activation.response.sequence, y, this._graph, this._flowsteps.get(activation.request.sequence),
                    this._flowsteps.get(activation.response.sequence)
                );
            }
        }
        this._logger.debug('data', data);
        bottoms.forEach((bottom) => {
            bottom.position(bottom.position().x, data.length  * factor + yStart + 230);
        })


    }
}

function buildLinks(source, sourceSequence, target, targetSequence, i, graph, flowstep: SolutionFlowStep,
                     response: SolutionFlowStep) {


    const link = buildLink(source, target, i, 'top', sourceSequence, flowstep);
    graph.addCell(link);
    const linkReturn = buildLink(target, source, i, 'bottom', targetSequence, response);
    graph.addCell(linkReturn);
}

function buildLink(source, target, i, position, sequence, flowstep) {
    const link = new Link({
        id: 'link' + source.id + target.id + i,
    });
    link.source(source, {anchor: {name: position}});
    link.target(target, {anchor: {name: position}});
    link.prop('attrs/line', {stroke: '#8888FF'});

    link.labels([
        {
            attrs: {
                text: {
                    text: (sequence +1).toString() + ' ' + (flowstep?.name || ''),
                    fontSize: 12,
                }
            }
        }
    ]);
    link.set('sequence', sequence);

    return link;
}