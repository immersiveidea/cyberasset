export type SolutionType = PouchDB.Core.IdMeta & PouchDB.Core.GetMeta & {
    solution_id: string;
    name: string;
    authorEmail: string;
    connections: string[];
    type: string;
    description: string;
};