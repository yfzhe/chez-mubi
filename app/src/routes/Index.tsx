import { useMemo } from "react";
import type { SqlValue } from "@sqlite.org/sqlite-wasm";
import { useDatabase } from "../database";
import type { FilmSimple } from "../types";
import FilmCard from "../components/FilmCard";
import "./Index.css";

const toFilm = (row: SqlValue[]): FilmSimple => ({
  id: Number(row[0]),
  slug: String(row[1]),
  title: String(row[2]),
  originalTitle: String(row[3]),
  directors: String(row[4]),
  year: Number(row[5]),
  duration: Number(row[6]),
  stillUrl: String(row[7]),
  averageRating: row[8] === null ? null : Number(row[8]),
  numberOfRatings: row[9] === null ? null : Number(row[9]),
});

const Index = () => {
  const db = useDatabase();

  const films = useMemo(() => {
    const rows = db.exec({
      sql: `
        SELECT id, slug, title, original_title, directors, year, duration, still_url, average_rating, number_of_ratings
        FROM films
        ORDER BY id DESC
        LIMIT 12
      `,
      rowMode: "array",
      returnValue: "resultRows",
    });

    return rows.map(toFilm);
  }, [db]);

  return (
    <div className="index-page">
      <header>
        <h1>Chez Mubi</h1>
      </header>
      <main>
        <section className="index-films" aria-label="Films">
          {films.map((film) => (
            <FilmCard key={film.id} film={film} />
          ))}
        </section>
      </main>
    </div>
  );
};

export default Index;
