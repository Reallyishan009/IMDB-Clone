import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Heart, Calendar, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { toggleWatchlist } from '../store/slices/watchlistSlice';
import { Movie } from '../store/slices/moviesSlice';
import { getPosterUrl } from '../services/tmdbApi';

interface MovieCardProps {
  movie: Movie;
  showWatchlistButton?: boolean;
  size?: 'small' | 'medium' | 'large';
}

const MovieCard: React.FC<MovieCardProps> = ({ 
  movie, 
  showWatchlistButton = true, 
  size = 'medium' 
}) => {
  const dispatch = useAppDispatch();
  const { movies: watchlistMovies } = useAppSelector(state => state.watchlist);
  
  const isInWatchlist = watchlistMovies.some(m => m.id === movie.id);
  
  const handleWatchlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(toggleWatchlist(movie));
  };

  const sizeClasses = {
    small: 'w-40',
    medium: 'w-48',
    large: 'w-56'
  };

  const imageSize = {
    small: 'h-60',
    medium: 'h-72',
    large: 'h-80'
  };

  return (
    <Card className={`${sizeClasses[size]} card-gradient border-border/50 hover:border-primary/50 transition-smooth group overflow-hidden`}>
      <Link to={`/movie/${movie.id}`} className="block">
        <div className="relative">
          <img
            src={getPosterUrl(movie.poster_path)}
            alt={movie.title}
            className={`w-full ${imageSize[size]} object-cover transition-smooth group-hover:scale-105`}
            loading="lazy"
          />
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-smooth">
            <div className="absolute bottom-4 left-4 right-4">
              <div className="flex items-center justify-between">
                <Play className="h-8 w-8 text-white" />
                {showWatchlistButton && (
                  <Button
                    size="sm"
                    variant={isInWatchlist ? "default" : "secondary"}
                    onClick={handleWatchlistToggle}
                    className="transition-bounce"
                  >
                    <Heart 
                      className={`h-4 w-4 ${isInWatchlist ? 'fill-current' : ''}`} 
                    />
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Rating Badge */}
          <div className="absolute top-2 right-2">
            <Badge variant="secondary" className="bg-black/70 text-white">
              <Star className="h-3 w-3 mr-1 fill-current text-cinema-gold" />
              {movie.vote_average.toFixed(1)}
            </Badge>
          </div>
        </div>

        <CardContent className="p-4">
          <h3 className="font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-smooth">
            {movie.title}
          </h3>
          
          <div className="flex items-center text-sm text-muted-foreground mb-2">
            <Calendar className="h-3 w-3 mr-1" />
            {new Date(movie.release_date).getFullYear()}
          </div>
          
          <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
            {movie.overview}
          </p>
        </CardContent>
      </Link>
    </Card>
  );
};

export default MovieCard;