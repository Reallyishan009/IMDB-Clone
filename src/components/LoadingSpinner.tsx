import React from 'react';
import { Loader2, Film } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  text?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'medium',
  text = 'Loading...'
}) => {
  const sizeClasses = {
    small: 'h-4 w-4',
    medium: 'h-8 w-8',
    large: 'h-12 w-12'
  };

  const textSizeClasses = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg'
  };

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="relative mb-4">
        <Film className={`${sizeClasses[size]} text-primary animate-pulse`} />
        <Loader2 className={`${sizeClasses[size]} text-accent animate-spin absolute inset-0`} />
      </div>
      <p className={`${textSizeClasses[size]} text-muted-foreground font-medium`}>
        {text}
      </p>
    </div>
  );
};

export default LoadingSpinner;