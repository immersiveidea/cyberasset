import "@mantine/core/styles.css";
import "./global.css";
import React from "react";
import ReactDOM from "react-dom/client";
import InventoryPage from "./pages/inventoryPage.tsx";
import {Provider} from "use-pouchdb";
import {data} from "./data.ts";
import {createBrowserRouter, RouterProvider,} from "react-router-dom";
import AdminPage from "./pages/adminPage.tsx";
import HomePage from "./pages/homePage.tsx";
import Demopage from "./pages/demopage.tsx";
import OverviewDiagram from "./overviewDiagram.tsx";
import DiagramPage from "./pages/diagramPage.tsx";


const [components, connections] = data();
const router = createBrowserRouter([
    {
        path: "/",
        element: (<HomePage/>),
    },
    {
        path: "/inventory",
        element: (<InventoryPage/>),
    },
    {
        path: "/diagram",
        element: (<DiagramPage/>)
    },
    {
        path: "/admin",
        element: (<AdminPage/>),
    },
    {
        path: "/demo",
        element: <Demopage/>,
    }
]);
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <Provider
            default="components"
            databases={{
                components: components,
                connections: connections

            }}>
            <RouterProvider router={router}/>
        </Provider>
    </React.StrictMode>
);
