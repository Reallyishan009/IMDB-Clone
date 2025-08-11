import React, { useEffect, useState, useRef } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { Star, Calendar, Clock, Heart, Play, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchMovieDetails, clearMovieDetails } from '../store/slices/moviesSlice';
import { toggleWatchlist } from '../store/slices/watchlistSlice';
import { getBackdropUrl, getPosterUrl } from '../services/tmdbApi';
import LoadingSpinner from '../components/LoadingSpinner';
import YouTube from 'react-youtube';

const MovieDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation(); // ✅ detect hash
  const dispatch = useAppDispatch();
  const { movieDetails } = useAppSelector(state => state.movies);
  const { movies: watchlistMovies } = useAppSelector(state => state.watchlist);
  
  const [selectedTrailer, setSelectedTrailer] = useState<string | null>(null);
  const trailerSectionRef = useRef<HTMLDivElement>(null);

  const scrollToTrailer = () => {
    trailerSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  useEffect(() => {
    if (id) {
      dispatch(fetchMovieDetails(parseInt(id)));
    }
    return () => {
      dispatch(clearMovieDetails());
    };
  }, [id, dispatch]);

  useEffect(() => {
    if (movieDetails.videos.length > 0) {
      const trailer = movieDetails.videos.find(video => 
        video.type === 'Trailer' && video.site === 'YouTube'
      ) || movieDetails.videos[0];
      setSelectedTrailer(trailer?.key || null);
    }
  }, [movieDetails.videos]);

  // ✅ Auto-scroll on page load if #trailer is in URL
  useEffect(() => {
    if (!movieDetails.loading && trailerSectionRef.current) {
      if (location.hash === '#trailer') {
        setTimeout(() => {
          scrollToTrailer();
        }, 300); // allow render first
      }
    }
  }, [movieDetails.loading, location]);

  if (movieDetails.loading) return <LoadingSpinner />;

  if (!movieDetails.movie) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl text-muted-foreground">Movie not found</h1>
      </div>
    );
  }

  const { movie, videos } = movieDetails;
  const isInWatchlist = watchlistMovies.some(m => m.id === movie.id);
  const trailers = videos.filter(video => 
    video.type === 'Trailer' && video.site === 'YouTube'
  );

  const handleWatchlistToggle = () => dispatch(toggleWatchlist(movie));

  const formatRuntime = (minutes: number) =>
    `${Math.floor(minutes / 60)}h ${minutes % 60}m`;

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency', currency: 'USD'
    }).format(amount);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div 
        className="relative h-screen bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.4), rgba(0,0,0,0.8)), url(${getBackdropUrl(movie.backdrop_path, 'original')})`
        }}
      >
        <div className="absolute inset-0 hero-gradient" />
        <div className="relative container mx-auto px-4 h-full flex items-center">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full">
            
            {/* Poster */}
            <div className="lg:col-span-1">
              <img
                src={getPosterUrl(movie.poster_path, 'w780')}
                alt={movie.title}
                className="w-full max-w-md mx-auto rounded-lg card-shadow"
              />
            </div>
            
            {/* Movie Info */}
            <div className="lg:col-span-2 text-white">
              <Link to="/movies" className="inline-flex items-center text-cinema-silver hover:text-white mb-4">
                <ArrowLeft className="h-4 w-4 mr-2" /> Back to Movies
              </Link>
              <h1 className="text-5xl font-bold mb-4">{movie.title}</h1>
              {movie.tagline && <p className="text-xl italic mb-6">{movie.tagline}</p>}
              
              <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex items-center">
                  <Star className="h-5 w-5 mr-1 text-cinema-gold" />
                  <span>{movie.vote_average.toFixed(1)}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 mr-1" />
                  <span>{new Date(movie.release_date).getFullYear()}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-5 w-5 mr-1" />
                  <span>{formatRuntime(movie.runtime)}</span>
                </div>
              </div>
              
              {/* Genres */}
              <div className="flex flex-wrap gap-2 mb-6">
                {movie.genres.map((genre) => (
                  <Badge key={genre.id} variant="secondary" className="bg-white/10 text-white">
                    {genre.name}
                  </Badge>
                ))}
              </div>
              
              <p className="text-lg mb-8 max-w-3xl">{movie.overview}</p>
              
              <div className="flex flex-wrap gap-4">
                <Button size="lg" onClick={handleWatchlistToggle} variant={isInWatchlist ? "default" : "secondary"}>
                  <Heart className={`h-5 w-5 mr-2 ${isInWatchlist ? 'fill-current' : ''}`} />
                  {isInWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
                </Button>
                {selectedTrailer && (
                  <Button size="lg" variant="outline" onClick={scrollToTrailer}>
                    <Play className="h-5 w-5 mr-2" /> Watch Trailer
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trailers Section */}
      {trailers.length > 0 && (
        <section ref={trailerSectionRef} id="trailer" className="py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8">Trailers</h2>
            {selectedTrailer && (
              <div className="mb-8">
                <div className="aspect-video max-w-4xl mx-auto">
                  <YouTube
                    videoId={selectedTrailer}
                    opts={{
                      height: '500',
                      width: '1000',
                      playerVars: { autoplay: 1, mute: 1 }
                    }}
                  />
                </div>
              </div>
            )}
            {/* Trailer List */}
            {trailers.length > 1 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {trailers.map((trailer) => (
                  <Card key={trailer.id} onClick={() => setSelectedTrailer(trailer.key)}
                    className={`cursor-pointer ${selectedTrailer === trailer.key ? 'border-primary' : ''}`}>
                    <CardContent className="p-4 flex justify-between">
                      <div>
                        <h3 className="font-medium">{trailer.name}</h3>
                        <p className="text-sm text-muted-foreground">{trailer.type}</p>
                      </div>
                      <Play className="h-5 w-5 text-primary" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
};

export default MovieDetails;
