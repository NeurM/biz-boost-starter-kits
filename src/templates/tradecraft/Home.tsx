
import React from 'react';
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ServiceCard from '@/components/ServiceCard';
import Testimonial from '@/components/Testimonial';
import { Calendar, Phone, Wrench, Check } from 'lucide-react';
import HeroSection from '@/components/sections/HeroSection';
import ServicesSection from '@/components/sections/ServicesSection';
import CtaSection from '@/components/sections/CtaSection';
import TestimonialsSection from '@/components/sections/TestimonialsSection';
import ProcessSection from '@/components/sections/ProcessSection';

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
      
      <HeroSection />
      <ServicesSection />
      <CtaSection />
      <TestimonialsSection />
      <ProcessSection />
      
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
