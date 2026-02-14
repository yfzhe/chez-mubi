import { z } from "zod";

const ArtworkSchema = z.object({
  format: z.string(),
  locale: z.nullable(z.string()),
  image_url: z.url(),
  focal_point: z.object({
    x: z.number(),
    y: z.number(),
  }),
});

const OptimisedTrailerSchema = z.object({
  url: z.url(),
  profile: z.string(),
});

const EpisodeSchema = z.object({
  label: z.string(),
  number: z.number(),
  series_title: z.string(),
  season_number: z.number(),
  season_title: z.string(),
  fotd_show_episode: z.boolean(),
  episode_label_color: z.nullable(z.string()),
  film_group_id: z.nullable(z.any()),
  film_group_slug: z.nullable(z.any()),
  episode_title: z.string(),
  series_id: z.number(),
  season_id: z.number(),
  episode_label: z.string(),
  episode_season_label: z.string(),
  artworks: z.optional(z.array(ArtworkSchema)),
});

const SeasonSchema = z.object({
  id: z.number(),
  slug: z.string(),
  web_url: z.url(),
  title: z.string(),
  original_title: z.string(),
  season_number: z.number(),
  release_year: z.number(),
  trailer_url: z.nullable(z.url()),
  trailer_id: z.nullable(z.number()),
  optimised_trailers: z.nullable(z.array(OptimisedTrailerSchema)),
  episode_count: z.number(),
  short_synopsis: z.string(),
  default_editorial: z.string(),
});

const SeriesSchema = z.object({
  id: z.number(),
  slug: z.string(),
  web_url: z.url(),
  title: z.string(),
  original_title: z.string(),
  episode_count: z.number(),
  season_count: z.number(),
  limited: z.boolean(),
  genres: z.array(z.string()),
  average_rating_out_of_ten: z.nullable(z.number()),
  number_of_ratings: z.nullable(z.number()),
  rating_comments_count: z.nullable(z.number()),
  info_label: z.string(),
  availability: z.string(),
  availability_message: z.object({
    detail: z.nullable(z.union([z.string(), z.array(z.any())])),
    tile: z.nullable(
      z.object({
        type: z.string(),
        text: z.string(),
      }),
    ),
  }),
  short_synopsis: z.string(),
  default_editorial: z.string(),
  seasons: z.array(SeasonSchema),
  artworks: z.array(ArtworkSchema),
});

const ConsumableSchema = z.object({
  film_id: z.number(),
  available_at: z.nullable(z.iso.datetime()),
  expires_at: z.nullable(z.iso.datetime()),
  exclusive: z.boolean(),
  permit_download: z.boolean(),
  playback_languages: z.nullable(
    z.object({
      audio_options: z.array(z.string()),
      subtitle_options: z.array(z.string()),
      media_options: z.object({
        duration: z.number(),
        hd: z.boolean(),
      }),
      media_features: z.array(z.string()),
      extended_audio_options: z.array(z.string()),
    }),
  ),
});

const StillsSchema = {
  small: z.url(), // 256
  medium: z.url(), // 448
  small_overlaid: z.url(), // 512
  standard: z.url(), // 856
  standard_push: z.url(), // 856
  retina: z.url(), // 1280
  large_overlaid: z.url(),
};

const DirectorSchema = z.object({
  name: z.string(),
  slug: z.string(),
});

export const FilmSchema = z.object({
  id: z.number(),
  slug: z.string(),
  web_url: z.url(),
  title_locale: z.string(),
  original_title: z.string(),
  title: z.string(),
  title_treatment_url: z.nullable(z.string()),
  directors: z.array(DirectorSchema),
  year: z.number(),
  duration: z.number(), // in minutes
  consumable: z.nullable(ConsumableSchema),
  historic_countries: z.array(z.string()),
  short_synopsis: z.string(),
  default_editorial: z.nullable(z.string()),
  still_url: z.url(),
  stills: z.object(StillsSchema),
  average_colour_hex: z.string(),
  genres: z.array(z.string()),
  popularity: z.number(),
  average_rating_out_of_ten: z.nullable(z.number()), // 1 decimal place
  number_of_ratings: z.nullable(z.number()),
  mubi_release: z.boolean(),
  trailer_id: z.nullable(z.number()),
  trailer_url: z.nullable(z.url()),
  optimised_trailers: z.nullable(z.array(OptimisedTrailerSchema)),
  artworks: z.array(ArtworkSchema),
  series: z.nullable(SeriesSchema),
  episode: z.nullable(EpisodeSchema),
});

export type Film = z.infer<typeof FilmSchema>;
export type Director = z.infer<typeof DirectorSchema>;
