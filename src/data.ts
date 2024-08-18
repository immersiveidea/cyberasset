import PouchDB from "pouchdb";
import pouchFind from "pouchdb-find";
import CONSTANTS from "./constants.ts";

PouchDB.plugin(pouchFind);

export function data() {
    return new PouchDB(CONSTANTS.DEMO_DB_NAME);
}