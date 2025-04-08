
import React from 'react';
import Testimonial from '@/components/Testimonial';

const TestimonialsSection = () => {
  return (
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
  );
};

export default TestimonialsSection;
