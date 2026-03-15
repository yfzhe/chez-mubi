export interface FilmSimple {
  id: number;
  slug: string;
  title: string;
  originalTitle: string;
  directors: string;
  year: number;
  duration: number;
  stillUrl: string;
  averageRating: number | null;
  numberOfRatings: number | null;
}

export interface FilmDetail extends FilmSimple {
  synopsis: string;
  editorial: string | null;
  averageColourHex: string;
  consumables: FilmConsumable[];
}

export interface FilmConsumable {
  countryCode: string;
  availableAt: string | null;
  expiresAt: string | null;
}
