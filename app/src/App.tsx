import { Suspense, use } from "react";
import { Outlet } from "react-router";
import { initDatabase, DatabaseProvider } from "./database";

const initDatabasePromise = initDatabase();

const AppContent = () => {
  const database = use(initDatabasePromise);

  return (
    <DatabaseProvider value={database}>
      <Outlet />
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
