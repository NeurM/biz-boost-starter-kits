
import React from 'react';
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Calendar } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="relative bg-blue-700 text-white py-24 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 opacity-90 z-0"></div>
      
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10 z-0">
        <svg width="100%" height="100%" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center">
          <div className="lg:w-1/2 mb-10 lg:mb-0 animate-fade-up">
            <span className="inline-block bg-blue-600 text-white text-sm font-medium px-3 py-1 rounded-full mb-4">Professional Services</span>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">Professional Tradecraft Services</h1>
            <p className="text-xl text-blue-100 mb-8 max-w-lg">
              Expert electricians, plumbers, and handymen delivering high-quality services for your home and business.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button variant="default" size="lg" asChild className="btn-gradient-blue">
                <Link to="/tradecraft/services">Our Services</Link>
              </Button>
              <Button variant="outline" size="lg" asChild className="border-white text-white hover:bg-white/10 group">
                <Link to="/tradecraft/contact">
                  <Calendar className="mr-2 h-5 w-5 group-hover:translate-y-[-2px] transition-transform" /> Schedule Service
                </Link>
              </Button>
            </div>
          </div>
          <div className="lg:w-1/2 lg:pl-10 animate-fade-up" style={{animationDelay: "0.2s"}}>
            <div className="relative">
              <div className="absolute -inset-1 bg-blue-600 rounded-lg opacity-30 blur"></div>
              <img 
                src="https://images.unsplash.com/photo-1621905252507-b35492cc74b4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                alt="Tradesperson at work"
                className="rounded-lg shadow-2xl w-full relative z-10 tilt-card"
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Wave divider */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120">
          <path fill="#ffffff" fillOpacity="1" d="M0,32L48,48C96,64,192,96,288,96C384,96,480,64,576,48C672,32,768,32,864,48C960,64,1056,96,1152,96C1248,96,1344,64,1392,48L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"></path>
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;
