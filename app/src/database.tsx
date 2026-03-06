/* eslint-disable react-refresh/only-export-components */
// what the hell is the best practice for the context-provider pattern with react refresh.
// splitting files is inconvenient and difficult to control exports.

import { createContext, useContext, type ReactNode } from "react";
import sqlite3InitModule, { type Database } from "@sqlite.org/sqlite-wasm";

// TODO: improve database file url
// TODO: display errors when initializing database
// TODO: consider sqlite-wasm worker api

const DB_URL = new URL("../../data/data.sqlite", import.meta.url);

export const initDatabase = async (): Promise<Database> => {
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

const DatabaseContext = createContext<Database | null>(null);

interface DatabaseProviderProps {
  children: ReactNode;
  value: Database;
}

export const DatabaseProvider = ({
  children,
  value,
}: DatabaseProviderProps) => {
  return (
    <DatabaseContext.Provider value={value}>
      {children}
    </DatabaseContext.Provider>
  );
};

export const useDatabase = (): Database => {
  const context = useContext(DatabaseContext);
  if (!context) {
    throw new Error("the value of DatabaseContext is null");
  }
  return context;
};
