// a naive implementation of database migration:
// - migration files are based on SQL,
// - are indexed by incremental numbers,
// - and located in the hardcoded `/migrations` directory.
// - does not support the "down" operation.
// - no cli, just exposes a `migrate` function.

import fs from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";
import { takef } from "./utils.ts";

const MIGRATIONS_DIR = path.join(import.meta.dirname, "../migrations");

interface Migration {
  id: number;
  filename: string;
  up: string;
}

function getMigrations(): Migration[] {
  if (!fs.existsSync(MIGRATIONS_DIR)) {
    throw new Error("directory /migrations does not exist");
  }

  return fs
    .readdirSync(MIGRATIONS_DIR)
    .map((file) => /^(\d+)-(.+?)\.sql$/.exec(file))
    .filter((match): match is RegExpExecArray => match !== null)
    .map((match) => {
      const [filename, number] = match;
      return {
        id: parseInt(number!, 10),
        filename,
        up: fs.readFileSync(path.join(MIGRATIONS_DIR, filename), {
          encoding: "utf8",
        }),
      };
    })
    .sort((a, b) => a.id - b.id);
}

function migrate(db: DatabaseSync) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS _migrations (
      id INTEGER NOT NULL
    );
  `);

  const getLatestId = db.prepare("SELECT id FROM _migrations");
  const latestId = (getLatestId.get()?.id || 0) as number;

  const allMigrations = getMigrations();
  const newMigrations = takef(
    allMigrations,
    (migration) => migration.id > latestId,
  );

  if (newMigrations.length === 0) {
    return;
  }

  console.log("find new migration(s), executing...");

  const clearMigrations = db.prepare(`DELETE FROM _migrations`);
  const insertMigrationId = db.prepare(
    `INSERT INTO _migrations (id) VALUES (?)`,
  );

  for (const migration of allMigrations) {
    const { id, filename, up } = migration;

    try {
      db.exec("BEGIN");
      db.exec(up);
      clearMigrations.run();
      insertMigrationId.run(id);
      db.exec("COMMIT");

      console.log(`finished migration: ${filename}`);
    } catch (err) {
      db.exec("ROLLBACK");
      console.log(`failed when executing migration: ${filename}`);
      throw err;
    }
  }
}

export default migrate;
