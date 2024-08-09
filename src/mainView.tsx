import {SystemComponent} from "./systemComponent.tsx";
import React from "react";

export enum States {
    main,
    addingComponent
}

export default function MainView(data) {
    if (data.selectedComponent) {
        return <SystemComponent selectedComponent={data.selectedComponent}
                                setSelectedComponent={data.setSelectedComponent}/>
    } else {
        return <h1>Nothing Selected</h1>
    }
}