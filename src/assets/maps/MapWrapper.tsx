import React, { useEffect, useState } from 'react';

interface MapWrapperProps {
  children: React.ReactNode;
}

/**
 * A wrapper component that ensures Leaflet maps are only rendered on the client side
 * This helps avoid the "Context.Consumer" errors that occur when trying to render
 * Leaflet maps during server-side rendering or when the DOM is not available
 */
const MapWrapper: React.FC<MapWrapperProps> = ({ children }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  if (!isMounted) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-500">
        Loading map...
      </div>
    );
  }

  return <>{children}</>;
};

export default MapWrapper; 