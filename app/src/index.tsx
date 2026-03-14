import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import App from "./App";
import "normalize.css";

const router = createBrowserRouter([
  {
    element: <App />,
    children: [
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
