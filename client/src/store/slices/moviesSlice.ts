import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { tmdbApi } from '../../services/tmdbApi';

export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  vote_average: number;
  genre_ids: number[];
  adult: boolean;
  original_language: string;
  original_title: string;
  popularity: number;
  video: boolean;
  vote_count: number;
}

export interface MovieDetails extends Movie {
  genres: { id: number; name: string }[];
  runtime: number;
  budget: number;
  revenue: number;
  production_companies: { id: number; name: string; logo_path: string }[];
  spoken_languages: { english_name: string; iso_639_1: string; name: string }[];
  status: string;
  tagline: string;
  homepage: string;
}

export interface Video {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
  official: boolean;
  published_at: string;
}

interface MoviesState {
  popular: {
    movies: Movie[];
    currentPage: number;
    totalPages: number;
    loading: boolean;
    error: string | null;
  };
  topRated: {
    movies: Movie[];
    currentPage: number;
    totalPages: number;
    loading: boolean;
    error: string | null;
  };
  latest: {
    movies: Movie[];
    loading: boolean;
    error: string | null;
  };
  movieDetails: {
    movie: MovieDetails | null;
    videos: Video[];
    loading: boolean;
    error: string | null;
  };
  search: {
    movies: Movie[];
    currentPage: number;
    totalPages: number;
    query: string;
    loading: boolean;
    error: string | null;
  };
}

const initialState: MoviesState = {
  popular: {
    movies: [],
    currentPage: 1,
    totalPages: 1,
    loading: false,
    error: null,
  },
  topRated: {
    movies: [],
    currentPage: 1,
    totalPages: 1,
    loading: false,
    error: null,
  },
  latest: {
    movies: [],
    loading: false,
    error: null,
  },
  movieDetails: {
    movie: null,
    videos: [],
    loading: false,
    error: null,
  },
  search: {
    movies: [],
    currentPage: 1,
    totalPages: 1,
    query: '',
    loading: false,
    error: null,
  },
};

// Async thunks
export const fetchPopularMovies = createAsyncThunk(
  'movies/fetchPopular',
  async (page: number = 1) => {
    const response = await tmdbApi.getPopularMovies(page);
    return response;
  }
);

export const fetchTopRatedMovies = createAsyncThunk(
  'movies/fetchTopRated',
  async (page: number = 1) => {
    const response = await tmdbApi.getTopRatedMovies(page);
    return response;
  }
);

export const fetchLatestMovies = createAsyncThunk(
  'movies/fetchLatest',
  async () => {
    const response = await tmdbApi.getNowPlayingMovies();
    return response;
  }
);

export const fetchMovieDetails = createAsyncThunk(
  'movies/fetchMovieDetails',
  async (movieId: number) => {
    const [movieDetails, videos] = await Promise.all([
      tmdbApi.getMovieDetails(movieId),
      tmdbApi.getMovieVideos(movieId),
    ]);
    return { movieDetails, videos };
  }
);

export const searchMovies = createAsyncThunk(
  'movies/search',
  async ({ query, page = 1 }: { query: string; page?: number }) => {
    const response = await tmdbApi.searchMovies(query, page);
    return { ...response, query };
  }
);

const moviesSlice = createSlice({
  name: 'movies',
  initialState,
  reducers: {
    clearMovieDetails: (state) => {
      state.movieDetails.movie = null;
      state.movieDetails.videos = [];
      state.movieDetails.error = null;
    },
    clearSearch: (state) => {
      state.search = initialState.search;
    },
  },
  extraReducers: (builder) => {
    // Popular Movies
    builder
      .addCase(fetchPopularMovies.pending, (state) => {
        state.popular.loading = true;
        state.popular.error = null;
      })
      .addCase(fetchPopularMovies.fulfilled, (state, action) => {
        state.popular.loading = false;
        if (action.payload.page === 1) {
          state.popular.movies = action.payload.results;
        } else {
          state.popular.movies.push(...action.payload.results);
        }
        state.popular.currentPage = action.payload.page;
        state.popular.totalPages = action.payload.total_pages;
      })
      .addCase(fetchPopularMovies.rejected, (state, action) => {
        state.popular.loading = false;
        state.popular.error = action.error.message || 'Failed to fetch popular movies';
      })

    // Top Rated Movies
      .addCase(fetchTopRatedMovies.pending, (state) => {
        state.topRated.loading = true;
        state.topRated.error = null;
      })
      .addCase(fetchTopRatedMovies.fulfilled, (state, action) => {
        state.topRated.loading = false;
        if (action.payload.page === 1) {
          state.topRated.movies = action.payload.results;
        } else {
          state.topRated.movies.push(...action.payload.results);
        }
        state.topRated.currentPage = action.payload.page;
        state.topRated.totalPages = action.payload.total_pages;
      })
      .addCase(fetchTopRatedMovies.rejected, (state, action) => {
        state.topRated.loading = false;
        state.topRated.error = action.error.message || 'Failed to fetch top rated movies';
      })

    // Latest Movies
      .addCase(fetchLatestMovies.pending, (state) => {
        state.latest.loading = true;
        state.latest.error = null;
      })
      .addCase(fetchLatestMovies.fulfilled, (state, action) => {
        state.latest.loading = false;
        state.latest.movies = action.payload.results;
      })
      .addCase(fetchLatestMovies.rejected, (state, action) => {
        state.latest.loading = false;
        state.latest.error = action.error.message || 'Failed to fetch latest movies';
      })

    // Movie Details
      .addCase(fetchMovieDetails.pending, (state) => {
        state.movieDetails.loading = true;
        state.movieDetails.error = null;
      })
      .addCase(fetchMovieDetails.fulfilled, (state, action) => {
        state.movieDetails.loading = false;
        state.movieDetails.movie = action.payload.movieDetails;
        state.movieDetails.videos = action.payload.videos.results;
      })
      .addCase(fetchMovieDetails.rejected, (state, action) => {
        state.movieDetails.loading = false;
        state.movieDetails.error = action.error.message || 'Failed to fetch movie details';
      })

    // Search Movies
      .addCase(searchMovies.pending, (state) => {
        state.search.loading = true;
        state.search.error = null;
      })
      .addCase(searchMovies.fulfilled, (state, action) => {
        state.search.loading = false;
        state.search.query = action.payload.query;
        if (action.payload.page === 1) {
          state.search.movies = action.payload.results;
        } else {
          state.search.movies.push(...action.payload.results);
        }
        state.search.currentPage = action.payload.page;
        state.search.totalPages = action.payload.total_pages;
      })
      .addCase(searchMovies.rejected, (state, action) => {
        state.search.loading = false;
        state.search.error = action.error.message || 'Failed to search movies';
      });
  },
});

export const { clearMovieDetails, clearSearch } = moviesSlice.actions;
export default moviesSlice.reducer;