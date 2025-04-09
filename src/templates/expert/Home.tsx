import React from 'react';
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ServiceCard from '@/components/ServiceCard';
import Testimonial from '@/components/Testimonial';
import { Award, Calendar, Check, Star } from 'lucide-react';
import UserMenu from '@/components/UserMenu';

const ExpertHome = () => {
  const navItems = [
    { name: "Home", path: "/expert" },
    { name: "About", path: "/expert/about" },
    { name: "Services", path: "/expert/services" },
    { name: "Blog", path: "/expert/blog" },
    { name: "Contact", path: "/expert/contact" },
  ];
  
  const contactInfo = {
    address: "321 Expert Lane, Expertville, EX 54321",
    phone: "(555) 987-6543",
    email: "hello@localexpert.com",
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar 
        logo="Local<span class='text-amber-600'>Expert</span>" 
        basePath="expert"
        navItems={navItems}
        ctaText="Book Appointment" 
        ctaLink="/expert/contact"
      />
      
      {/* Template-specific User Menu */}
      <div className="absolute top-4 right-20 z-50">
        <UserMenu isTemplate={true} templatePath="expert" />
      </div>
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80" 
            alt="Professional expert"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-amber-900/90 to-amber-700/80"></div>
        </div>
        
        <div className="container mx-auto px-6 py-24 relative z-10 text-white">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Local Expertise, Personalized Service</h1>
            <p className="text-xl mb-8 text-amber-100">
              Providing specialized consulting services to help individuals and small businesses achieve their goals.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg" className="bg-amber-500 hover:bg-amber-600 text-white">
                <Link to="/expert/services">Explore Services</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                <Link to="/expert/about">About Me</Link>
              </Button>
            </div>
            
            <div className="mt-12 flex items-center space-x-6">
              <div className="flex">
                <Star className="h-5 w-5 text-yellow-400 fill-current" />
                <Star className="h-5 w-5 text-yellow-400 fill-current" />
                <Star className="h-5 w-5 text-yellow-400 fill-current" />
                <Star className="h-5 w-5 text-yellow-400 fill-current" />
                <Star className="h-5 w-5 text-yellow-400 fill-current" />
              </div>
              <span className="text-amber-100">Over 200+ satisfied clients</span>
            </div>
          </div>
        </div>
      </section>
      
      {/* Introduction */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/3">
              <img 
                src="https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                alt="Expert consultant"
                className="rounded-lg shadow-lg"
              />
            </div>
            
            <div className="lg:w-2/3">
              <h2 className="text-3xl font-bold mb-6">Welcome to Local Expert</h2>
              <p className="text-gray-600 mb-6">
                With over 15 years of industry experience, I provide personalized consulting services to help small businesses and individuals navigate challenges and achieve their goals. My approach combines proven strategies with innovative solutions tailored to your unique situation.
              </p>
              <p className="text-gray-600 mb-8">
                Whether you're looking to grow your business, improve operations, or develop a new strategy, I'm here to provide the guidance and expertise you need to succeed.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex flex-col items-center text-center p-4 border border-amber-200 rounded-lg bg-amber-50">
                  <Award className="h-10 w-10 text-amber-600 mb-2" />
                  <h3 className="font-semibold mb-1">Certified Expert</h3>
                  <p className="text-sm text-gray-600">Industry recognized certifications</p>
                </div>
                
                <div className="flex flex-col items-center text-center p-4 border border-amber-200 rounded-lg bg-amber-50">
                  <Calendar className="h-10 w-10 text-amber-600 mb-2" />
                  <h3 className="font-semibold mb-1">15+ Years Experience</h3>
                  <p className="text-sm text-gray-600">Helping businesses succeed</p>
                </div>
                
                <div className="flex flex-col items-center text-center p-4 border border-amber-200 rounded-lg bg-amber-50">
                  <Check className="h-10 w-10 text-amber-600 mb-2" />
                  <h3 className="font-semibold mb-1">Proven Results</h3>
                  <p className="text-sm text-gray-600">Track record of success</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Services */}
      <section className="py-16 bg-amber-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Services Offered</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              I provide a range of specialized services to meet your specific needs and help you achieve your goals.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ServiceCard 
              title="Business Strategy" 
              description="Develop effective strategies to grow your business, improve operations, and increase profitability."
              icon={<Award className="h-10 w-10 text-amber-600" />}
              link="/expert/services"
            />
            <ServiceCard 
              title="Financial Planning" 
              description="Create comprehensive financial plans to help you achieve your personal and business financial goals."
              icon={<Calendar className="h-10 w-10 text-amber-600" />}
              link="/expert/services"
            />
            <ServiceCard 
              title="Marketing Solutions" 
              description="Implement targeted marketing strategies to reach your audience and grow your customer base."
              icon={<Check className="h-10 w-10 text-amber-600" />}
              link="/expert/services"
            />
          </div>
          
          <div className="text-center mt-10">
            <Button asChild className="bg-amber-600 hover:bg-amber-700">
              <Link to="/expert/services">View All Services</Link>
            </Button>
          </div>
        </div>
      </section>
      
      {/* Testimonials */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Client Testimonials</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Don't take my word for it - hear what my clients have to say about working together.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Testimonial 
              quote="Working with LocalExpert transformed my business. The personalized advice and actionable strategies made all the difference."
              author="Robert Johnson"
              role="Small Business Owner"
              className="border-amber-200"
            />
            <Testimonial 
              quote="I appreciate the hands-on approach and attention to detail. My financial plan is now clear and I feel confident about the future."
              author="Lisa Martinez"
              role="Entrepreneur"
              className="border-amber-200"
            />
            <Testimonial 
              quote="The marketing strategy developed for my business has led to a 40% increase in new customers within just three months."
              author="James Thompson"
              role="Retail Store Owner"
              className="border-amber-200"
            />
          </div>
        </div>
      </section>
      
      {/* Process */}
      <section className="py-16 bg-amber-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">My Process</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              I follow a structured approach to ensure we address your specific needs and achieve the best possible results.
            </p>
          </div>
          
          <div className="relative">
            {/* Process line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-amber-200 hidden md:block"></div>
            
            <div className="space-y-12 relative">
              {/* Step 1 */}
              <div className="flex flex-col md:flex-row items-center">
                <div className="md:w-1/2 md:pr-12 md:text-right mb-6 md:mb-0">
                  <h3 className="text-xl font-semibold mb-2">Initial Consultation</h3>
                  <p className="text-gray-600">We begin with a thorough discussion to understand your goals, challenges, and vision.</p>
                </div>
                
                <div className="md:w-12 flex justify-center">
                  <div className="w-12 h-12 bg-amber-600 text-white rounded-full flex items-center justify-center text-xl font-bold z-10">1</div>
                </div>
                
                <div className="md:w-1/2 md:pl-12">
                  {/* Empty space for layout */}
                </div>
              </div>
              
              {/* Step 2 */}
              <div className="flex flex-col md:flex-row items-center">
                <div className="md:w-1/2 md:pr-12 md:text-right md:order-1 md:pl-0 pl-12 mb-6 md:mb-0 hidden md:block">
                  {/* Empty space for layout */}
                </div>
                
                <div className="md:w-12 flex justify-center">
                  <div className="w-12 h-12 bg-amber-600 text-white rounded-full flex items-center justify-center text-xl font-bold z-10">2</div>
                </div>
                
                <div className="md:w-1/2 md:pl-12 md:text-left">
                  <h3 className="text-xl font-semibold mb-2">Analysis & Strategy</h3>
                  <p className="text-gray-600">I analyze your situation and develop a customized strategy tailored to your specific needs.</p>
                </div>
              </div>
              
              {/* Step 3 */}
              <div className="flex flex-col md:flex-row items-center">
                <div className="md:w-1/2 md:pr-12 md:text-right mb-6 md:mb-0">
                  <h3 className="text-xl font-semibold mb-2">Implementation</h3>
                  <p className="text-gray-600">We put the strategy into action with clear steps and guidance throughout the process.</p>
                </div>
                
                <div className="md:w-12 flex justify-center">
                  <div className="w-12 h-12 bg-amber-600 text-white rounded-full flex items-center justify-center text-xl font-bold z-10">3</div>
                </div>
                
                <div className="md:w-1/2 md:pl-12">
                  {/* Empty space for layout */}
                </div>
              </div>
              
              {/* Step 4 */}
              <div className="flex flex-col md:flex-row items-center">
                <div className="md:w-1/2 md:pr-12 md:text-right md:order-1 md:pl-0 pl-12 mb-6 md:mb-0 hidden md:block">
                  {/* Empty space for layout */}
                </div>
                
                <div className="md:w-12 flex justify-center">
                  <div className="w-12 h-12 bg-amber-600 text-white rounded-full flex items-center justify-center text-xl font-bold z-10">4</div>
                </div>
                
                <div className="md:w-1/2 md:pl-12 md:text-left">
                  <h3 className="text-xl font-semibold mb-2">Results & Refinement</h3>
                  <p className="text-gray-600">We track progress, measure results, and make adjustments as needed to ensure success.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-amber-600 to-amber-800 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Schedule your free consultation today and take the first step toward achieving your goals.
          </p>
          <Button asChild size="lg" className="bg-white text-amber-800 hover:bg-amber-50">
            <Link to="/expert/contact">Book Your Free Consultation</Link>
          </Button>
        </div>
      </section>
      
      {/* Featured In */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-2xl font-semibold text-center mb-8">Featured In</h2>
          
          <div className="flex flex-wrap justify-center gap-8 items-center opacity-60">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-12">
                <div className="h-full w-32 bg-gray-200 rounded flex items-center justify-center text-gray-500">
                  Publication {i+1}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      <Footer 
        logo="LocalExpert"
        description="Professional consulting services to help you achieve your personal and business goals."
        basePath="expert"
        navItems={navItems}
        contactInfo={contactInfo}
      />
    </div>
  );
};

export default ExpertHome;
