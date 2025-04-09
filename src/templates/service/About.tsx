
import React from 'react';
import { serviceProData } from '../../data/serviceProData';
import { TemplatePage } from '../../components/generic/GenericTemplatePages';

const ServiceAbout = () => {
  return (
    <TemplatePage
      title="About ServicePro"
      description={serviceProData.description}
      logo={serviceProData.logo}
      basePath={serviceProData.basePath}
      navItems={serviceProData.navItems}
      contactInfo={serviceProData.contactInfo}
    >
      <div className="container mx-auto px-6 py-16">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">About ServicePro</h1>
          <p className="text-lg text-gray-700 mb-6">{serviceProData.description}</p>
          
          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
              <p className="text-gray-600">
                At ServicePro, our mission is to provide exceptional professional services that help businesses thrive in today's competitive environment. We are dedicated to delivering tailored solutions that address your unique challenges and drive meaningful results.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold mb-4">Our Team</h2>
              <p className="text-gray-600 mb-4">
                Our team consists of experienced professionals with diverse backgrounds and expertise across various industries. We take pride in our collaborative approach and commitment to excellence.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white p-4 rounded shadow-sm">
                    <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4"></div>
                    <h3 className="text-center font-medium">Team Member {i}</h3>
                    <p className="text-center text-gray-500 text-sm">Position</p>
                  </div>
                ))}
              </div>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold mb-4">Our Values</h2>
              <ul className="list-disc pl-5 space-y-2 text-gray-600">
                <li>Excellence in everything we do</li>
                <li>Integrity and transparency</li>
                <li>Client-focused solutions</li>
                <li>Innovation and continuous improvement</li>
                <li>Collaborative partnerships</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold mb-4">Our History</h2>
              <p className="text-gray-600">
                Founded in 2010, ServicePro has grown from a small consulting firm to a comprehensive service provider trusted by businesses of all sizes. Over the years, we've expanded our offerings while maintaining our commitment to personalized service and exceptional results.
              </p>
            </section>
          </div>
        </div>
      </div>
    </TemplatePage>
  );
};

export default ServiceAbout;
