import React from 'react';
import { Heart, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { clearWatchlist } from '../store/slices/watchlistSlice';
import MovieGrid from '../components/MovieGrid';

const Watchlist: React.FC = () => {
  const dispatch = useAppDispatch();
  const { movies } = useAppSelector(state => state.watchlist);

  const handleClearWatchlist = () => {
    if (window.confirm('Are you sure you want to clear your entire watchlist?')) {
      dispatch(clearWatchlist());
    }
  };

  if (movies.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-md mx-auto">
          <div className="mb-8">
            <Heart className="h-24 w-24 text-muted-foreground mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-foreground mb-4">Your Watchlist is Empty</h1>
            <p className="text-lg text-muted-foreground">
              Start adding movies you want to watch by clicking the heart icon on any movie card.
            </p>
          </div>
          
          <Button asChild size="lg">
            <a href="/movies" className="inline-flex items-center">
              Browse Movies
            </a>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">My Watchlist</h1>
          <p className="text-lg text-muted-foreground">
            {movies.length} movie{movies.length !== 1 ? 's' : ''} in your watchlist
          </p>
        </div>
        
        {movies.length > 0 && (
          <Button
            variant="destructive"
            onClick={handleClearWatchlist}
            className="transition-smooth"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Clear All
          </Button>
        )}
      </div>
      
      <MovieGrid movies={movies} showLoadMore={false} />
    </div>
  );
};

export default Watchlist;