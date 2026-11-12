import React from 'react';

interface StaticMapProps {
  type: 'nepal' | 'province';
  province?: number;
}

/**
 * A static map component that displays an image of Nepal or a province
 * This is a fallback for when Leaflet maps cannot be rendered
 */
const StaticMap: React.FC<StaticMapProps> = ({ type, province = 1 }) => {
  // Map title based on type and province
  const getMapTitle = () => {
    if (type === 'nepal') {
      return 'Nepal';
    } else {
      const provinceNames: Record<number, string> = {
        1: 'Province 1',
        2: 'Province 2',
        3: 'Bagmati',
        4: 'Gandaki',
        5: 'Lumbini',
        6: 'Karnali',
        7: 'Sudurpashchim'
      };
      return provinceNames[province] || `Province ${province}`;
    }
  };

  // Background color based on province
  const getBackgroundColor = () => {
    if (type === 'nepal') {
      return 'bg-green-50';
    }
    
    const colors = [
      'bg-green-50', // Province 1
      'bg-amber-50', // Province 2
      'bg-blue-50',  // Bagmati
      'bg-pink-50',  // Gandaki
      'bg-green-50', // Lumbini
      'bg-amber-50', // Karnali
      'bg-blue-50',  // Sudurpashchim
    ];
    
    return colors[province - 1] || 'bg-green-50';
  };

  return (
    <div className={`w-full h-full ${getBackgroundColor()} rounded-lg flex flex-col items-center justify-center border border-gray-200`}>
      <div className="text-lg font-semibold text-gray-700 mb-2">{getMapTitle()}</div>
      <div className="text-sm text-gray-500">
        {type === 'nepal' ? 'National Overview' : 'Provincial View'}
      </div>
      
      {/* Display major cities */}
      <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-gray-600">
        {type === 'nepal' && (
          <>
            <div className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-blue-500 mr-1"></div>
              <span>Kathmandu (Capital)</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-red-500 mr-1"></div>
              <span>Pokhara</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-red-500 mr-1"></div>
              <span>Biratnagar</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-red-500 mr-1"></div>
              <span>Birgunj</span>
            </div>
          </>
        )}
        
        {type === 'province' && province === 1 && (
          <>
            <div className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-blue-500 mr-1"></div>
              <span>Biratnagar (Capital)</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-red-500 mr-1"></div>
              <span>Dharan</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-red-500 mr-1"></div>
              <span>Ilam</span>
            </div>
          </>
        )}
        
        {type === 'province' && province === 3 && (
          <>
            <div className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-blue-500 mr-1"></div>
              <span>Kathmandu (Capital)</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-red-500 mr-1"></div>
              <span>Bhaktapur</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-red-500 mr-1"></div>
              <span>Lalitpur</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default StaticMap; 