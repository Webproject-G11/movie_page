
import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "./context/userContext";

const MovieDetails = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  useEffect(() => {
    fetch(`https://api.themoviedb.org/3/movie/${id}`, {
      headers: {
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxMWY5YjZiNmIyY2M4YjQwOTk2YWE1MzY2NmIwMDJkNSIsIm5iZiI6MTczMTY1OTg4NC44OTM1NSwic3ViIjoiNjczNDUzZjgwNTgxNjRjNDA1MjNmYTBkIiwic2NvcGVzIjpbImFwaV9yZWFkIl0sInZlcnNpb24iOjF9.xiEsZpA1oJhq910VPdQAqPrZmnktqGJMj58imsF0RtI",
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((json) => setMovie(json))
      .catch((error) => console.log(error));
  }, [id]);

  const addToFavorites = async () => {
    if (!user || !user.user_id || !movie || !movie.id) {
      alert("You must be logged in to add favorites.");
      console.error("Missing user or movie data");
      return;  
    }
    try {
      const response = await axios.post(
        `http://localhost:3001/favorites`,
        {
          user_id: user.user_id,  
          movie_id: movie.id, 
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,  
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        alert("Added to favorite list.");
        console.log("Movie added to favorites:", response.data);
      }
    } catch (error) {
      console.error("Error adding movie to favorites:", error.response ? error.response.data : error.message);
      alert("Failed to add movie to favorites.");

    }
  };

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/movie/${id}`,
          {
            headers: {
              Authorization:
              "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxMWY5YjZiNmIyY2M4YjQwOTk2YWE1MzY2NmIwMDJkNSIsIm5iZiI6MTczMTY1OTg4NC44OTM1NSwic3ViIjoiNjczNDUzZjgwNTgxNjRjNDA1MjNmYTBkIiwic2NvcGVzIjpbImFwaV9yZWFkIl0sInZlcnNpb24iOjF9.xiEsZpA1oJhq910VPdQAqPrZmnktqGJMj58imsF0RtI",
            },
          }
        );
        setMovie(response.data);
      } catch (error) {
        console.error("Error fetching movie:", error);
      }
    };

    fetchMovie();
  }, [id]);

  if (!movie) {
    return <div>Loading...</div>; 
  }

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h2>{movie.title}</h2>

      <div style={{ display: "flex", gap: "20px" }}>
        {movie.poster_path && (
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
            style={{ maxWidth: "200px", borderRadius: "8px" }}
          />
        )}
        {movie.backdrop_path && (
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.backdrop_path}`}
            alt={`${movie.title} Backdrop`}
            style={{ maxWidth: "400px", borderRadius: "8px" }}
          />
        )}
      </div>

      <p style={{ marginTop: "20px" }}>{movie.overview}</p>

      <div>
        <h4>Details</h4>
        <p><strong>Original Title:</strong> {movie.original_title}</p>
        <p><strong>Release Date:</strong> {movie.release_date}</p>
        <p><strong>Runtime:</strong> {movie.runtime} minutes</p>
        <p><strong>Language:</strong> {movie.spoken_languages.map(lang => lang.english_name).join(", ")}</p>
        <p><strong>Genres:</strong> {movie.genres.map(genre => genre.name).join(", ")}</p>
        <p><strong>Budget:</strong> ${movie.budget.toLocaleString()}</p>
        <p><strong>Revenue:</strong> ${movie.revenue.toLocaleString()}</p>
      </div>

      <div>
        <h4>Production Companies</h4>
        <ul>
          {movie.production_companies.map(company => (
            <li key={company.id}>
              {company.logo_path && (
                <img
                  src={`https://image.tmdb.org/t/p/w200${company.logo_path}`}
                  alt={company.name}
                  style={{ maxWidth: "100px", verticalAlign: "middle", marginRight: "10px" }}
                />
              )}
              {company.name} ({company.origin_country})
            </li>
          ))}
        </ul>
      </div>

      <button
        onClick={addToFavorites}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          backgroundColor: "#28a745",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Add to Favorites
      </button>

      <button
        onClick={() => navigate(`/reviews/${id}`)} 
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          backgroundColor: "#007BFF",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Reviews
      </button>
    </div>
  );
};

export default MovieDetails;
