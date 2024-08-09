import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import {Provider} from "use-pouchdb";
import {data} from "./data.ts";
import {
    createBrowserRouter,
    RouterProvider,
    Route,
    Link,
} from "react-router-dom";
import AdminApp from "./adminApp.tsx";

const [components, connections] = data();
const router = createBrowserRouter([
    {
        path: "/",
        element: (
            <Provider
                default="components"
                databases={{
                    components: components,
                    connections: connections

                }}>
                <App/>
            </Provider>
        ),
    },
    {
        path: "/admin",
        element: (
            <Provider
                default="components"
                databases={{
                    components: components,
                    connections: connections
                }}>
                <AdminApp/>
            </Provider>
        ),
    }
]);
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <RouterProvider router={router}/>
    </React.StrictMode>
);
