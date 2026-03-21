import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import App from "./App";
import Index from "./routes/Index";
import Film from "./routes/Film";
import Random from "./routes/Random";
import "normalize.css";

const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      {
        index: true,
        Component: Index,
      },
      {
        path: "films/:slug",
        Component: Film,
      },
      {
        path: "random",
        Component: Random,
      },
      {
        path: "query",
        lazy: async () => ({
          Component: (await import("./routes/Query")).default,
        }),
      },
    ],
  },
]);

const rootEl = document.getElementById("root");
if (rootEl) {
  const root = createRoot(rootEl);
  root.render(
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>,
  );
}
