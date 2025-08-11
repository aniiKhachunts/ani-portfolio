import { Suspense } from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import { routes } from "./app/routes";
import App from "./App";

const router = createBrowserRouter([{ path:"/", element:<App/>, children: routes }]);

ReactDOM.createRoot(document.getElementById("root")!).render(
    <Suspense fallback={null}>
        <RouterProvider router={router} />
    </Suspense>
);
