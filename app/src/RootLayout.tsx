import { Suspense, use } from "react";
import { Outlet, ScrollRestoration } from "react-router";
import { initDatabase, DatabaseProvider } from "./database";
import "./RootLayout.css";

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

const RootLayout = () => {
  return (
    <Suspense fallback={<div>Initializing database...</div>}>
      <AppContent />
    </Suspense>
  );
};

export default RootLayout;
