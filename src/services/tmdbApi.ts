import axios from 'axios';

const API_KEY = 'your_tmdb_api_key_here'; // Replace with your actual API key
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

// Create axios instance
const api = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
  },
});

export interface TMDBResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

export const tmdbApi = {
  // Get popular movies
  getPopularMovies: async (page: number = 1) => {
    const response = await api.get('/movie/popular', { params: { page } });
    return response.data;
  },

  // Get top rated movies
  getTopRatedMovies: async (page: number = 1) => {
    const response = await api.get('/movie/top_rated', { params: { page } });
    return response.data;
  },

  // Get now playing movies
  getNowPlayingMovies: async (page: number = 1) => {
    const response = await api.get('/movie/now_playing', { params: { page } });
    return response.data;
  },

  // Get upcoming movies
  getUpcomingMovies: async (page: number = 1) => {
    const response = await api.get('/movie/upcoming', { params: { page } });
    return response.data;
  },

  // Get movie details
  getMovieDetails: async (movieId: number) => {
    const response = await api.get(`/movie/${movieId}`);
    return response.data;
  },

  // Get movie videos (trailers, teasers, etc.)
  getMovieVideos: async (movieId: number) => {
    const response = await api.get(`/movie/${movieId}/videos`);
    return response.data;
  },

  // Search movies
  searchMovies: async (query: string, page: number = 1) => {
    const response = await api.get('/search/movie', {
      params: { query, page }
    });
    return response.data;
  },

  // Get movie genres
  getGenres: async () => {
    const response = await api.get('/genre/movie/list');
    return response.data;
  },

  // Get similar movies
  getSimilarMovies: async (movieId: number, page: number = 1) => {
    const response = await api.get(`/movie/${movieId}/similar`, { params: { page } });
    return response.data;
  },

  // Get movie recommendations
  getMovieRecommendations: async (movieId: number, page: number = 1) => {
    const response = await api.get(`/movie/${movieId}/recommendations`, { params: { page } });
    return response.data;
  },
};

// Helper functions for image URLs
export const getImageUrl = (path: string, size: string = 'w500') => {
  if (!path) return '/placeholder.svg';
  return `${IMAGE_BASE_URL}/${size}${path}`;
};

export const getBackdropUrl = (path: string, size: string = 'w1280') => {
  if (!path) return '/placeholder.svg';
  return `${IMAGE_BASE_URL}/${size}${path}`;
};

export const getPosterUrl = (path: string, size: string = 'w500') => {
  if (!path) return '/placeholder.svg';
  return `${IMAGE_BASE_URL}/${size}${path}`;
};

// Extract YouTube video ID from TMDb video key
export const getYouTubeUrl = (key: string) => {
  return `https://www.youtube.com/watch?v=${key}`;
};

export const getYouTubeEmbedUrl = (key: string) => {
  return `https://www.youtube.com/embed/${key}`;
};

export const getYouTubeThumbnail = (key: string, quality: string = 'maxresdefault') => {
  return `https://img.youtube.com/vi/${key}/${quality}.jpg`;
};