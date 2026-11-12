import React from 'react';
import Footer from './Footer';

interface PageWrapperProps {
  children: React.ReactNode;
  title?: string;
}

const PageWrapper = ({ children, title }: PageWrapperProps) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pt-16">
      <div className="container mx-auto px-4 py-6 animate-fadeIn flex-grow">
        {title && (
          <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6">
            {title}
          </h1>
        )}
        {children}
      </div>
      <Footer />
    </div>
  );
};

export default PageWrapper;
