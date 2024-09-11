import {createBrowserRouter} from "react-router-dom";
import HomePage from "./pages/homePage.tsx";
import React, {Suspense} from "react";
import {SolutionList} from "./solutionList.tsx";
import AdminPage from "./pages/adminPage.tsx";
import Demopage from "./pages/demopage.tsx";
import FeaturesPage from "./pages/featuresPage.tsx";
import PricingPage from "./pages/pricingPage.tsx";
import SolutionPage from "./pages/solutionPage.tsx";
import DiagramPage from "./pages/diagramPage.tsx";

export const webRouter = createBrowserRouter([
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
            <SolutionList/>
            </Suspense>) },

    {
        path: "/solution/:solutionId/component/:componentId",
        element: (<Suspense fallback={<div>Loading</div>}>
            <SolutionPage/>
            </Suspense>),
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