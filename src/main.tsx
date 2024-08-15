import "@mantine/core/styles.css";
import "./global.css";
import React from "react";
import ReactDOM from "react-dom/client";
import ComponentPage from "./pages/componentPage.tsx";
import {Provider} from "use-pouchdb";
import {data} from "./data.ts";
import {createBrowserRouter, RouterProvider,} from "react-router-dom";
import AdminPage from "./pages/adminPage.tsx";
import HomePage from "./pages/homePage.tsx";
import Demopage from "./pages/demopage.tsx";
import {Auth0Provider}  from "@auth0/auth0-react";
import DiagramPage from "./pages/diagramPage.tsx";
import SolutionPage from "./pages/solutionPage.tsx";
import PricingPage from "./pages/pricingPage.tsx";


const [components, connections] = data();
const router = createBrowserRouter([
    {
        path: "/",
        element: (<HomePage/>),
    },
    {
        path: "/solution/:solutionId",
        element: (<SolutionPage/>),
    },
    { path: "/solutions", element: (<SolutionPage/>) },

    {
        path: "/solution/:solutionId/component/:componentId",
        element: (<ComponentPage/>),
    },
    {
        path: "/solution/:solutionId/components",
        element: (<ComponentPage/>),
    },
    {
        path: "/solution/:solutionId/diagram",
        element: (<DiagramPage/>)
    },
    {
        path: "/admin",
        element: (<AdminPage/>),
    },
    {
        path: "/demo",
        element: <Demopage/>,
    },
    {path: "/pricing",
     element: <PricingPage/>}
]);
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <Provider
            default="components"
            databases={{
                components: components,
                connections: connections

            }}>
            <Auth0Provider
                domain="dev-g0lt18ndbcp6earr.us.auth0.com"
                clientId="sxAJub9Uo2mOE7iYCTOuQGhppGLEPWzb"
                authorizationParams={{
                    redirect_uri: window.location.origin
                }}>
                <RouterProvider router={router}/>
            </Auth0Provider>


        </Provider>
    </React.StrictMode>
);
