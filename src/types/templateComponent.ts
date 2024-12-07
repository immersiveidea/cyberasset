import {NameId} from "./nameId.ts";
import {RowType} from "./rowType.ts";

export type TemplateComponent = NameId & {
    _id: string;
    _rev: string
    name: string;
    type: RowType;
    icon?: string;
    description?: string;
    tags?: string[];
    dependencies?: string[];
    code?: string;
    version?: string;
    metadata?: object;
}