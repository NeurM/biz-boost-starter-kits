
import React from 'react';
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ServiceCard from '@/components/ServiceCard';
import Testimonial from '@/components/Testimonial';
import { Calendar, Phone, Wrench, Check, Tool } from 'lucide-react';

const TradecraftHome = () => {
  const navItems = [
    { name: "Home", path: "/tradecraft" },
    { name: "About", path: "/tradecraft/about" },
    { name: "Services", path: "/tradecraft/services" },
    { name: "Blog", path: "/tradecraft/blog" },
    { name: "Contact", path: "/tradecraft/contact" },
  ];
  
  const contactInfo = {
    address: "123 Trade Street, Tradeville, TV 12345",
    phone: "(555) 456-7890",
    email: "info@tradecraft.com",
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar 
        logo="Trade<span class='text-blue-600'>Craft</span>" 
        basePath="tradecraft"
        navItems={navItems}
        ctaText="Book Now" 
        ctaLink="/tradecraft/contact"
      />
      
      {/* Hero Section */}
      <section className="relative bg-blue-700 text-white py-24 overflow-hidden">
        <div className="absolute inset-0 bg-blue-900 opacity-30 z-0"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col lg:flex-row items-center">
            <div className="lg:w-1/2 mb-10 lg:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Professional Tradecraft Services</h1>
              <p className="text-xl text-blue-100 mb-8 max-w-lg">
                Expert electricians, plumbers, and handymen delivering high-quality services for your home and business.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button asChild size="lg" className="bg-orange-500 hover:bg-orange-600 text-white">
                  <Link to="/tradecraft/services">Our Services</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-700">
                  <Link to="/tradecraft/contact">
                    <Calendar className="mr-2 h-5 w-5" /> Schedule Service
                  </Link>
                </Button>
              </div>
            </div>
            <div className="lg:w-1/2 lg:pl-10">
              <img 
                src="https://images.unsplash.com/photo-1621905252507-b35492cc74b4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                alt="Tradesperson at work"
                className="rounded-lg shadow-xl w-full"
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Services Preview */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Services</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We offer a wide range of professional services to meet all your trade needs.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <ServiceCard 
              title="Electrical Services" 
              description="Complete electrical solutions for residential and commercial properties."
              icon={<Wrench className="h-10 w-10 text-blue-600" />}
              link="/tradecraft/services"
            />
            <ServiceCard 
              title="Plumbing Services" 
              description="Professional plumbing services from minor repairs to major installations."
              icon={<Tool className="h-10 w-10 text-blue-600" />}
              link="/tradecraft/services"
            />
            <ServiceCard 
              title="General Maintenance" 
              description="Comprehensive handyman services for all your property maintenance needs."
              icon={<Check className="h-10 w-10 text-blue-600" />}
              link="/tradecraft/services"
            />
          </div>
          
          <div className="text-center mt-10">
            <Button asChild variant="outline">
              <Link to="/tradecraft/services">View All Services</Link>
            </Button>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 py-16 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Need Urgent Assistance?</h2>
          <p className="text-xl mb-8">Our emergency team is available 24/7 to help with urgent issues.</p>
          <Button asChild size="lg" className="bg-orange-500 hover:bg-orange-600">
            <Link to="/tradecraft/contact">
              <Phone className="mr-2 h-5 w-5" /> Call For Emergency Service
            </Link>
          </Button>
        </div>
      </section>
      
      {/* Testimonials */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">What Our Clients Say</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Hear from our satisfied customers about their experience with our services.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Testimonial 
              quote="The electrician arrived on time and fixed our problem quickly. Very professional service."
              author="Robert Wilson"
              role="Homeowner"
            />
            <Testimonial 
              quote="Their plumbing team saved us from a major water crisis. Fast response and great work!"
              author="Linda Martinez"
              company="Martinez Restaurant"
            />
            <Testimonial 
              quote="I've been using their services for years. Always reliable and high quality workmanship."
              author="James Thompson"
              role="Property Manager"
            />
          </div>
        </div>
      </section>
      
      {/* Process Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Simple Process</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Getting help is easy with our straightforward service process.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">1</div>
              <h3 className="text-xl font-semibold mb-2">Book a Service</h3>
              <p className="text-gray-600">Schedule online or call our customer service team.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">2</div>
              <h3 className="text-xl font-semibold mb-2">Professional Visit</h3>
              <p className="text-gray-600">Our qualified tradesperson will arrive at the scheduled time.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">3</div>
              <h3 className="text-xl font-semibold mb-2">Problem Solved</h3>
              <p className="text-gray-600">Get your issue resolved with quality workmanship.</p>
            </div>
          </div>
          
          <div className="text-center mt-10">
            <Button asChild className="bg-orange-500 hover:bg-orange-600">
              <Link to="/tradecraft/contact">Schedule Now</Link>
            </Button>
          </div>
        </div>
      </section>
      
      <Footer 
        logo="TradeCraft"
        description="Your trusted partner for professional trade services."
        basePath="tradecraft"
        navItems={navItems}
        contactInfo={contactInfo}
      />
    </div>
  );
};

export default TradecraftHome;
