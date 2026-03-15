import { Suspense, use } from "react";
import { Outlet, ScrollRestoration } from "react-router";
import { initDatabase, DatabaseProvider } from "./database";
import "./App.css";

const initDatabasePromise = initDatabase();

const AppContent = () => {
  const database = use(initDatabasePromise);

  return (
    <DatabaseProvider value={database}>
      <Outlet />
      <ScrollRestoration />
    </DatabaseProvider>
  );
};

const App = () => {
  return (
    <Suspense fallback={<div>Initializing database...</div>}>
      <AppContent />
    </Suspense>
  );
};

export default App;
