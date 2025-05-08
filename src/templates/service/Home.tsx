
import React, { useEffect } from 'react';
import { serviceProData } from '../../data/serviceProData';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  MessageSquare,
  Shield,
  LineChart,
  Users,
  CheckCircle,
  ChevronRight,
  Star
} from "lucide-react";
import { Button } from "@/components/ui/button";
import UserMenu from '@/components/UserMenu';
import { useTemplateTheme } from '@/context/TemplateThemeContext';
import { ErrorBoundary } from 'react-error-boundary';
import ServiceCard from '@/components/ServiceCard';
import Testimonial from '@/components/Testimonial';

// Error Fallback Component
const ErrorFallback = ({ error }: { error: Error }) => (
  <div className="p-6 bg-red-50 text-red-800 min-h-screen">
    <h2 className="text-2xl font-bold mb-4">Error loading the page</h2>
    <p>We're sorry, but something went wrong. Please try again later.</p>
    <pre className="mt-4 p-4 bg-red-100 rounded overflow-auto max-w-full">
      {error.message}
    </pre>
    <a href="/" className="mt-6 inline-block px-4 py-2 bg-teal-600 text-white rounded">
      Return to Home
    </a>
  </div>
);

// Component wrapper with error boundary
const SafeComponent: React.FC<{ children: React.ReactNode, name: string }> = ({ children, name }) => (
  <ErrorBoundary FallbackComponent={ErrorFallback} key={name}>
    {children}
  </ErrorBoundary>
);

const ServiceHome = () => {
  const { colorClasses } = useTemplateTheme();

  // Use SafeComponent to wrap major sections that could fail
  return (
    <div className="min-h-screen bg-gray-50">
      <SafeComponent name="navbar">
        <Navbar 
          logo={serviceProData.logo}
          basePath={serviceProData.basePath}
          navItems={serviceProData.navItems}
          ctaText="Contact" 
          ctaLink={`/${serviceProData.basePath}/contact`}
        />
      </SafeComponent>
      
      {/* Template-specific User Menu - Position adjusted for better visibility */}
      <div className="absolute top-4 right-8 z-30">
        <UserMenu isTemplate={true} templatePath="service" />
      </div>
      
      <SafeComponent name="hero-section">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-teal-700 to-teal-500 text-white">
          <div className="container mx-auto px-4 py-16 md:py-24">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 md:pr-12 mb-8 md:mb-0">
                <h1 className="text-4xl md:text-5xl font-bold mb-6">Professional Services for Modern Businesses</h1>
                <p className="text-xl mb-8 text-white/90">
                  We deliver innovative solutions and exceptional service to help your business thrive in today's competitive landscape.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button size="lg" className="bg-white text-teal-700 hover:bg-gray-100">
                    Get Started
                  </Button>
                  <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10">
                    Learn More
                  </Button>
                </div>
              </div>
              <div className="md:w-1/2 bg-white/10 p-8 rounded-lg">
                <div className="aspect-video bg-teal-200/30 rounded-lg flex items-center justify-center">
                  <span className="text-white text-lg">Service Showcase Image</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SafeComponent>

      <SafeComponent name="services-section">
        {/* Services Section */}
        <div className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Our Services</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                We provide a comprehensive range of professional services tailored to meet the unique needs of our clients.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: <Shield className="h-10 w-10 text-teal-600" />,
                  title: "Business Consulting",
                  description: "Strategic guidance to help your business grow and succeed in a competitive marketplace."
                },
                {
                  icon: <LineChart className="h-10 w-10 text-teal-600" />,
                  title: "Analytics & Insights",
                  description: "Data-driven insights to help you make informed decisions for your business."
                },
                {
                  icon: <Users className="h-10 w-10 text-teal-600" />,
                  title: "Team Development",
                  description: "Training and development programs to enhance your team's skills and performance."
                },
              ].map((service, index) => (
                <ServiceCard
                  key={index}
                  icon={service.icon}
                  title={service.title}
                  description={service.description}
                  link="#"
                  className="bg-gray-50 hover:shadow-md transition-shadow"
                />
              ))}
            </div>
          </div>
        </div>
      </SafeComponent>

      <SafeComponent name="why-choose-us">
        {/* Why Choose Us */}
        <div className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Why Choose Service Pro</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                We're committed to delivering exceptional service and results that exceed your expectations.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                {
                  title: "Expert Team",
                  description: "Our team of professionals brings years of industry experience and expertise to every project."
                },
                {
                  title: "Tailored Solutions",
                  description: "We create customized solutions designed specifically for your unique business needs."
                },
                {
                  title: "Proven Results",
                  description: "We have a track record of delivering measurable results for businesses of all sizes."
                },
                {
                  title: "Ongoing Support",
                  description: "We provide continuous support to ensure your long-term success and satisfaction."
                },
              ].map((item, index) => (
                <div key={index} className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-teal-600 mr-3 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                    <p className="text-gray-600">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </SafeComponent>

      <SafeComponent name="testimonials">
        {/* Testimonials */}
        <div className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">What Our Clients Say</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Don't just take our word for it. Here's what our clients have to say about working with us.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((_, index) => (
                <Testimonial
                  key={index}
                  quote="Service Pro has been instrumental in helping our company grow. Their strategic guidance and expertise have been invaluable to our success."
                  author={`Jane Smith ${index + 1}`}
                  role="CEO"
                  company={`Company ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </SafeComponent>

      <SafeComponent name="cta-section">
        {/* CTA Section */}
        <div className="bg-teal-700 text-white py-16">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="mb-6 md:mb-0">
                <h2 className="text-3xl font-bold mb-2">Ready to get started?</h2>
                <p className="text-xl text-white/90">Contact us today for a free consultation.</p>
              </div>
              <Button size="lg" className="bg-white text-teal-700 hover:bg-gray-100">
                Contact Us
              </Button>
            </div>
          </div>
        </div>
      </SafeComponent>
      
      <SafeComponent name="footer">
        <Footer 
          logo="ServicePro"
          description={serviceProData.description}
          basePath={serviceProData.basePath}
          navItems={serviceProData.navItems}
          contactInfo={serviceProData.contactInfo}
        />
      </SafeComponent>
    </div>
  );
};

export default ServiceHome;
