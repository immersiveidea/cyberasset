import {createBrowserRouter} from "react-router-dom";
import HomePage from "./pages/homePage.tsx";
import React, {Suspense} from "react";
import {SolutionList} from "./solutions/solutionList.tsx";
import AdminPage from "./pages/adminPage.tsx";
import Demopage from "./pages/demopage.tsx";
import FeaturesPage from "./pages/featuresPage.tsx";
import PricingPage from "./pages/pricingPage.tsx";
import SolutionPage from "./solutions/solutionPage.tsx";
import SolutionDiagramPopoutPage from "./solutions/solutionDiagramPopoutPage.tsx";
import ComponentsPage from "./pages/componentsPage.tsx";

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
    {
        path: "/solution/:solutionId/:tab",
        element: (<Suspense fallback={<div>Loading</div>}>
            <SolutionPage/>
        </Suspense>),
    },
    {   path: "/components", element: (<Suspense fallback={<div>Loading</div>}>
            <ComponentsPage/>
        </Suspense>)

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
        element: (<SolutionDiagramPopoutPage/>)
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