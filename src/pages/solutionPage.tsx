import "@mantine/core/styles.css";
import {useParams} from "react-router-dom";
import SolutionTemplate from "../templates/SolutionTemplate.tsx";
import {SystemComponentList} from "../systemComponentList.tsx";
import React, {useState} from "react";
import {SystemComponent} from "../systemComponent.tsx";


export default function SolutionPage() {
    const params = useParams();

    const main = () => {
        if (params.componentId) {
            return <SystemComponent />
        } else {
            return <h1>Nothing Selected</h1>
        }
    }
    const navbar = <SystemComponentList />
    return (
        <SolutionTemplate navbar={navbar} main={main()}/>
    )
}
