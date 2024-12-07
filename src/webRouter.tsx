import {createBrowserRouter} from "react-router-dom";
import { lazy } from "react";
import HomePage from "./pages/homePage.tsx";
import React, {Suspense} from "react";
import {SolutionList} from "./solutions/solutionList.tsx";
import AdminPage from "./pages/adminPage.tsx";
import Demopage from "./pages/demopage.tsx";
import FeaturesPage from "./pages/featuresPage.tsx";

import SolutionDiagramPopoutPage from "./solutions/solutionDiagramPopoutPage.tsx";
const ComponentsPage = lazy(() => import("./pages/componentsPage.tsx"));
import {SolutionComponent} from "./solutionComponents/solutionComponent.tsx";
const SolutionPage = lazy(() => import("./solutions/solutionPage.tsx"));
export const webRouter = createBrowserRouter([
    {
        path: "/",
        element: (<HomePage/>),
    },
    {
        path: "/solution/:solutionId/:tab?/:componentId?",
        element: (<Suspense fallback={<div>Loading</div>}>
            <SolutionPage/>
        </Suspense>),
    },
    {
        path: "/components", element: (<Suspense fallback={<div>Loading</div>}>
            <ComponentsPage/>
        </Suspense>)

    },
    {
        path: "/solutions", element: (<Suspense fallback={<div>Loading</div>}>
            <SolutionList/>
        </Suspense>)
    },

    {
        path: "/component/:componentId",
        element: (<Suspense fallback={<div>Loading</div>}>
            <SolutionComponent/>
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
    {
        path: "/features",
        element: <FeaturesPage/>
    }
]);