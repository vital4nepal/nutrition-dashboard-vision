import React, { useEffect, useState } from 'react';
import { GeoJSON, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import DynamicMap from './DynamicMap';

// Fix for default marker icons in Leaflet with webpack
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// Major cities in Nepal with their coordinates
const cities = [
  { name: 'Kathmandu', position: [27.7172, 85.3240] as [number, number], isCapital: true },
  { name: 'Pokhara', position: [28.2096, 83.9856] as [number, number], isCapital: false },
  { name: 'Biratnagar', position: [26.4525, 87.2718] as [number, number], isCapital: false },
  { name: 'Birgunj', position: [27.0128, 84.8780] as [number, number], isCapital: false },
  { name: 'Janakpur', position: [26.7271, 85.9406] as [number, number], isCapital: false },
  { name: 'Dhangadhi', position: [28.7041, 80.5986] as [number, number], isCapital: false },
  { name: 'Nepalgunj', position: [28.0500, 81.6167] as [number, number], isCapital: false },
  { name: 'Butwal', position: [27.7006, 83.4482] as [number, number], isCapital: false },
  { name: 'Surkhet', position: [28.6019, 81.6340] as [number, number], isCapital: false },
];

// Custom style function for GeoJSON
const provinceStyle = (feature: any) => {
  const provinceId = feature.properties.id;
  
  // Different colors for each province
  const colors = [
    '#E5F2E5', // Province 1
    '#FEF3C7', // Province 2
    '#DBEAFE', // Bagmati
    '#FCE7F3', // Gandaki
    '#E5F2E5', // Lumbini
    '#FEF3C7', // Karnali
    '#DBEAFE', // Sudurpashchim
  ];
  
  return {
    fillColor: colors[provinceId - 1] || '#E5F2E5',
    weight: 2,
    opacity: 1,
    color: '#22C55E',
    dashArray: '3',
    fillOpacity: 0.7
  };
};

const NepalMap = () => {
  const [geoJsonData, setGeoJsonData] = useState<any>(null);
  const [mapComponents, setMapComponents] = useState<any>(null);
  
  // Load GeoJSON data
  useEffect(() => {
    fetch('/geojson/nepal-provinces.json')
      .then(response => response.json())
      .then(data => {
        setGeoJsonData(data);
      })
      .catch(error => {
        console.error('Error loading GeoJSON data:', error);
      });
      
    // Dynamically import react-leaflet components
    if (typeof window !== 'undefined') {
      import('react-leaflet').then((module) => {
        setMapComponents(module);
      });
    }
  }, []);

  // Event handlers for GeoJSON features
  const onEachFeature = (feature: any, layer: any) => {
    if (feature.properties && feature.properties.name) {
      layer.bindTooltip(feature.properties.name, { 
        permanent: false, 
        direction: 'center',
        className: 'province-tooltip'
      });
      
      layer.on({
        mouseover: (e: any) => {
          const layer = e.target;
          layer.setStyle({
            weight: 3,
            color: '#3B82F6',
            dashArray: '',
            fillOpacity: 0.9
          });
          layer.bringToFront();
        },
        mouseout: (e: any) => {
          const layer = e.target;
          layer.setStyle(provinceStyle(feature));
        },
        click: (e: any) => {
          // You can add click behavior here if needed
        }
      });
    }
  };

  // Create custom icon for cities
  const createCityIcon = (isCapital: boolean) => {
    return L.divIcon({
      className: 'custom-div-icon',
      html: `<div class="marker-pin ${isCapital ? 'capital' : ''}"></div>`,
      iconSize: [30, 30],
      iconAnchor: [15, 15]
    });
  };

  // Define map center and zoom level
  const center: [number, number] = [28.3949, 84.1240];
  const zoom = 7;

  return (
    <div className="w-full h-full">
      <DynamicMap center={center} zoom={zoom}>
        {geoJsonData && mapComponents && (
          <>
            <GeoJSON 
              data={geoJsonData} 
              style={provinceStyle}
              onEachFeature={onEachFeature}
            />
            
            {cities.map((city, index) => (
              <Marker 
                key={index} 
                position={city.position}
                icon={createCityIcon(city.isCapital)}
              >
                <Popup>{city.name}</Popup>
              </Marker>
            ))}
          </>
        )}
      </DynamicMap>
      
      {/* Add custom CSS for markers */}
      <style dangerouslySetInnerHTML={{
        __html: `
        .marker-pin {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: #EF4444;
        }
        .marker-pin.capital {
          width: 10px;
          height: 10px;
          background-color: #3B82F6;
        }
        .province-tooltip {
          background: white;
          border: 1px solid #22C55E;
          border-radius: 4px;
          padding: 2px 5px;
          font-size: 12px;
          font-weight: bold;
        }
      `}} />
    </div>
  );
};

export default NepalMap; 