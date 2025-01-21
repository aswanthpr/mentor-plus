import React, { useState, ReactNode, useEffect } from 'react';
import ErrorBound from '../../../pages/Error/ErrorBound';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode; // Optional custom fallback UI
}

const ErrorBoundary: React.FC<ErrorBoundaryProps> = ({ children, fallback }) => {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const errorHandler = (event: ErrorEvent) => {
      setHasError(true);
      console.error('Error caught by ErrorBoundary:', event.error);
    };

    // Add global error listener
    window.addEventListener('error', errorHandler);

    return () => {
      // Cleanup listener on unmount
      window.removeEventListener('error', errorHandler);
    };
  }, []);

  if (hasError) {
    return <>{fallback ||<ErrorBound/>}</>;
  }

  return <>{children}</>;  
};

export default ErrorBoundary;