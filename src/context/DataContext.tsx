import React, { createContext, useContext, useState, ReactNode } from 'react';
import { childrenOutputData as initialChildrenData, 
         maternalOutputData as initialMaternalData,
         inputMetrics as initialInputMetrics,
         impactMetrics as initialImpactMetrics } from '@/data/outputData';
import { NutritionDataRow } from '@/utils/excelProcessor';

// Define the shape of our context
interface DataContextType {
  childrenData: any[];
  maternalData: any[];
  inputMetrics: any[];
  impactMetrics: any[];
  updateChildrenData: (newData: any[]) => void;
  updateMaternalData: (newData: any[]) => void;
  updateInputMetrics: (newData: any[]) => void;
  updateImpactMetrics: (newData: any[]) => void;
  importData: (data: NutritionDataRow[]) => void;
}

// Create the context with a default value
const DataContext = createContext<DataContextType | undefined>(undefined);

// Provider component
export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [childrenData, setChildrenData] = useState(initialChildrenData);
  const [maternalData, setMaternalData] = useState(initialMaternalData);
  const [inputMetrics, setInputMetrics] = useState(initialInputMetrics);
  const [impactMetrics, setImpactMetrics] = useState(initialImpactMetrics);

  const updateChildrenData = (newData: any[]) => {
    setChildrenData(newData);
  };

  const updateMaternalData = (newData: any[]) => {
    setMaternalData(newData);
  };

  const updateInputMetrics = (newData: any[]) => {
    setInputMetrics(newData);
  };

  const updateImpactMetrics = (newData: any[]) => {
    setImpactMetrics(newData);
  };

  // Function to import data from Excel
  const importData = (data: NutritionDataRow[]) => {
    // Process the imported data and update the appropriate state
    data.forEach(row => {
      const { indicator, value } = row;
      
      // Map indicators to the appropriate data category
      // Children data indicators
      if (indicator.toLowerCase().includes('weight & height') || 
          indicator.toLowerCase().includes('measured')) {
        updateChildrenData(prev => {
          const newData = [...prev];
          const index = newData.findIndex(item => item.name === 'Weight & Height Measured');
          if (index !== -1) {
            newData[index] = { ...newData[index], value };
          }
          return newData;
        });
      } 
      else if (indicator.toLowerCase().includes('counseling') && 
               !indicator.toLowerCase().includes('maternal')) {
        updateChildrenData(prev => {
          const newData = [...prev];
          const index = newData.findIndex(item => item.name === 'Counseling Sessions');
          if (index !== -1) {
            newData[index] = { ...newData[index], value };
          }
          return newData;
        });
      }
      else if (indicator.toLowerCase().includes('malnutrition') || 
               indicator.toLowerCase().includes('treated')) {
        updateChildrenData(prev => {
          const newData = [...prev];
          const index = newData.findIndex(item => item.name === 'Treated for Malnutrition');
          if (index !== -1) {
            newData[index] = { ...newData[index], value };
          }
          return newData;
        });
      }
      
      // Maternal data indicators
      else if (indicator.toLowerCase().includes('ifa') || 
               indicator.toLowerCase().includes('anc')) {
        updateMaternalData(prev => {
          const newData = [...prev];
          const index = newData.findIndex(item => item.name === 'IFA During ANC');
          if (index !== -1) {
            newData[index] = { ...newData[index], value };
          }
          return newData;
        });
      }
      else if (indicator.toLowerCase().includes('nutrition') && 
               indicator.toLowerCase().includes('counseling')) {
        updateMaternalData(prev => {
          const newData = [...prev];
          const index = newData.findIndex(item => item.name === 'Nutrition Counseling');
          if (index !== -1) {
            newData[index] = { ...newData[index], value };
          }
          return newData;
        });
      }
      else if (indicator.toLowerCase().includes('weight') && 
               indicator.toLowerCase().includes('monitoring')) {
        updateMaternalData(prev => {
          const newData = [...prev];
          const index = newData.findIndex(item => item.name === 'Weight Monitoring');
          if (index !== -1) {
            newData[index] = { ...newData[index], value };
          }
          return newData;
        });
      }
      
      // Input metrics indicators
      else if (indicator.toLowerCase().includes('districts') || 
               indicator.toLowerCase().includes('facilities reporting')) {
        // For simplicity, we're just updating the value, not the percentage
        updateInputMetrics(prev => {
          const newData = [...prev];
          const index = newData.findIndex(item => item.title === 'Districts/Facilities Reporting');
          if (index !== -1) {
            const percentage = Math.round((value / parseInt(newData[index].total)) * 100) + '%';
            newData[index] = { ...newData[index], value: value.toString(), percentage };
          }
          return newData;
        });
      }
      else if (indicator.toLowerCase().includes('ifa supply')) {
        updateInputMetrics(prev => {
          const newData = [...prev];
          const index = newData.findIndex(item => item.title === 'Facilities with IFA Supply');
          if (index !== -1) {
            const percentage = Math.round((value / parseInt(newData[index].total)) * 100) + '%';
            newData[index] = { ...newData[index], value: value.toString(), percentage };
          }
          return newData;
        });
      }
      else if (indicator.toLowerCase().includes('supervised')) {
        updateInputMetrics(prev => {
          const newData = [...prev];
          const index = newData.findIndex(item => item.title === 'Supervised Facilities');
          if (index !== -1) {
            const percentage = Math.round((value / parseInt(newData[index].total)) * 100) + '%';
            newData[index] = { ...newData[index], value: value.toString(), percentage };
          }
          return newData;
        });
      }
      else if (indicator.toLowerCase().includes('ibal vita')) {
        updateInputMetrics(prev => {
          const newData = [...prev];
          const index = newData.findIndex(item => item.title === 'Facilities with Ibal Vita');
          if (index !== -1) {
            const percentage = Math.round((value / parseInt(newData[index].total)) * 100) + '%';
            newData[index] = { ...newData[index], value: value.toString(), percentage };
          }
          return newData;
        });
      }
      
      // Impact metrics indicators
      else if (indicator.toLowerCase().includes('stunting')) {
        updateImpactMetrics(prev => {
          const newData = [...prev];
          const index = newData.findIndex(item => item.label === 'Prevalence of Stunting');
          if (index !== -1) {
            newData[index] = { ...newData[index], current: value };
          }
          return newData;
        });
      }
      else if (indicator.toLowerCase().includes('anaemia')) {
        updateImpactMetrics(prev => {
          const newData = [...prev];
          const index = newData.findIndex(item => item.label === 'Prevalence of Anaemia');
          if (index !== -1) {
            newData[index] = { ...newData[index], current: value };
          }
          return newData;
        });
      }
      else if (indicator.toLowerCase().includes('wasting')) {
        updateImpactMetrics(prev => {
          const newData = [...prev];
          const index = newData.findIndex(item => item.label === 'Prevalence of Wasting');
          if (index !== -1) {
            newData[index] = { ...newData[index], current: value };
          }
          return newData;
        });
      }
      else if (indicator.toLowerCase().includes('breastfeeding')) {
        updateImpactMetrics(prev => {
          const newData = [...prev];
          const index = newData.findIndex(item => item.label === 'Exclusive Breastfeeding');
          if (index !== -1) {
            newData[index] = { ...newData[index], current: value };
          }
          return newData;
        });
      }
    });
  };

  return (
    <DataContext.Provider value={{
      childrenData,
      maternalData,
      inputMetrics,
      impactMetrics,
      updateChildrenData,
      updateMaternalData,
      updateInputMetrics,
      updateImpactMetrics,
      importData
    }}>
      {children}
    </DataContext.Provider>
  );
};

// Custom hook to use the data context
export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}; 