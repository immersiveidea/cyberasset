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



const [components, connections] = data();
const router = createBrowserRouter([
    {
        path: "/",
        element: (<HomePage/>),
    },
    {
        path: "/demo",
        element: (<InventoryPage/>),
    },
    {
        path: "/admin",
        element: (<AdminPage/>),
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
