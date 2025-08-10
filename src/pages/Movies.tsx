import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchPopularMovies, fetchTopRatedMovies, searchMovies } from '../store/slices/moviesSlice';
import MovieGrid from '../components/MovieGrid';
import LoadingSpinner from '../components/LoadingSpinner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';

const Movies: React.FC = () => {
  const dispatch = useAppDispatch();
  const { popular, topRated, search } = useAppSelector(state => state.movies);
  const [activeTab, setActiveTab] = useState('popular');

  useEffect(() => {
    if (popular.movies.length === 0) {
      dispatch(fetchPopularMovies(1));
    }
    if (topRated.movies.length === 0) {
      dispatch(fetchTopRatedMovies(1));
    }
  }, [dispatch, popular.movies.length, topRated.movies.length]);

  const handleLoadMore = () => {
    if (activeTab === 'popular' && popular.currentPage < popular.totalPages) {
      dispatch(fetchPopularMovies(popular.currentPage + 1));
    } else if (activeTab === 'top-rated' && topRated.currentPage < topRated.totalPages) {
      dispatch(fetchTopRatedMovies(topRated.currentPage + 1));
    }
  };

  // Show search results if available
  if (search.movies.length > 0 || search.loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-foreground mb-8">
          {search.loading ? 'Searching...' : `Search Results for "${search.query}"`}
        </h1>
        {search.loading ? (
          <LoadingSpinner />
        ) : (
          <MovieGrid 
            movies={search.movies}
            showLoadMore={search.currentPage < search.totalPages}
            onLoadMore={() => dispatch(searchMovies({ 
              query: search.query, 
              page: search.currentPage + 1 
            }))}
            loadingMore={search.loading}
          />
        )}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-foreground mb-8">Movies</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2 mb-8">
          <TabsTrigger value="popular">Popular</TabsTrigger>
          <TabsTrigger value="top-rated">Top Rated</TabsTrigger>
        </TabsList>
        
        <TabsContent value="popular">
          {popular.loading && popular.movies.length === 0 ? (
            <LoadingSpinner />
          ) : (
            <MovieGrid 
              movies={popular.movies}
              showLoadMore={popular.currentPage < popular.totalPages}
              onLoadMore={handleLoadMore}
              loadingMore={popular.loading}
            />
          )}
        </TabsContent>
        
        <TabsContent value="top-rated">
          {topRated.loading && topRated.movies.length === 0 ? (
            <LoadingSpinner />
          ) : (
            <MovieGrid 
              movies={topRated.movies}
              showLoadMore={topRated.currentPage < topRated.totalPages}
              onLoadMore={handleLoadMore}
              loadingMore={topRated.loading}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Movies;