// a naive implementation of database migration:
// - migration files are based on SQL,
// - are indexed by incremental numbers,
// - and located in the hardcoded `/migrations` directory.
// - does not support the "down" operation.
// - no cli, just exposes a `migrate` function.

import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
import { DatabaseSync } from "node:sqlite";

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
      id INTEGER NOT NULL PRIMARY KEY,
      checksum TEXT NOT NULL
    );
  `);

  const allMigrations = getMigrations();

  const appliedMigrations = db
    .prepare("SELECT id, checksum FROM _migrations ORDER BY id")
    .all() as { id: number; checksum: string }[];

  const insertMigration = db.prepare(
    "INSERT INTO _migrations (id, checksum) VALUES (?, ?)",
  );

  for (const migration of allMigrations) {
    const { id, filename, up } = migration;
    const checksum = createHash("sha256").update(up).digest("hex");

    const isApplied = appliedMigrations.find((m) => m.id === id);
    if (isApplied) {
      if (isApplied.checksum !== checksum) {
        throw new Error(`checksum mismatch for migration ${filename}`);
      }
    } else {
      try {
        db.exec("BEGIN");
        db.exec(up);
        insertMigration.run(id, checksum);
        db.exec("COMMIT");

        console.log(`finished migration: ${filename}`);
      } catch (err) {
        db.exec("ROLLBACK");
        console.log(`failed when executing migration: ${filename}`);
        throw err;
      }
    }
  }
}

export default migrate;
