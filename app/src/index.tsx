import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import App from "./App";

const router = createBrowserRouter([
  {
    element: <App />,
    children: [],
  },
]);

const rootEl = document.getElementById("root");
if (rootEl) {
  const root = createRoot(rootEl);
  root.render(
    <StrictMode>
      <DatabaseProvider>
        <App />
      </DatabaseProvider>
    </StrictMode>,
  );
}
