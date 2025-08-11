import { lazy } from "react";

const SplitLanding = lazy(() => import("../components/SplitLanding") );
const DeveloperHub = lazy(() => import("../dev/DeveloperHub") );
const CaseStudyPage = lazy(() => import("../dev/CaseStudyPage") );
const ViolinistHub = lazy(() => import("../music/ViolinistHub"));
const PerformancePage = lazy(() => import("../music/PerformancePage"));

export const routes = [
    { path: "/", element: <SplitLanding /> },
    { path: "/developer", element: <DeveloperHub /> },
    { path: "developer/case/:slug", element: <CaseStudyPage /> },
    { path: "/violinist", element: <ViolinistHub /> },
    { path: "/violinist/performance/:id", element: <PerformancePage /> },
];
