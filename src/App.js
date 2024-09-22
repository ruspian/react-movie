import { useEffect, useState } from "react";

const tempMovieData = [
  {
    imdbID: "tt15398776",
    Title: "Oppenheimer",
    Year: "2013",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMDBmYTZjNjUtN2M1MS00MTQ2LTk2ODgtNzc2M2QyZGE5NTVjXkEyXkFqcGdeQXVyNzAwMjU2MTY@._V1_SX300.jpg",
  },
  {
    imdbID: "tt1517268",
    Title: "Barbie",
    Year: "2023",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BNjU3N2QxNzYtMjk1NC00MTc4LTk1NTQtMmUxNTljM2I0NDA5XkEyXkFqcGdeQXVyODE5NzE3OTE@._V1_SX300.jpg",
  },
  {
    imdbID: "tt8589698",
    Title: "Teenage Mutant Ninja Turtles: Mutant Mayhem",
    Year: "2023",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BYzE4MTllZTktMTIyZS00Yzg1LTg1YzAtMWQwZTZkNjNkODNjXkEyXkFqcGdeQXVyMTUzMTg2ODkz._V1_SX300.jpg",
  },
];

const tempWatchedData = [
  {
    imdbID: "tt15398776",
    Title: "Oppenheimer",
    Year: "2013",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMDBmYTZjNjUtN2M1MS00MTQ2LTk2ODgtNzc2M2QyZGE5NTVjXkEyXkFqcGdeQXVyNzAwMjU2MTY@._V1_SX300.jpg",
    runtime: 180,
    imdbRating: 8.6,
    userRating: 10,
  },
  {
    imdbID: "tt1517268",
    Title: "Barbie",
    Year: "2023",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BNjU3N2QxNzYtMjk1NC00MTc4LTk1NTQtMmUxNTljM2I0NDA5XkEyXkFqcGdeQXVyODE5NzE3OTE@._V1_SX300.jpg",
    runtime: 114,
    imdbRating: 7.2,
    userRating: 8,
  },
];

// komponen logo
function Logo() {
  return (
    <div className="logo">
      <span role="img">🎫</span>
      <h1>Movie</h1>
    </div>
  );
}

// komponen search
function Search({ query, setQuery }) {
  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
    />
  );
}

// komponen num-results
function NumResults({ movies }) {
  return (
    <p className="num-results">
      Found <strong>{movies?.length}</strong> results
    </p>
  );
}

function NavBar({ children }) {
  return <nav className="nav-bar">{children}</nav>;
}

function MovieListItems({ movie, onSelectMovie }) {
  return (
    <li key={movie.imdbID} onClick={() => onSelectMovie(movie.imdbID)}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>📅</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
}

function MovieList({ movies, onSelectMovie }) {
  return (
    <ul className="list list-movies">
      {movies?.map((movie) => (
        <MovieListItems
          key={movie.imdbID}
          movie={movie}
          onSelectMovie={onSelectMovie}
        />
      ))}
    </ul>
  );
}

function WatchSummary({ watched }) {
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));

  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>🎬</span>
          <span>{avgImdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime} min</span>
        </p>
      </div>
    </div>
  );
}

function WatchListItems({ movie }) {
  return (
    <li key={movie.imdbID}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🎬</span>
          <span>{movie.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.runtime} min</span>
        </p>
      </div>
    </li>
  );
}

function MovieWatched({ watched }) {
  return (
    <ul className="list">
      {watched.map((movie) => (
        <WatchListItems key={movie.imdbID} movie={movie} />
      ))}
    </ul>
  );
}

function BoxMovies({ children }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="box">
      <button className="btn-toggle" onClick={() => setIsOpen((open) => !open)}>
        {isOpen ? "–" : "+"}
      </button>
      {isOpen && children}
    </div>
  );
}

