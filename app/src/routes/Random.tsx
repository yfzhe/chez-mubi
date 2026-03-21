import { useMemo } from "react";
import { Navigate } from "react-router";
import type { SqlValue } from "@sqlite.org/sqlite-wasm";
import { useDatabase } from "../database";

const toSlug = (row: SqlValue[]): string => String(row[0]);

const Random = () => {
  const db = useDatabase();

  const slug = useMemo(() => {
    const rows = db.exec({
      sql: `
        SELECT f.slug
        FROM films f
        WHERE EXISTS (
          SELECT 1
          FROM film_consumables fc
          WHERE fc.film_id = f.id
            AND (fc.available_at IS NULL OR fc.available_at <= strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
            AND (fc.expires_at IS NULL OR fc.expires_at > strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
        )
        ORDER BY random()
        LIMIT 1
      `,
      rowMode: "array",
      returnValue: "resultRows",
    });

    const row = rows[0];
    return row ? toSlug(row) : null;
  }, [db]);

  if (!slug) {
    return (
      <main>
        <h1>No available films found</h1>
      </main>
    );
  }

  return <Navigate to={`/films/${slug}`} replace />;
};

export default Random;
