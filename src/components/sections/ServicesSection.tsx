
import React from 'react';
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ServiceCard from '@/components/ServiceCard';
import { Wrench, Check } from 'lucide-react';

const ServicesSection = () => {
  return (
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
            icon={<Wrench className="h-10 w-10 text-blue-600" />}
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
  );
};

export default ServicesSection;
