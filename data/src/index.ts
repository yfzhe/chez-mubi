import { DatabaseSync } from "node:sqlite";
import { z } from "zod";
import { FilmSchema, type Film } from "./schema.ts";
import migrate from "./migrate.ts";
import { sleep } from "./utils.ts";
import { COUNTRY_CODES, FILM_TYPE } from "./constant.ts";

const FilmsResponseSchema = z.object({
  films: z.array(FilmSchema),
  meta: z.object({
    current_page: z.number(),
    next_page: z.nullable(z.number()),
    previous_page: z.nullable(z.number()),
    total_pages: z.number(),
    total_count: z.number(),
    per_page: z.number(),
  }),
});

async function loadFilms(
  country: string,
  page: number,
): Promise<z.infer<typeof FilmsResponseSchema>> {
  const url = new URL("https://api.mubi.com/v4/browse/films");

  url.searchParams.set("sort", "popularity_quality_score");
  url.searchParams.set("playable", "true");
  url.searchParams.set("page", `${page}`);

  const resp = await fetch(url, {
    headers: {
      // force english for title, synopsis, editorial, etc.
      "Accept-Language": "en-US",
      Client: "web",
      "Client-Country": country,
      "Content-Type": "application/json",
    },
  });

  const result = await resp.json();
  FilmsResponseSchema.parse(result);

  return result;
}

function upsertFilm(db: DatabaseSync, film: Film) {
  db.prepare(
    `INSERT INTO films (
      id, slug, title, original_title, directors, year, duration,
      synopsis, editorial, still_url, trailer_url, average_colour_hex,
      average_rating, number_of_ratings, popularity
    ) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12, ?13, ?14, ?15)
    ON CONFLICT(id) DO UPDATE SET
        average_rating=excluded.average_rating,
        number_of_ratings=excluded.number_of_ratings,
        popularity=excluded.popularity;
    `,
  ).run(
    film.id,
    film.slug,
    film.title,
    film.original_title,
    film.directors.map((d) => d.name).join(", "),
    film.year,
    film.duration,
    film.short_synopsis,
    film.default_editorial,
    film.still_url,
    film.trailer_url,
    film.average_colour_hex,
    film.average_rating_out_of_ten,
    film.number_of_ratings,
    film.popularity,
  );
}

// on tv series:
// the mubi api endpoint `/films` also returns episodes of tv series as `Film`
// objects (see `{Episode, Series, Season}Schema` in schema.ts).
// observed that only one episode per series appears in the response.
// therefore, store series data to the `films` table by the following strategy:
// - `film.id` is taken from `episode_as_film.id`,
// - `film.slug` from `episode_as_film.series.slug` (to construct "web_url"),
// - `film_consumable` from `episode_as_film` (as the availability data on the
//     series lacks the precise available_at and expires_at times).

function upsertEpisodeFilm(db: DatabaseSync, film: Film) {
  const series = film.series!;
  const stillUrl =
    series.artworks.find((a) => a.format === "tile_artwork")?.image_url ?? null;
  const trailerUrl = series.seasons[0]?.trailer_url ?? null;

  db.prepare(
    `INSERT INTO films (
      id, slug, title, original_title, directors, year, duration,
      synopsis, editorial, still_url, trailer_url, average_colour_hex,
      average_rating, number_of_ratings, popularity,
      type
    ) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12, ?13, ?14, ?15, ?16)
    ON CONFLICT(id) DO UPDATE SET
      average_rating=excluded.average_rating,
      number_of_ratings=excluded.number_of_ratings,
      popularity=excluded.popularity;
    `,
  ).run(
    film.id,
    series.slug,
    series.title,
    series.original_title,
    film.directors.map((d) => d.name).join(", "),
    film.year,
    0, // cannot access the total duration of all episodes of the series
    film.short_synopsis,
    film.default_editorial,
    stillUrl,
    trailerUrl,
    film.average_colour_hex,
    series.average_rating_out_of_ten,
    series.number_of_ratings,
    film.popularity,
    FILM_TYPE.series,
  );
}

function upsertFilmConsumable(
  db: DatabaseSync,
  film: Film,
  countryCode: string,
) {
  if (!film.consumable) {
    return;
  }

  db.prepare(
    `INSERT INTO film_consumables (
      film_id, country_code, available_at, expires_at
    ) VALUES (?1, ?2, ?3, ?4)
    ON CONFLICT(film_id, country_code) DO UPDATE SET
      available_at=excluded.available_at,
      expires_at=excluded.expires_at;
    `,
  ).run(
    film.id,
    countryCode,
    film.consumable.available_at,
    film.consumable.expires_at,
  );
}

// --------------- MAIN ---------------
const db = new DatabaseSync("data.db");
migrate(db);

for (const countryCode of COUNTRY_CODES) {
  console.log(`fetching films availables in ${countryCode}...`);

  let page: number | null = 1;
  do {
    const result = await loadFilms(countryCode, page);
    for (const film of result.films) {
      if (film.episode) {
        upsertEpisodeFilm(db, film);
        upsertFilmConsumable(db, film, countryCode);
      } else {
        upsertFilm(db, film);
        upsertFilmConsumable(db, film, countryCode);
      }
    }
    page = result.meta.next_page;
    await sleep(600);
  } while (page);
}

const currentTimestamp = new Date().toISOString();
db.prepare(
  `INSERT INTO metadata (id, updated_at) VALUES (1, ?)
   ON CONFLICT(id) DO UPDATE SET updated_at = excluded.updated_at;`,
).run(currentTimestamp);

console.log("done.");
