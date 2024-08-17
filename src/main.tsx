import "@mantine/core/styles.css";
import "./global.css";
import React, {lazy, Suspense} from "react";

import ReactDOM from "react-dom/client";

import {Provider} from "use-pouchdb";
import {data} from "./data.ts";
import {createBrowserRouter, RouterProvider,} from "react-router-dom";
import AdminPage from "./pages/adminPage.tsx";
import HomePage from "./pages/homePage.tsx";
import Demopage from "./pages/demopage.tsx";
import {Auth0Provider}  from "@auth0/auth0-react";

import PricingPage from "./pages/pricingPage.tsx";
import FeaturesPage from "./pages/featuresPage.tsx";
const SolutionPage = lazy(() => import('./pages/solutionPage.tsx'));
const ComponentPage = lazy( () => import('./pages/componentPage.tsx'));
const DiagramPage = lazy(() => import('./pages/diagramPage.tsx'));

const [components, connections] = data();
const router = createBrowserRouter([
    {
        path: "/",
        element: (<HomePage/>),
    },
    {
        path: "/solution/:solutionId",
        element: (<Suspense fallback={<div>Loading</div>}>
            <SolutionPage/>
        </Suspense>),
    },
    { path: "/solutions", element: (<Suspense fallback={<div>Loading</div>}>
            <SolutionPage/>
        </Suspense>) },

    {
        path: "/solution/:solutionId/component/:componentId",
        element: (<Suspense fallback={<div>Loading</div>}>
            <ComponentPage/>
        </Suspense>),
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
    { path: "/features",
    element: <FeaturesPage/>},
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
                <RouterProvider router={router}>
                </RouterProvider>
            </Auth0Provider>
        </Provider>
    </React.StrictMode>
);
