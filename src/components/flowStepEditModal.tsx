import {SolutionFlowStep} from "../types/solutionFlowStep.ts";
import {Modal} from "@mantine/core";
import {useEffect, useState} from "react";
import {TemplateComponent} from "../types/templateComponent.ts";

export function FlowStepEditModal(props: {flowStep: SolutionFlowStep})  {
    const [currentFlowstep, setCurrentFlowstep] = useState({} as SolutionFlowStep);
    useEffect(() => {
        setCurrentFlowstep(props.flowStep);
    }, [props.flowStep]);
    if (currentFlowstep == null) {
        return <></>
    }
    const closed = () => {

    }
    return (
        <Modal opened={true} onClose={closed}>
            <h1>FlowStepEditModal</h1>
            {JSON.stringify(currentFlowstep)}
        </Modal>
    )
}