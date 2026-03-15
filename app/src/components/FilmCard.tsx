import type { FilmSimple } from "../types";
import "./FilmCard.css";

interface FilmCardProps {
  film: FilmSimple;
}

const FilmCard = ({ film }: FilmCardProps) => {
  return (
    <div className="film-card">
      <img
        src={film.stillUrl}
        alt={`Cover image for ${film.title}`}
        loading="lazy"
        className="film-card-image"
      />
      <div className="film-card-content">
        <h2>{film.title}</h2>
        {film.originalTitle !== film.title && (
          <p className="film-card-original-title">{film.originalTitle}</p>
        )}
        <p className="film-card-meta">
          {film.year} · {film.directors}
        </p>
        <p className="film-card-meta">
          <span className="film-card-duration">{film.duration} min</span>
          {film.averageRating !== null && (
            <>
              <span className="film-card-rating-separator"> · </span>
              <span className="film-card-rating">
                {film.averageRating.toFixed(1)}
              </span>
              {film.numberOfRatings !== null && (
                <span className="film-card-rating-count">
                  ({film.numberOfRatings})
                </span>
              )}
            </>
          )}
        </p>
      </div>
    </div>
  );
};

export default FilmCard;
