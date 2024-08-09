import PouchDB from "pouchdb";
import pouchFind from "pouchdb-find";
PouchDB.plugin(pouchFind);

export function data() {
    return [new PouchDB("components"), new PouchDB("connections")];
}