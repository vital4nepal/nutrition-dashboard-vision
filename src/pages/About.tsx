import React from 'react';
import PageWrapper from '@/components/Layout/PageWrapper';
import { usePageTitle } from '@/hooks/usePageTitle';
import { Mail, Phone, MapPin } from 'lucide-react';

const About = () => {
  usePageTitle('About Us');
  return (
    <PageWrapper title="About Us">
      <div className="space-y-8">
        {/* Mission & Vision Section */}
        <section className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold text-[#22C55E] mb-4">Our Mission</h2>
          <p className="text-gray-600 mb-6">
            NutriPulse Nepal is dedicated to improving nutrition outcomes across Nepal through data-driven insights and actionable intelligence. Our mission is to empower policymakers, health workers, and stakeholders with real-time nutrition data to make informed decisions and drive positive change in community health.
          </p>
          
          <h2 className="text-xl font-semibold text-[#22C55E] mb-4">Our Vision</h2>
          <p className="text-gray-600">
            We envision a Nepal where every child and mother has access to optimal nutrition, supported by evidence-based interventions and community-driven initiatives. Through our innovative dashboard, we aim to bridge the gap between data collection and action, fostering a healthier future for all Nepalese citizens.
          </p>
        </section>

        {/* What We Do Section */}
        <section className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold text-[#22C55E] mb-4">What We Do</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Data Integration</h3>
              <p className="text-gray-600">
                We collect and integrate nutrition data from various sources across Nepal's 77 districts, providing a comprehensive view of the nation's nutritional status.
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Analysis & Insights</h3>
              <p className="text-gray-600">
                Our platform analyzes trends, identifies areas of concern, and generates actionable insights to support evidence-based decision making.
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Capacity Building</h3>
              <p className="text-gray-600">
                We work with local health authorities to build capacity in data collection, analysis, and utilization for improved nutrition outcomes.
              </p>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold text-[#22C55E] mb-4">Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4"></div>
              <h3 className="font-semibold">Pragya</h3>
              <p className="text-gray-600">Project Lead</p>
            </div>
            <div className="text-center">
              <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4"></div>
              <h3 className="font-semibold">Ishan</h3>
              <p className="text-gray-600">Lead Developer</p>
            </div>
            <div className="text-center">
              <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4"></div>
              <h3 className="font-semibold">Raju</h3>
              <p className="text-gray-600">Advisor</p>
            </div>
          </div>
          
          <h3 className="text-lg font-semibold text-gray-700 mt-8 mb-4">Development Team</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="text-center">
              <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-4"></div>
              <h3 className="font-semibold">Binam</h3>
              <p className="text-gray-600">Developer</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-4"></div>
              <h3 className="font-semibold">Sonu</h3>
              <p className="text-gray-600">Developer</p>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold text-[#22C55E] mb-4">Contact Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-3">
              <Mail className="text-[#22C55E]" />
              <div>
                <h3 className="font-semibold">Email</h3>
                <p className="text-gray-600">nutfellowship@gmail.com</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Phone className="text-[#22C55E]" />
              <div>
                <h3 className="font-semibold">Phone</h3>
                <p className="text-gray-600">+977-1-4XXXXXX</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <MapPin className="text-[#22C55E]" />
              <div>
                <h3 className="font-semibold">Address</h3>
                <p className="text-gray-600">Kathmandu, Nepal</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </PageWrapper>
  );
};

export default About; 