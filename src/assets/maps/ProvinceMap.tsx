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

interface ProvinceMapProps {
  province: string | number;
}

const ProvinceMap: React.FC<ProvinceMapProps> = ({ province }) => {
  const [geoJsonData, setGeoJsonData] = useState<any>(null);
  const [selectedProvince, setSelectedProvince] = useState<any>(null);
  const [mapComponents, setMapComponents] = useState<any>(null);
  
  // Load GeoJSON data
  useEffect(() => {
    fetch('/geojson/nepal-provinces.json')
      .then(response => response.json())
      .then(data => {
        setGeoJsonData(data);
        
        // Find the selected province
        const provinceFeature = data.features.find((feature: any) => 
          String(feature.properties.id) === String(province)
        );
        
        if (provinceFeature) {
          setSelectedProvince(provinceFeature);
        }
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
  }, [province]);

  // Get province data
  const getProvinceData = () => {
    if (!selectedProvince) return null;
    
    const provinceId = selectedProvince.properties.id;
    const provinceName = selectedProvince.properties.name;
    const capital = selectedProvince.properties.capital;
    
    // Get province center coordinates (approximate)
    const bounds = L.geoJSON(selectedProvince).getBounds();
    const center = bounds.getCenter();
    
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
    
    // Major cities for each province
    const provinceCities: Record<number, any[]> = {
      1: [
        { name: 'Biratnagar', position: [26.4525, 87.2718] as [number, number], isCapital: true },
        { name: 'Dharan', position: [26.8065, 87.2846] as [number, number], isCapital: false },
        { name: 'Ilam', position: [26.9112, 87.9237] as [number, number], isCapital: false }
      ],
      2: [
        { name: 'Janakpur', position: [26.7271, 85.9406] as [number, number], isCapital: true },
        { name: 'Birgunj', position: [27.0128, 84.8780] as [number, number], isCapital: false },
        { name: 'Lahan', position: [26.7213, 86.4951] as [number, number], isCapital: false }
      ],
      3: [
        { name: 'Kathmandu', position: [27.7172, 85.3240] as [number, number], isCapital: true },
        { name: 'Bhaktapur', position: [27.6710, 85.4298] as [number, number], isCapital: false },
        { name: 'Lalitpur', position: [27.6588, 85.3247] as [number, number], isCapital: false }
      ],
      4: [
        { name: 'Pokhara', position: [28.2096, 83.9856] as [number, number], isCapital: true },
        { name: 'Gorkha', position: [28.0000, 84.6333] as [number, number], isCapital: false },
        { name: 'Syangja', position: [28.0667, 83.8667] as [number, number], isCapital: false }
      ],
      5: [
        { name: 'Butwal', position: [27.7006, 83.4482] as [number, number], isCapital: true },
        { name: 'Nepalgunj', position: [28.0500, 81.6167] as [number, number], isCapital: false },
        { name: 'Dang', position: [28.1500, 82.3000] as [number, number], isCapital: false }
      ],
      6: [
        { name: 'Surkhet', position: [28.6019, 81.6340] as [number, number], isCapital: true },
        { name: 'Jumla', position: [29.2752, 82.1838] as [number, number], isCapital: false },
        { name: 'Dailekh', position: [28.8428, 81.7100] as [number, number], isCapital: false }
      ],
      7: [
        { name: 'Dhangadhi', position: [28.7041, 80.5986] as [number, number], isCapital: true },
        { name: 'Mahendranagar', position: [28.9640, 80.1800] as [number, number], isCapital: false },
        { name: 'Dadeldhura', position: [29.3000, 80.5800] as [number, number], isCapital: false }
      ]
    };
    
    return {
      id: provinceId,
      name: provinceName,
      capital: capital,
      center: [center.lat, center.lng] as [number, number],
      color: colors[provinceId - 1] || '#E5F2E5',
      cities: provinceCities[provinceId] || []
    };
  };

  // Province style
  const provinceStyle = () => {
    const provinceData = getProvinceData();
    if (!provinceData) return {};
    
    return {
      fillColor: provinceData.color,
      weight: 2,
      opacity: 1,
      color: '#22C55E',
      dashArray: '3',
      fillOpacity: 0.7
    };
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

  const provinceData = getProvinceData();
  
  if (!provinceData) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-500">
        Loading province map...
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      <DynamicMap center={provinceData.center} zoom={8}>
        {selectedProvince && mapComponents && (
          <>
            <GeoJSON 
              data={selectedProvince} 
              style={provinceStyle}
            />
            
            {provinceData.cities.map((city, index) => (
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
      `}} />
    </div>
  );
};

export default ProvinceMap; 