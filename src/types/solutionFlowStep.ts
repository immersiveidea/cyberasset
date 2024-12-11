import {RowType} from "./rowType.ts";

export type SolutionFlowStep = {
    _id: string,
    type: RowType,
    solution_id: string,
    solution_flow_id: string,
    protocol: string,
    port: number,
    description: string,
    messageformat: string,
    name: string;
    message: string,
    returnStep: string,
    host: string,
    method: string,
    path: string,
    source: string,
    destination: string,
    sequence: number
};