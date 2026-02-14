CREATE TABLE films (
  id INTEGER PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  original_title TEXT NOT NULL,
  directors TEXT NOT NULL, -- names of directors joined by ", "
  year INTEGER NOT NULL,
  duration INTEGER NOT NULL,
  synopsis TEXT NOT NULL,
  editorial TEXT,
  still_url TEXT NOT NULL,
  trailer_url TEXT,
  average_colour_hex TEXT NOT NULL,
  average_rating REAL,
  number_of_ratings INTEGER,
  popularity INTEGER NOT NULL,
  type INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE film_consumables (
  film_id INTEGER NOT NULL,
  country_code TEXT NOT NULL,
  available_at TEXT, -- ISO datetime
  expires_at TEXT, -- ISO datetime
  PRIMARY KEY (film_id, country_code)
);

CREATE TABLE metadata (
  id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  updated_at TEXT NOT NULL -- ISO datetime
);
