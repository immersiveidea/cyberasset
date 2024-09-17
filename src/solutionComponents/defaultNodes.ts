import {shapes} from "@joint/core";

export function defaultNode(id: string, x: number, y: number, name: string) {
    return new shapes.standard.Rectangle(
        {
            id: id,
            position: {x: x, y: y},
            size: {width: 100, height: 40},
            attrs: {
                body: {
                    fill: '#00f',
                    rx: 10,
                    ry: 10,
                    strokeWidth: 2,
                    stroke: '#00c'
                },
                label: {
                    text: name,
                    fill: 'white'
                }
            }
        });
}

export function defaultLink(sequence: number, id: string, source: string, target: string) {
    return new shapes.standard.Link({
        id: id,
        connector: {name: 'curve'},
        source: {id: source},
        target: {id: target},
        labels: [
            {
                attrs: {
                    text: {
                        text: sequence.toString()
                    }

                },
                position: {
                    distance: 0.8,
                    offset: 16
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