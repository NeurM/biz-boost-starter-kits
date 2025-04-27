
import React from 'react';
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const ProcessSection = () => {
  return (
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
          <Button variant="default" size="lg" asChild>
            <Link to="/tradecraft/contact">Schedule Now</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;
