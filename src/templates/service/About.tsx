
import React from 'react';
import { serviceProData } from '../../data/serviceProData';
import { Button } from "@/components/ui/button";
import UserMenu from '@/components/UserMenu';
import ThemeColorSwitcher from '@/components/ThemeColorSwitcher';
import { useTemplateTheme } from '@/context/TemplateThemeContext';

const ServiceAbout = () => {
  const { templateType, setTemplateColor, colorClasses } = useTemplateTheme();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation is automatically included in the Navbar component */}
      <div className="absolute top-4 right-8 z-50">
        <UserMenu isTemplate={true} templatePath="service" />
      </div>
      
      {/* Theme Color Switcher */}
      <div className="absolute top-4 right-20 z-50">
        <ThemeColorSwitcher 
          templateType={templateType} 
          onColorChange={(color) => setTemplateColor(color)} 
        />
      </div>
      
      <div className="container mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">About ServicePro</h1>
          
          <div className="bg-white rounded-lg shadow-sm p-8 mb-10">
            <h2 className="text-2xl font-semibold mb-4 text-teal-700">Our Story</h2>
            <p className="text-gray-600 mb-6">
              ServicePro was founded in 2020 with a simple mission: to provide businesses with the highest quality professional services and solutions. What started as a small team of dedicated professionals has grown into a thriving company serving clients across industries.
            </p>
            <p className="text-gray-600 mb-6">
              Our team brings decades of combined experience to every project, ensuring that we deliver results that exceed our clients' expectations. We're passionate about what we do and committed to helping our clients achieve their goals.
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-8 mb-10">
            <h2 className="text-2xl font-semibold mb-4 text-teal-700">Our Mission</h2>
            <p className="text-gray-600 mb-6">
              At ServicePro, our mission is to empower businesses through innovative solutions and exceptional service. We strive to be a trusted partner for our clients, helping them navigate challenges and seize opportunities in today's competitive landscape.
            </p>
            <div className="flex items-center justify-center bg-gray-50 p-6 rounded-lg">
              <div className="text-center">
                <p className="text-xl font-semibold text-teal-600 italic">
                  "Delivering excellence through professionalism, innovation, and integrity."
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-semibold mb-4 text-teal-700">Our Team</h2>
            <p className="text-gray-600 mb-8">
              Our team consists of experienced professionals from diverse backgrounds, united by a shared commitment to excellence and client satisfaction.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((member) => (
                <div key={member} className="text-center">
                  <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4"></div>
                  <h3 className="font-semibold text-lg">Team Member {member}</h3>
                  <p className={colorClasses.text}>Position Title</p>
                  <p className="text-gray-500 mt-2">
                    Brief description of team member's experience and expertise.
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceAbout;
