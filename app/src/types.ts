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
