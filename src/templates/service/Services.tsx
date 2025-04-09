
import React from 'react';
import { serviceProData } from '../../data/serviceProData';
import { TemplatePage } from '../../components/generic/GenericTemplatePages';
import { Shield, LineChart, Users, Database, Code, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const ServiceServices = () => {
  const services = [
    {
      icon: <Shield className="h-10 w-10 text-teal-600" />,
      title: "Business Consulting",
      description: "Strategic guidance to help your business grow and succeed in a competitive marketplace.",
      link: "#business-consulting"
    },
    {
      icon: <LineChart className="h-10 w-10 text-teal-600" />,
      title: "Analytics & Insights",
      description: "Data-driven insights to help you make informed decisions for your business.",
      link: "#analytics"
    },
    {
      icon: <Users className="h-10 w-10 text-teal-600" />,
      title: "Team Development",
      description: "Training and development programs to enhance your team's skills and performance.",
      link: "#team-development"
    },
    {
      icon: <Database className="h-10 w-10 text-teal-600" />,
      title: "Data Management",
      description: "Comprehensive solutions for organizing, storing, and utilizing your business data effectively.",
      link: "#data-management"
    },
    {
      icon: <Code className="h-10 w-10 text-teal-600" />,
      title: "Technology Integration",
      description: "Seamlessly integrate new technologies into your existing business processes and systems.",
      link: "#technology"
    },
    {
      icon: <Lightbulb className="h-10 w-10 text-teal-600" />,
      title: "Innovation Strategy",
      description: "Develop and implement innovative solutions to stay ahead of the competition.",
      link: "#innovation"
    }
  ];

  return (
    <TemplatePage
      title="Our Services"
      description={serviceProData.description}
      logo={serviceProData.logo}
      basePath={serviceProData.basePath}
      navItems={serviceProData.navItems}
      contactInfo={serviceProData.contactInfo}
    >
      <div className="bg-gradient-to-r from-teal-700 to-teal-600 text-white py-16">
        <div className="container mx-auto px-6">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Our Services</h1>
          <p className="text-xl text-teal-100 max-w-2xl">
            We provide a comprehensive range of professional services designed to help your business thrive.
          </p>
        </div>
      </div>
      
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-100">
              <div className="mb-4">{service.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
              <p className="text-gray-600 mb-4">{service.description}</p>
              <Button asChild variant="link" className="p-0 text-teal-600">
                <Link to={service.link}>Learn more</Link>
              </Button>
            </div>
          ))}
        </div>
        
        <div className="mt-16 bg-gray-50 p-8 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Custom Solutions</h2>
          <p className="text-gray-600 mb-6">
            Don't see exactly what you're looking for? We specialize in creating custom solutions tailored to your specific business needs. Contact us to discuss how we can help you achieve your goals.
          </p>
          <Button asChild className="bg-teal-600 hover:bg-teal-700">
            <Link to="/service/contact">Get in Touch</Link>
          </Button>
        </div>
      </div>
      
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-2xl font-bold mb-10 text-center">Our Service Process</h2>
          
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/3 p-4">
              <div className="bg-white p-6 rounded-lg shadow-sm h-full">
                <div className="w-12 h-12 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center text-xl font-bold mb-4">1</div>
                <h3 className="text-xl font-semibold mb-2">Consultation</h3>
                <p className="text-gray-600">
                  We begin with a thorough consultation to understand your business, goals, and challenges.
                </p>
              </div>
            </div>
            
            <div className="md:w-1/3 p-4">
              <div className="bg-white p-6 rounded-lg shadow-sm h-full">
                <div className="w-12 h-12 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center text-xl font-bold mb-4">2</div>
                <h3 className="text-xl font-semibold mb-2">Strategy Development</h3>
                <p className="text-gray-600">
                  We create a tailored strategy designed to address your specific needs and objectives.
                </p>
              </div>
            </div>
            
            <div className="md:w-1/3 p-4">
              <div className="bg-white p-6 rounded-lg shadow-sm h-full">
                <div className="w-12 h-12 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center text-xl font-bold mb-4">3</div>
                <h3 className="text-xl font-semibold mb-2">Implementation</h3>
                <p className="text-gray-600">
                  Our team works closely with you to implement solutions and ensure successful outcomes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </TemplatePage>
  );
};

export default ServiceServices;
