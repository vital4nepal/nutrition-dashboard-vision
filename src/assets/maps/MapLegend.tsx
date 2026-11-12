import React from 'react';

const MapLegend = () => {
  return (
    <div className="flex flex-wrap gap-4 mt-2 justify-center text-xs">
      <div className="flex items-center">
        <div className="w-3 h-3 rounded-full bg-blue-500 mr-1"></div>
        <span>Provincial Capital</span>
      </div>
      <div className="flex items-center">
        <div className="w-3 h-3 rounded-full bg-red-500 mr-1"></div>
        <span>Major City</span>
      </div>
      <div className="flex items-center">
        <div className="w-8 h-3 bg-green-100 border border-green-500 mr-1"></div>
        <span>Province Boundary</span>
      </div>
    </div>
  );
};

export default MapLegend; 