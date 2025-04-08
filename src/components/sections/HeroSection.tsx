
import React from 'react';
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Calendar } from 'lucide-react';

const HeroSection = () => {
  return (
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
  );
};

export default HeroSection;
