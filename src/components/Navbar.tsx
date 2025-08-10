import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, Film, Heart, Home, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { searchMovies, clearSearch } from '../store/slices/moviesSlice';

const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { movies: watchlistMovies } = useAppSelector(state => state.watchlist);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      dispatch(searchMovies({ query: searchQuery.trim() }));
      navigate('/movies');
      setSearchQuery('');
    }
  };

  const clearSearchResults = () => {
    dispatch(clearSearch());
  };

  const navLinks = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/movies', label: 'Movies', icon: Film },
    { path: '/watchlist', label: 'Watchlist', icon: Heart },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2" onClick={clearSearchResults}>
            <Film className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-foreground">IMDb Clone</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map(({ path, label, icon: Icon }) => {
              const isActive = location.pathname === path;
              return (
                <Link
                  key={path}
                  to={path}
                  onClick={clearSearchResults}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-smooth ${
                    isActive
                      ? 'text-primary bg-primary/10'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{label}</span>
                  {path === '/watchlist' && watchlistMovies.length > 0 && (
                    <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                      {watchlistMovies.length}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hidden sm:flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search movies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-64 bg-muted/50"
              />
            </div>
            <Button type="submit" size="sm" variant="secondary">
              Search
            </Button>
          </form>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="space-y-4">
              {/* Mobile Search */}
              <form onSubmit={handleSearch} className="flex items-center space-x-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search movies..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-muted/50"
                  />
                </div>
                <Button type="submit" size="sm" variant="secondary">
                  Search
                </Button>
              </form>

              {/* Mobile Navigation Links */}
              <div className="space-y-2">
                {navLinks.map(({ path, label, icon: Icon }) => {
                  const isActive = location.pathname === path;
                  return (
                    <Link
                      key={path}
                      to={path}
                      onClick={() => {
                        clearSearchResults();
                        setIsMenuOpen(false);
                      }}
                      className={`flex items-center space-x-3 px-3 py-3 rounded-md transition-smooth ${
                        isActive
                          ? 'text-primary bg-primary/10'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{label}</span>
                      {path === '/watchlist' && watchlistMovies.length > 0 && (
                        <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full ml-auto">
                          {watchlistMovies.length}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;