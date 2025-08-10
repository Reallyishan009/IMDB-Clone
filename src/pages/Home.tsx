import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchPopularMovies, fetchLatestMovies } from '../store/slices/moviesSlice';
import HeroSection from '../components/HeroSection';
import MovieGrid from '../components/MovieGrid';
import LoadingSpinner from '../components/LoadingSpinner';

const Home: React.FC = () => {
  const dispatch = useAppDispatch();
  const { popular, latest } = useAppSelector(state => state.movies);

  useEffect(() => {
    if (popular.movies.length === 0) {
      dispatch(fetchPopularMovies(1));
    }
    if (latest.movies.length === 0) {
      dispatch(fetchLatestMovies());
    }
  }, [dispatch, popular.movies.length, latest.movies.length]);

  if (popular.loading && popular.movies.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      {popular.movies.length > 0 && (
        <HeroSection movie={popular.movies[0]} />
      )}

      {/* Latest Movies */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-foreground mb-8">Now Playing</h2>
          {latest.loading ? (
            <LoadingSpinner />
          ) : (
            <MovieGrid 
              movies={latest.movies.slice(0, 12)} 
              showLoadMore={false}
            />
          )}
        </div>
      </section>

      {/* Popular Movies */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-foreground mb-8">Popular Movies</h2>
          <MovieGrid 
            movies={popular.movies.slice(1, 13)} 
            showLoadMore={false}
          />
        </div>
      </section>
    </div>
  );
};

export default Home;