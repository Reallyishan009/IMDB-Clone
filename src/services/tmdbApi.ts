import axios from 'axios';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY; // Use Vite env var
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

// Axios instance with Bearer Auth
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Bearer ${API_KEY}`,
    'Content-Type': 'application/json',
  },
});

export interface TMDBResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

export const tmdbApi = {
  getPopularMovies: async (page: number = 1) => {
    const response = await api.get('/movie/popular', {
      params: { page },
    });
    return response.data;
  },

  getTopRatedMovies: async (page: number = 1) => {
    const response = await api.get('/movie/top_rated', { params: { page } });
    return response.data;
  },

  getNowPlayingMovies: async (page: number = 1) => {
    const response = await api.get('/movie/now_playing', { params: { page } });
    return response.data;
  },

  getUpcomingMovies: async (page: number = 1) => {
    const response = await api.get('/movie/upcoming', { params: { page } });
    return response.data;
  },

  getMovieDetails: async (movieId: number) => {
    const response = await api.get(`/movie/${movieId}`);
    return response.data;
  },

  getMovieVideos: async (movieId: number) => {
    const response = await api.get(`/movie/${movieId}/videos`);
    return response.data;
  },

  searchMovies: async (query: string, page: number = 1) => {
    const response = await api.get('/search/movie', {
      params: { query, page },
    });
    return response.data;
  },

  getGenres: async () => {
    const response = await api.get('/genre/movie/list');
    return response.data;
  },

  getSimilarMovies: async (movieId: number, page: number = 1) => {
    const response = await api.get(`/movie/${movieId}/similar`, { params: { page } });
    return response.data;
  },

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

export const getYouTubeUrl = (key: string) => {
  return `https://www.youtube.com/watch?v=${key}`;
};

export const getYouTubeEmbedUrl = (key: string) => {
  return `https://www.youtube.com/embed/${key}`;
};

export const getYouTubeThumbnail = (key: string, quality: string = 'maxresdefault') => {
  return `https://img.youtube.com/vi/${key}/${quality}.jpg`;
};
