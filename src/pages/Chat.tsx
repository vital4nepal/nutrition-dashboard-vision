import React from 'react';
import PageWrapper from '@/components/Layout/PageWrapper';
import { usePageTitle } from '@/hooks/usePageTitle';
import logo from '../nutrition_logo333.png';

const Chat = () => {
  usePageTitle('Chat with Us');
  return (
    <PageWrapper title="Chat with Us">
    {/* End of Selection */}
      <header className="flex justify-between items-center p-4 bg-white shadow-sm">
        <img src={logo} alt="Logo" className="h-8" />
        <div className="flex space-x-4">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-600">
            Facebook
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-400">
            Twitter
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-pink-500">
            Instagram
          </a>
        </div>
      </header>
      <div className="flex justify-center items-center h-screen">
        <h1 className="text-2xl font-semibold text-gray-700">Chat with Us</h1>
      </div>
      <footer className="bg-white p-4 border-t shadow-sm">
        <div className="text-center text-sm text-gray-500">
          <p>© 2001-2025 LeapFrog Enterprises, Inc. All rights reserved.</p>
          <div className="flex justify-center space-x-4 mt-2">
            <a href="/policy" className="hover:underline">Policy</a>
            <a href="/security" className="hover:underline">Security</a>
            <a href="/terms" className="hover:underline">Terms of Service</a>
          </div>
        </div>
      </footer>
    </PageWrapper>
  );
};

export default Chat; 