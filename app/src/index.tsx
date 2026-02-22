import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { DatabaseProvider } from "./database";

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
