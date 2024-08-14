import {SystemComponent} from "./systemComponent.tsx";
import React from "react";

export default function MainView({selectedComponent, setSelectedComponent}) {
    if (selectedComponent) {
        return <SystemComponent selectedComponent={selectedComponent}
                                setSelectedComponent={setSelectedComponent}/>
    } else {
        return <h1>Nothing Selected</h1>
    }
}