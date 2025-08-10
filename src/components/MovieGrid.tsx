import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import MovieCard from './MovieCard';
import { Movie } from '../store/slices/moviesSlice';

interface MovieGridProps {
  movies: Movie[];
  showLoadMore?: boolean;
  onLoadMore?: () => void;
  loadingMore?: boolean;
  size?: 'small' | 'medium' | 'large';
}

const MovieGrid: React.FC<MovieGridProps> = ({
  movies,
  showLoadMore = false,
  onLoadMore,
  loadingMore = false,
  size = 'medium'
}) => {
  if (movies.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-muted-foreground">No movies found</p>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} size={size} />
        ))}
      </div>
      
      {showLoadMore && onLoadMore && (
        <div className="text-center mt-12">
          <Button
            onClick={onLoadMore}
            disabled={loadingMore}
            size="lg"
            variant="outline"
            className="transition-smooth"
          >
            {loadingMore ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Loading...
              </>
            ) : (
              'Load More Movies'
            )}
          </Button>
        </div>
      )}
    </div>
  );
};

export default MovieGrid;