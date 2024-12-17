import {shapes, elementTools} from "@joint/core";

export function buildNode(id: string, x: number, y: number, name: string, type: string = 'Rectangle') {
    const shape =  new shapes.standard[type](
        {
            id: id,
            position: {x: x, y: y},
            size: {width: 80, height: 45},
            attrs: {
                body: {
                    fill: '#009',
                    rx: 5,
                    ry: 5,
                    strokeWidth: 2,
                    stroke: '#029'
                },
                label: {
                    text: name,
                    fill: '#cff'
                }
            }
        });
    return shape;
}

export function defaultLink(sequence: number, id: string, source: string, target: string) {
    return new shapes.standard.Link({
        id: id,
        connector: {name: 'curve'},
        source: {id: source,
            connectionPoint: {name: 'bbox', args: {offset: {y: 6}}}
        }   ,
        target: {id: target,
            connectionPoint: {name: 'bbox', args: {offset: {y: -6}}}
        },
        labels: [
            {
                attrs: {
                    text: {
                        text: (sequence+1).toString(),
                        fontSize: 12,
                    }
                },
                position: {
                    distance: 0.1,
                    offset: -10
                }


            }
        ],
        attrs: {
            line: {
                stroke: '#ccc',
                strokeWidth: 1,
                targetMarker: {
                    name: 'classic'
                }
            }
        }
    });
}