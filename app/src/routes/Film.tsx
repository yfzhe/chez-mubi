import { useMemo } from "react";
import { useParams } from "react-router";
import type { SqlValue } from "@sqlite.org/sqlite-wasm";
import { useDatabase } from "../database";
import type { FilmConsumable, FilmDetail } from "../types";
import "./Film.css";

const toFilm = (
  row: SqlValue[],
  consumables: FilmConsumable[],
): FilmDetail => ({
  id: Number(row[0]),
  slug: String(row[1]),
  title: String(row[2]),
  originalTitle: String(row[3]),
  directors: String(row[4]),
  year: Number(row[5]),
  duration: Number(row[6]),
  synopsis: String(row[7]),
  editorial: row[8] === null ? null : String(row[8]),
  stillUrl: String(row[9]),
  averageColourHex: String(row[10]),
  averageRating: row[11] === null ? null : Number(row[11]),
  numberOfRatings: row[12] === null ? null : Number(row[12]),
  consumables,
});

const toConsumable = (row: SqlValue[]): FilmConsumable => ({
  countryCode: String(row[0]),
  availableAt: row[1] === null ? null : String(row[1]),
  expiresAt: row[2] === null ? null : String(row[2]),
});

const Film = () => {
  const db = useDatabase();
  const { slug } = useParams();

  const film = useMemo(() => {
    if (!slug) {
      return null;
    }

    const filmRows = db.exec({
      sql: `
        SELECT id, slug, title, original_title, directors, year, duration, synopsis, editorial,
          still_url, average_colour_hex, average_rating, number_of_ratings
        FROM films
        WHERE slug = ?
        LIMIT 1
      `,
      bind: [slug],
      rowMode: "array",
      returnValue: "resultRows",
    });

    const filmRow = filmRows[0];
    if (!filmRow) {
      return null;
    }

    const consumableRows = db.exec({
      sql: `
        SELECT country_code, available_at, expires_at
        FROM film_consumables
        WHERE film_id = ?
        ORDER BY country_code
      `,
      bind: [Number(filmRow[0])],
      rowMode: "array",
      returnValue: "resultRows",
    });

    return toFilm(filmRow, consumableRows.map(toConsumable));
  }, [db, slug]);

  if (!film) {
    return (
      <main className="film-page film-page-empty">
        <h1>Film not found</h1>
      </main>
    );
  }

  return (
    <main className="film-page">
      <section
        className="film-still"
        style={{ backgroundColor: film.averageColourHex }}
      >
        <img
          src={film.stillUrl}
          alt={`Still from ${film.title}`}
          className="film-still-image"
        />
        <div className="film-still-overlay">
          <h1>{film.title}</h1>
          {film.originalTitle !== film.title && (
            <p className="film-original-title">{film.originalTitle}</p>
          )}
        </div>
      </section>

      <section className="film-content" aria-label={`${film.title} details`}>
        <div className="film-primary">
          <section className="film-text-section">
            <h2>Synopsis</h2>
            <p>{film.synopsis}</p>
          </section>
          {film.editorial && (
            <section className="film-text-section">
              <h2>Mubi's Editorial</h2>
              <p>{film.editorial}</p>
            </section>
          )}
          {film.consumables.length > 0 && (
            <section className="film-availability">
              <h2>Available In</h2>
              <ul>
                {film.consumables.map((consumable) => (
                  <li key={consumable.countryCode}>{consumable.countryCode}</li>
                ))}
              </ul>
            </section>
          )}
        </div>

        <aside className="film-metadata" aria-label="Film metadata">
          <dl>
            <div>
              <dt>Director</dt>
              <dd>{film.directors}</dd>
            </div>
            <div>
              <dt>Year</dt>
              <dd>{film.year}</dd>
            </div>
            <div>
              <dt>Duration</dt>
              <dd>{film.duration} min</dd>
            </div>
            {film.averageRating !== null && (
              <div>
                <dt>Rating</dt>
                <dd>
                  {film.averageRating.toFixed(1)}
                  {film.numberOfRatings !== null && (
                    <span> ({film.numberOfRatings})</span>
                  )}
                </dd>
              </div>
            )}
          </dl>
        </aside>
      </section>
    </main>
  );
};

export default Film;
