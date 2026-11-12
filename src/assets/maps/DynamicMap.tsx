import React, { useEffect, useState } from 'react';
import L from 'leaflet';

interface DynamicMapProps {
  center: [number, number];
  zoom: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}

const DynamicMap: React.FC<DynamicMapProps> = ({ center, zoom, children, style }) => {
  const [isMounted, setIsMounted] = useState(false);
  const [MapContainer, setMapContainer] = useState<any>(null);
  const [TileLayer, setTileLayer] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('react-leaflet').then(({ MapContainer, TileLayer }) => {
        setMapContainer(() => MapContainer);
        setTileLayer(() => TileLayer);
        setIsMounted(true);
      });
    }
  }, []);

  if (!isMounted || !MapContainer || !TileLayer) {
    return (
      <div 
        style={style || { height: '100%', width: '100%', borderRadius: '0.5rem' }}
        className="flex items-center justify-center bg-gray-100 text-gray-500"
      >
        Loading map...
      </div>
    );
  }

  return (
    <MapContainer 
      center={center} 
      zoom={zoom} 
      style={style || { height: '100%', width: '100%', borderRadius: '0.5rem' }}
      zoomControl={false}
      attributionControl={false}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {children}
    </MapContainer>
  );
};

export default DynamicMap; 