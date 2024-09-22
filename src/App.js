import { useEffect, useState } from "react";
import StarRating from "./StarRating";

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
      <h2>Film Yang Telah Ditonton</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} Film</span>
        </p>
        <p>
          <span>🎬</span>
          <span>{avgImdbRating.toFixed(1)}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating.toFixed(1)}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{Math.trunc(avgRuntime)} min</span>
        </p>
      </div>
    </div>
  );
}

function WatchListItems({ movie, onDeleteWatched }) {
  return (
    <li key={movie.imdbID}>
      <img src={movie.poster} alt={`${movie.title} poster`} />
      <h3>{movie.title}</h3>
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
        <button
          className="btn-delete"
          onClick={() => onDeleteWatched(movie.imdbID)}
        >
          x
        </button>
      </div>
    </li>
  );
}

function MovieWatched({ watched, onDeleteWatched }) {
  return (
    <ul className="list">
      {watched.map((movie) => (
        <WatchListItems
          key={movie.imdbID}
          movie={movie}
          onDeleteWatched={onDeleteWatched}
        />
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
function MovieDetails({ selectedId, onCloseMovie, onAddWatched, watched }) {
  const [movie, setMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [userRating, setUserRating] = useState("");

  const isWatched = watched.some((movie) => movie.imdbID === selectedId);
  const watchedUserRating = watched.find(
    (movie) => movie.imdbID === selectedId
  )?.userRating;

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

  function handleAddWatched() {
    const newWatchMovie = {
      imdbID: selectedId,
      title,
      poster,
      year,
      runtime: Number(runtime.split(" ").at(0)),
      genre,
      imdbRating,
      imdbVotes: Number(imdbRating),
      imdbID: imdbID,
      actors,
      awards,
      boxOffice,
      country,
      dvd,
      director,
      plot,
      userRating: Number(userRating),
    };
    onAddWatched(newWatchMovie);
    onCloseMovie();
  }

  useEffect(() => {
    async function getMovieDetails() {
      setIsLoading(true);
      const response = await fetch(
        `http://www.omdbapi.com/?apikey=${API_KEY}&i=${selectedId}`
      );
      const data = await response.json();
      setMovie(data);
      setIsLoading(false);
    }
    getMovieDetails();
    // kalau mengambil props dengan menggunakan useEffect maka props tersebut disimpan di array dependency
  }, [selectedId]);

  // mendapatkan data film untuk judul page
  useEffect(() => {
    if (!title) return;
    document.title = `PopMovie | ${title}`;

    // mengembalikan judul page ketika props title berubah
    return function () {
      document.title = "PopMovie";
    }
  }, [title]);

  return (
    <div className="details">
      {isLoading ? (
        <Loading />
      ) : (
        <>
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
            <p>
              <em>{plot}</em>
            </p>
            <span>Actors: {actors}</span>
            <span>Country: {country}</span>
            <span>Director: {director}</span>

            <div className="rating">
              {!isWatched ? (
                <>
                  <StarRating max={10} size={24} onSetRating={setUserRating} />
                  {userRating > 0 && (
                    <button className="btn-add" onClick={handleAddWatched}>
                      + Add to Watched
                    </button>
                  )}
                </>
              ) : (
                <p>
                  Anda sudah menambahkan film ini ke daftar di tonton dengan
                  rating {watchedUserRating} / 10
                </p>
              )}
            </div>
          </section>
        </>
      )}
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
  const [watched, setWatched] = useState([]);
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

  function handleDeleteWatched(id) {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
  }

  function handleAddWatched(movie) {
    setWatched((watched) => [...watched, movie]);
  }

  // const temQuery = "pocong";

  // useEffect(() => {
  //   fetch(`http://www.omdbapi.com/?apikey=${API_KEY}&s=pocong`)
  //     .then((response) => response.json())
  //     .then((data) => setMovies(data.Search));
  // }, []);

  // menggunakan asyncronus di dalam useEffect atau function yang bersifat syncronus dan ini lebih direkomendasikan
  useEffect(() => {
    // memperbaiki pencarian movie
    const controller = new AbortController();


    // menambahkan tampilan loading
    async function fetchDataMovies() {
      // menggunakan try catch untuk menangkap error
      try {
        setIsLoading(true);

        // fetch data API
        const response = await fetch(
          `http://www.omdbapi.com/?apikey=${API_KEY}&s=${query}`,
          // mengontrol cancel request pada saat perubahan state 
          { signal: controller.signal }
        );

        // menangkap error
        if (!response.ok) throw new Error("Maaf terjadi Error!");

        const data = await response.json();

        // menangkap error dari kesalahan query
        if (data.Response === "False") throw new Error(data.Error);

        setMovies(data.Search);
        setError("");
      } catch (error) {
        if (error.name === "AbortError") return;
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
    
    // memanggil fungsi abort controller untuk menghentikan request
    return function () {
      controller.abort();
    }
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
              onAddWatched={handleAddWatched}
              watched={watched}
            />
          ) : (
            <>
              <WatchSummary watched={watched} />
              <MovieWatched
                watched={watched}
                onDeleteWatched={handleDeleteWatched}
              />
            </>
          )}
        </BoxMovies>
      </Main>
    </>
  );
}
