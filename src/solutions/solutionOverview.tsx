import log from "loglevel";
import {useDoc, useFind, usePouch} from "use-pouchdb";
import {Link, useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {RowType} from "../types/rowType.ts";
import {Button, Textarea, TextInput} from "@mantine/core";
import {useAuth0} from "@auth0/auth0-react";
import {SolutionType} from "../types/solutionType.ts";

export default function SolutionOverview() {
    const logger = log.getLogger('SolutionOverview');
    const params = useParams();
    const db = usePouch();
    const {doc, state: solutionState} = useDoc(params.solutionId);
    const [solutionData, setSolutionData] = useState({name: '', description: ''} as SolutionType);
    useEffect(() => {
        if (solutionState === "done" && doc?._id) {
            logger.debug('solutionData', doc);
            setSolutionData((doc as unknown) as SolutionType);
        }
    }, [solutionState, doc]);

    const saveSolution = async () => {
        logger.debug('saving', solutionData);
        const newData = {...doc, ...solutionData};

        try {
            newData.type = RowType.Solution;
            const doc = await db.put(newData);
            if (doc.ok && doc.id != solutionData.solution_id) {
                try  {
                    logger.debug('updating solution_id', doc);
                    await db.put({...solutionData, solution_id: doc.id, _rev: doc.rev});
                } catch (err) {
                    logger.error(err);
                }

            }
            logger.debug("Saved Solution" , doc);
        } catch (err) {
            logger.error(err);
        }
    }

    const overviewData = () => {
        if (solutionState === 'done' && solutionData) {
            return <>
                <TextInput label="Solution ID (not editable)" value={solutionData._id} disabled/>
                <TextInput label="Owner E-mail (not editable)" value={solutionData.authorEmail} disabled/>
                <TextInput label="Name"
                           value={solutionData?.name}
                           placeholder="Solution Name (Must be > 4 characters)"
                           error={solutionData?.name.length < 4? 'Name must be at least 4 characters': null}
                           onChange={
                               (e) => {
                                   setSolutionData({...solutionData, name: e.currentTarget.value});
                               }
                           }/>
                <Textarea rows={10} label="Description (optional)" value={solutionData?.description}
                          placeholder="Solution Description"
                          onChange={(e) => {
                              setSolutionData({...solutionData, description: e.currentTarget.value});
                          }}/>
                <Button onClick={saveSolution}>Save</Button>
            </>
        } else {
            return <>Loading...</>
        }
    }
    return (<div>
        <h1>Solution Overview</h1>
        {overviewData()}
    </div>);
}