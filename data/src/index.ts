import { z } from "zod";

import { FilmSchema, type Film } from "./schema.ts";

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

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

async function loadFilmsOnce(
  country: string,
  page: number,
): Promise<z.infer<typeof FilmsResponseSchema>> {
  const url = new URL("https://api.mubi.com/v4/browse/films");

  url.searchParams.set("sort", "popularity_quality_score");
  url.searchParams.set("playable", "true");
  url.searchParams.set("page", `${page}`);

  const resp = await fetch(url, {
    headers: {
      Client: "web",
      "Client-Country": country,
      "Content-Type": "application/json",
    },
  });

  const result = await resp.json();
  FilmsResponseSchema.parse(result);

  return result;
}

const films: Film[] = [];

let page: number | null = 1;
while (page) {
  const result = await loadFilmsOnce("US", page);
  films.push(...result.films);
  page = result.meta.next_page;
  await sleep(1000);
}

console.log(films.map((film) => film.title));
