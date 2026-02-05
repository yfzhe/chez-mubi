import { z } from "zod";

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
});

const OptimisedTrailerSchema = z.object({
  url: z.string().url(),
  profile: z.string(),
});

const ArtworkSchema = z.object({
  format: z.string(),
  locale: z.nullable(z.string()),
  image_url: z.string().url(),
  focal_point: z.object({
    x: z.number(),
    y: z.number(),
  }),
});

const SeasonSchema = z.object({
  id: z.number(),
  title_upcase: z.string(),
  original_title: z.string(),
  season_number: z.number(),
  release_year: z.number(),
  slug: z.string(),
  web_url: z.string().url(),
  trailer_url: z.nullable(z.string().url()),
  trailer_id: z.nullable(z.number()),
  critic_review_rating: z.number(),
  short_synopsis: z.string(),
  short_synopsis_html: z.string(),
  episode_count: z.number(),
  title: z.string(),
  industry_events_count: z.number(),
  cast_members_count: z.number(),
  default_editorial: z.string(),
  default_editorial_html: z.string(),
  optimised_trailers: z.nullable(z.array(OptimisedTrailerSchema)),
  artworks: z.array(ArtworkSchema),
});

const SeriesSchema = z.object({
  id: z.number(),
  title: z.string(),
  slug: z.string(),
  episode_count: z.number(),
  season_count: z.number(),
  web_url: z.string().url(),
  title_upcase: z.string(),
  original_title: z.string(),
  limited: z.boolean(),
  rating_comments_count: z.number(),
  content_rating: z.object({
    label: z.string(),
    rating_code: z.string(),
    description: z.string(),
    icon_url: z.nullable(z.string().url()),
    label_hex_color: z.string(),
  }),
  genres: z.array(z.string()),
  average_rating: z.number(),
  average_rating_out_of_ten: z.number(),
  number_of_ratings: z.number(),
  info_label: z.string(),
  availability: z.string(),
  availability_message: z.object({
    detail: z.nullable(z.string()),
    tile: z.nullable(
      z.object({
        type: z.string(),
        text: z.string(),
      }),
    ),
  }),
  short_synopsis: z.string(),
  short_synopsis_html: z.string(),
  default_editorial: z.string(),
  default_editorial_html: z.string(),
  seasons: z.array(SeasonSchema),
  artworks: z.array(ArtworkSchema),
  content_warnings: z.optional(
    z.array(z.object({ id: z.number(), name: z.string(), key: z.string() })),
  ),
});

const ConsumableSchema = z.object({
  film_id: z.number(),
  available_at: z.string(), // Consider z.string().datetime() if format is ISO 8601
  availability: z.string(),
  availability_ends_at: z.nullable(z.string()),
  expires_at: z.nullable(z.string()),
  film_date_message: z.nullable(
    z.object({
      detail: z.array(z.object({ type: z.string(), text: z.string() })),
      tile: z.object({ type: z.string(), text: z.string() }),
    }),
  ),
  offered: z.array(
    z.object({
      type: z.string(),
      download_availability: z.nullable(z.any()),
    }),
  ),
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

const HighlightedIndustryEventEntrySchema = z.object({
  id: z.number(),
  year: z.number(),
  status: z.string(),
  display_text: z.string(),
  full_display_text: z.string(),
  industry_event: z.object({
    id: z.number(),
    name: z.string(),
    slug: z.string(),
    type: z.string(),
    logo_url: z.string().url(),
    white_logo_url: z.string().url(),
    cover_url: z.string().url(),
  }),
});

const StillVariantSchema = z.object({
  landscape: z.string().url(),
  portrait: z.string().url(),
});

const ExperimentStillsMultiSchema = z.object({
  variant_control: StillVariantSchema,
  variant_a: StillVariantSchema,
  variant_b: StillVariantSchema,
  variant_c: StillVariantSchema,
});

export const FilmSchema = z.object({
  id: z.number(),
  slug: z.string(),
  title_locale: z.string(),
  original_title: z.string(),
  year: z.number(),
  duration: z.number(),
  stills: z.object({
    small: z.string().url(),
    medium: z.string().url(),
    standard: z.string().url(),
    retina: z.string().url(),
    small_overlaid: z.string().url(),
    large_overlaid: z.string().url(),
    standard_push: z.string().url(),
  }),
  still_focal_point: z.object({
    x: z.number(),
    y: z.number(),
  }),
  hd: z.boolean(),
  average_colour_hex: z.string(),
  trailer_url: z.nullable(z.string().url()),
  trailer_id: z.nullable(z.number()),
  popularity: z.number(),
  web_url: z.string().url(),
  genres: z.array(z.string()),
  average_rating: z.number(),
  average_rating_out_of_ten: z.number(),
  number_of_ratings: z.number(),
  mubi_release: z.boolean(),
  should_use_safe_still: z.boolean(),
  still_url: z.string().url(),
  critic_review_rating: z.number(),
  content_rating: z.object({
    label: z.string(),
    rating_code: z.string(),
    description: z.string(),
    icon_url: z.nullable(z.string().url()),
    label_hex_color: z.string(),
  }),
  episode: z.nullable(EpisodeSchema),
  short_synopsis: z.string(),
  short_synopsis_html: z.string(),
  historic_countries: z.array(z.string()),
  portrait_image: z.nullable(z.any()),
  title: z.string(),
  title_upcase: z.string(),
  title_treatment_url: z.nullable(z.string().url()),
  experiment_stills: z.nullable(z.any()),
  experiment_stills_multi: z.nullable(ExperimentStillsMultiSchema),
  default_editorial: z.nullable(z.string()),
  default_editorial_html: z.nullable(z.string()),
  cast_members_count: z.number(),
  industry_events_count: z.number(),
  comments_count: z.number(),
  mubi_go_highlighted: z.boolean(),
  optimised_trailers: z.nullable(z.array(OptimisedTrailerSchema)),
  directors: z.array(
    z.object({ name: z.string(), name_upcase: z.string(), slug: z.string() }),
  ),
  consumable: ConsumableSchema,
  press_quote: z.nullable(
    z.object({
      quote: z.string(),
      source: z.string(),
    }),
  ),
  star_rating: z.nullable(
    z.object({
      star_rating: z.number(),
      source: z.string(),
    }),
  ),
  award: z.nullable(
    z.object({
      prize_image_url: z.string().url(),
      prize_text: z.string(),
    }),
  ),
  series: z.nullable(SeriesSchema),
  content_warnings: z.array(
    z.object({ id: z.number(), name: z.string(), key: z.string() }),
  ),
  artworks: z.array(ArtworkSchema),
  highlighted_industry_event_entry: z.nullable(
    HighlightedIndustryEventEntrySchema,
  ),
});

export type Film = z.infer<typeof FilmSchema>;
