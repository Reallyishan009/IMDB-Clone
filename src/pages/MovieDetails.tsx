import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
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
import { Link } from 'react-router-dom';

const MovieDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const { movieDetails } = useAppSelector(state => state.movies);
  const { movies: watchlistMovies } = useAppSelector(state => state.watchlist);
  
  const [selectedTrailer, setSelectedTrailer] = useState<string | null>(null);

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

  if (movieDetails.loading) {
    return <LoadingSpinner />;
  }

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

  const handleWatchlistToggle = () => {
    dispatch(toggleWatchlist(movie));
  };

  const formatRuntime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

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
              <Link to="/movies" className="inline-flex items-center text-cinema-silver hover:text-white mb-4 transition-smooth">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Movies
              </Link>
              
              <h1 className="text-5xl font-bold mb-4">{movie.title}</h1>
              
              {movie.tagline && (
                <p className="text-xl text-cinema-silver italic mb-6">{movie.tagline}</p>
              )}
              
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <div className="flex items-center">
                  <Star className="h-5 w-5 mr-1 fill-current text-cinema-gold" />
                  <span className="text-lg font-semibold">{movie.vote_average.toFixed(1)}</span>
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
              
              <p className="text-lg leading-relaxed mb-8 max-w-3xl">
                {movie.overview}
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Button
                  size="lg"
                  onClick={handleWatchlistToggle}
                  variant={isInWatchlist ? "default" : "secondary"}
                  className="transition-bounce"
                >
                  <Heart className={`h-5 w-5 mr-2 ${isInWatchlist ? 'fill-current' : ''}`} />
                  {isInWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
                </Button>
                
                {selectedTrailer && (
                  <Button size="lg" variant="outline" className="bg-white/10 text-white border-white/20 hover:bg-white/20">
                    <Play className="h-5 w-5 mr-2" />
                    Watch Trailer
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Trailers Section */}
      {trailers.length > 0 && (
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-foreground mb-8">Trailers</h2>
            
            {/* Main Trailer */}
            {selectedTrailer && (
              <div className="mb-8">
                <div className="aspect-video max-w-4xl mx-auto">
                  <YouTube
                    videoId={selectedTrailer}
                    opts={{
                      width: '100%',
                      height: '100%',
                      playerVars: {
                        autoplay: 0,
                        controls: 1,
                        rel: 0,
                        showinfo: 0,
                        modestbranding: 1,
                      },
                    }}
                    className="w-full h-full rounded-lg overflow-hidden"
                  />
                </div>
              </div>
            )}
            
            {/* Trailer List */}
            {trailers.length > 1 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {trailers.map((trailer) => (
                  <Card 
                    key={trailer.id}
                    className={`card-gradient border-border/50 hover:border-primary/50 transition-smooth cursor-pointer ${
                      selectedTrailer === trailer.key ? 'border-primary' : ''
                    }`}
                    onClick={() => setSelectedTrailer(trailer.key)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium text-foreground mb-1">{trailer.name}</h3>
                          <p className="text-sm text-muted-foreground">{trailer.type}</p>
                        </div>
                        <Play className="h-5 w-5 text-primary" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>
      )}
      
      {/* Movie Details */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-foreground mb-8">Details</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="card-gradient border-border/50">
              <CardContent className="p-6">
                <h3 className="font-semibold text-foreground mb-4">Production</h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Status:</span>
                    <span className="ml-2 text-foreground">{movie.status}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Budget:</span>
                    <span className="ml-2 text-foreground">
                      {movie.budget > 0 ? formatCurrency(movie.budget) : 'N/A'}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Revenue:</span>
                    <span className="ml-2 text-foreground">
                      {movie.revenue > 0 ? formatCurrency(movie.revenue) : 'N/A'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="card-gradient border-border/50">
              <CardContent className="p-6">
                <h3 className="font-semibold text-foreground mb-4">Languages</h3>
                <div className="space-y-2">
                  {movie.spoken_languages.map((lang, index) => (
                    <Badge key={index} variant="outline">
                      {lang.english_name}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {movie.production_companies.length > 0 && (
              <Card className="card-gradient border-border/50">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-foreground mb-4">Production Companies</h3>
                  <div className="space-y-2">
                    {movie.production_companies.slice(0, 5).map((company) => (
                      <div key={company.id} className="text-sm text-foreground">
                        {company.name}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default MovieDetails;