import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import sqlite3InitModule, { type Database } from "@sqlite.org/sqlite-wasm";

// TODO: improve database file url
// TODO: add error toast when initializing database
// TODO: consider sqlite-wasm worker api

const DB_URL = new URL("../../data/data.sqlite", import.meta.url);

const initDatabase = async (): Promise<Database> => {
  const resp = await fetch(DB_URL);
  if (!resp.ok) {
    throw new Error(`failed to fetch database: ${resp.status}`);
  }
  const arrayBuffer = await resp.arrayBuffer();

  const sqlite3 = await sqlite3InitModule();
  const filePtr = sqlite3.wasm.allocFromTypedArray(arrayBuffer);
  const db = new sqlite3.oo1.DB();
  const rc = sqlite3.capi.sqlite3_deserialize(
    db.pointer!,
    "main",
    filePtr,
    arrayBuffer.byteLength,
    arrayBuffer.byteLength,
    sqlite3.capi.SQLITE_DESERIALIZE_FREEONCLOSE |
      sqlite3.capi.SQLITE_DESERIALIZE_READONLY,
  );
  db.checkRc(rc);

  return db;
};

export type DatabaseState =
  | { status: "success"; db: Database }
  | { status: "initial" | "loading" | "error"; db: null };

const DatabaseContext = createContext<DatabaseState>({
  status: "initial",
  db: null,
});

interface DatabaseProviderProps {
  children: ReactNode;
}

export const DatabaseProvider = ({ children }: DatabaseProviderProps) => {
  const [state, setState] = useState<DatabaseState>({
    status: "loading",
    db: null,
  });

  useEffect(() => {
    let db: Database | null = null;

    initDatabase()
      .then((_db) => {
        db = _db;
        setState({ status: "success", db: _db });
      })
      .catch(() => {
        setState({ status: "error", db: null });
      });

    return () => {
      db?.close();
    };
  }, []);

  return (
    <DatabaseContext.Provider value={state}>
      {children}
    </DatabaseContext.Provider>
  );
};

// what the hell is the best practice for the context-provider pattern with react refresh.
// splitting files is inconvenient and difficult to control exports.
// eslint-disable-next-line react-refresh/only-export-components
export const useDatabase = (): DatabaseState => {
  return useContext(DatabaseContext);
};
