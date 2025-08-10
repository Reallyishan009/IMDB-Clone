import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Play, Heart, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { toggleWatchlist } from '../store/slices/watchlistSlice';
import { Movie } from '../store/slices/moviesSlice';
import { getBackdropUrl } from '../services/tmdbApi';

interface HeroSectionProps {
  movie: Movie;
}

const HeroSection: React.FC<HeroSectionProps> = ({ movie }) => {
  const dispatch = useAppDispatch();
  const { movies: watchlistMovies } = useAppSelector(state => state.watchlist);
  
  const isInWatchlist = watchlistMovies.some(m => m.id === movie.id);
  
  const handleWatchlistToggle = () => {
    dispatch(toggleWatchlist(movie));
  };

  return (
    <section 
      className="relative h-screen bg-cover bg-center bg-no-repeat flex items-center"
      style={{
        backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.8), rgba(0,0,0,0.4)), url(${getBackdropUrl(movie.backdrop_path, 'original')})`
      }}
    >
      <div className="absolute inset-0 hero-gradient" />
      
      <div className="relative container mx-auto px-4">
        <div className="max-w-2xl text-white">
          <div className="flex items-center gap-4 mb-4">
            <Badge variant="secondary" className="bg-white/10 text-white">
              <Star className="h-3 w-3 mr-1 fill-current text-cinema-gold" />
              {movie.vote_average.toFixed(1)}
            </Badge>
            <span className="text-cinema-silver">
              {new Date(movie.release_date).getFullYear()}
            </span>
          </div>
          
          <h1 className="text-6xl font-bold mb-6 leading-tight">
            {movie.title}
          </h1>
          
          <p className="text-xl leading-relaxed mb-8 text-cinema-silver">
            {movie.overview}
          </p>
          
          <div className="flex flex-wrap gap-4">
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <Link to={`/movie/${movie.id}`}>
                <Play className="h-5 w-5 mr-2" />
                Watch Trailer
              </Link>
            </Button>
            
            <Button
              size="lg"
              variant="outline"
              onClick={handleWatchlistToggle}
              className="bg-white/10 text-white border-white/20 hover:bg-white/20 transition-bounce"
            >
              <Heart className={`h-5 w-5 mr-2 ${isInWatchlist ? 'fill-current' : ''}`} />
              {isInWatchlist ? 'In Watchlist' : 'Add to Watchlist'}
            </Button>
            
            <Button asChild size="lg" variant="ghost" className="text-white hover:bg-white/10">
              <Link to={`/movie/${movie.id}`}>
                <Info className="h-5 w-5 mr-2" />
                More Info
              </Link>
            </Button>
          </div>
        </div>
      </div>
      
      {/* Gradient overlay at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default HeroSection;