// menambahkan komponen movie details
function MovieDetails({ selectedId, onCloseMovie }) {
  const [movie, setMovie] = useState({});

  // mengubah uppercase menjadi lowercase
  const {
    Poster: poster,
    Title: title,
    Year: year,
    Runtime: runtime,
    Genre: genre,
    imdbRating,
    imdbVotes: imdbVotes,
    imdbID: imdbID,
    Actors: actors,
    Awards: awards,
    BoxOffice: boxOffice,
    Country: country,
    DVD: dvd,
    Director: director,
    Plot: plot,
  } = movie;

  useEffect(() => {
    async function getMovieDetails() {
      const response = await fetch(
        `http://www.omdbapi.com/?apikey=${API_KEY}&i=${selectedId}`
      );
      const data = await response.json();
      setMovie(data);
    }
    getMovieDetails();
    // kalau mengambil props dengan menggunakan useEffect maka props tersebut disimpan di array dependency
  }, [selectedId]);

  return (
    <div className="details">
      <header>
        <button className="btn-back" onClick={onCloseMovie}>
          &#x2715;
        </button>
        <img src={poster} alt={`${title} poster`} />
        <div className="details-overview">
          <h2>{title}</h2>
          <p>
            <span>Year: </span>
            <span>{year}</span>
          </p>
          <p>
            <span>Runtime: </span>
            <span>{runtime}</span>
          </p>
          <p>
            <span>Genre: </span>
            <span>{genre}</span>
          </p>
          <p>
            <span>Rating: </span>
            <span>{imdbRating}</span>
          </p>
        </div>
      </header>
      <section>
        <p><em>{plot}</em></p>
          <span>Actors: {actors}</span>
          <span>Country: {country}</span>
          <span>Director: {director}</span>
      </section>
    </div>
  );
}

function Main({ children }) {
  // children di gunakan untuk mengurangi penggunaan props
  return <main className="main">{children}</main>;
}

function Loading() {
  return (
    <div className="loader">
      <div className="loading-bar">
        <div className="bar"></div>
      </div>
    </div>
  );
}

function ErrorMessage({ message }) {
  return (
    <div className="error">
      <span>⛔️</span>
      {message}
    </div>
  );
}

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

const API_KEY = "964fbde3";

export default function App() {
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState(tempWatchedData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("pocong");
  const [selectedMovie, setSelectedMovie] = useState(null);

  // menambahkan function handleSelectMovie untuk mencari id movie
  function handleSelectMovie(id) {
    // menutup movie details sebelumnya dengan mengklik movie yang sama
    setSelectedMovie((selectedId) => (selectedId === id ? null : id));
  }

  // menambahkan function handleCoseMovie untuk menutup movie details
  function handleCloseMovie() {
    setSelectedMovie(null);
  }

  // const temQuery = "pocong";

  // useEffect(() => {
  //   fetch(`http://www.omdbapi.com/?apikey=${API_KEY}&s=pocong`)
  //     .then((response) => response.json())
  //     .then((data) => setMovies(data.Search));
  // }, []);

  // menggunakan asyncronus di dalam useEffect atau function yang bersifat syncronus dan ini lebih direkomendasikan
  useEffect(() => {
    // menambahkan tampilan loading
    async function fetchDataMovies() {
      // menggunakan try catch untuk menangkap error
      try {
        setIsLoading(true);

        // fetch data API
        const response = await fetch(
          `http://www.omdbapi.com/?apikey=${API_KEY}&s=${query}`
        );

        // menangkap error
        if (!response.ok) throw new Error("Maaf terjadi Error!");

        const data = await response.json();

        // menangkap error dari kesalahan query
        if (data.Response === "False") throw new Error(data.Error);

        setMovies(data.Search);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    }

    if (query.length < 3) {
      setMovies([]);
      setError("");
      return;
    }

    fetchDataMovies();

    // menggunakan dependency array untuk menangani ketika query berubah
  }, [query]);

  return (
    <>
      {/* mengatasi prof driling dengan children untuk mengurangi penggunaan props */}
      <NavBar>
        <Logo />
        <Search query={query} setQuery={setQuery} />
        {/* menggunakan children dan ingin menggunakan props */}
        <NumResults movies={movies} />
      </NavBar>
      <Main>
        {/* cara lain mengirimkan komponen melalui props dan children */}
        <BoxMovies>
          {isLoading && <Loading />}
          {error && <ErrorMessage message={error} />}
          {!isLoading && !error && (
            <MovieList movies={movies} onSelectMovie={handleSelectMovie} />
          )}
        </BoxMovies>
        <BoxMovies>
          {selectedMovie ? (
            <MovieDetails
              selectedId={selectedMovie}
              onCloseMovie={handleCloseMovie}
            />
          ) : (
            <>
              <WatchSummary watched={watched} />
              <MovieWatched watched={watched} />
            </>
          )}
        </BoxMovies>
      </Main>
    </>
  );
}
