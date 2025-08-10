import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Movie } from './moviesSlice';

interface WatchlistState {
  movies: Movie[];
}

// Load watchlist from localStorage
const loadWatchlistFromStorage = (): Movie[] => {
  try {
    const watchlist = localStorage.getItem('imdb-watchlist');
    return watchlist ? JSON.parse(watchlist) : [];
  } catch (error) {
    console.error('Failed to load watchlist from localStorage:', error);
    return [];
  }
};

// Save watchlist to localStorage
const saveWatchlistToStorage = (movies: Movie[]) => {
  try {
    localStorage.setItem('imdb-watchlist', JSON.stringify(movies));
  } catch (error) {
    console.error('Failed to save watchlist to localStorage:', error);
  }
};

const initialState: WatchlistState = {
  movies: loadWatchlistFromStorage(),
};

const watchlistSlice = createSlice({
  name: 'watchlist',
  initialState,
  reducers: {
    addToWatchlist: (state, action: PayloadAction<Movie>) => {
      const movie = action.payload;
      const exists = state.movies.find(m => m.id === movie.id);
      
      if (!exists) {
        state.movies.push(movie);
        saveWatchlistToStorage(state.movies);
      }
    },
    removeFromWatchlist: (state, action: PayloadAction<number>) => {
      const movieId = action.payload;
      state.movies = state.movies.filter(movie => movie.id !== movieId);
      saveWatchlistToStorage(state.movies);
    },
    clearWatchlist: (state) => {
      state.movies = [];
      saveWatchlistToStorage(state.movies);
    },
    toggleWatchlist: (state, action: PayloadAction<Movie>) => {
      const movie = action.payload;
      const existingIndex = state.movies.findIndex(m => m.id === movie.id);
      
      if (existingIndex >= 0) {
        state.movies.splice(existingIndex, 1);
      } else {
        state.movies.push(movie);
      }
      saveWatchlistToStorage(state.movies);
    },
  },
});

export const { addToWatchlist, removeFromWatchlist, clearWatchlist, toggleWatchlist } = watchlistSlice.actions;
export default watchlistSlice.reducer;