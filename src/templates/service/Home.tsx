
import React from 'react';
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ServiceCard from '@/components/ServiceCard';
import Testimonial from '@/components/Testimonial';
import { ArrowRight, BarChart, Briefcase, Users, Award } from 'lucide-react';

const ServiceHome = () => {
  const navItems = [
    { name: "Home", path: "/service" },
    { name: "About", path: "/service/about" },
    { name: "Offerings", path: "/service/offerings" },
    { name: "Blog", path: "/service/blog" },
    { name: "Contact", path: "/service/contact" },
  ];
  
  const contactInfo = {
    address: "789 Consulting Avenue, Servicetown, ST 56789",
    phone: "(555) 234-5678",
    email: "info@servicepro.com",
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar 
        logo="Service<span class='text-teal-600'>Pro</span>" 
        basePath="service"
        navItems={navItems}
        ctaText="Schedule Consultation" 
        ctaLink="/service/contact"
      />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-teal-600 to-teal-800 text-white">
        <div className="container mx-auto px-6 py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
                Professional Business Services for Growing Companies
              </h1>
              <p className="text-xl text-teal-100 mb-8 max-w-lg">
                We help small and medium businesses streamline operations, improve efficiency, and achieve sustainable growth.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button asChild size="lg" className="bg-white text-teal-800 hover:bg-teal-50">
                  <Link to="/service/offerings">Our Services</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  <Link to="/service/contact">Book a Call</Link>
                </Button>
              </div>
            </div>
            <div className="hidden lg:block">
              <img 
                src="https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                alt="Business professionals in meeting"
                className="rounded-lg shadow-xl w-full h-auto"
              />
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gray-50" style={{clipPath: "polygon(0 100%, 100% 100%, 100% 0)"}}></div>
      </section>
      
      {/* Services Overview */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Our Professional Services</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We offer a comprehensive range of business services tailored to meet the needs of growing companies.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ServiceCard 
              title="Business Consulting" 
              description="Strategic guidance to optimize your operations, streamline processes, and drive growth."
              icon={<Briefcase className="h-10 w-10 text-teal-600" />}
              link="/service/offerings"
            />
            <ServiceCard 
              title="Financial Analysis" 
              description="In-depth financial assessment and planning to improve profitability and cash flow."
              icon={<BarChart className="h-10 w-10 text-teal-600" />}
              link="/service/offerings"
            />
            <ServiceCard 
              title="Team Development" 
              description="Build high-performing teams through training, coaching, and organizational development."
              icon={<Users className="h-10 w-10 text-teal-600" />}
              link="/service/offerings"
            />
          </div>
          
          <div className="text-center mt-12">
            <Button asChild variant="outline" className="border-teal-600 text-teal-600 hover:bg-teal-50">
              <Link to="/service/offerings" className="flex items-center">
                View All Services <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
      
      {/* Why Choose Us */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Why Choose ServicePro?</h2>
              <p className="text-gray-600 mb-8">
                With over 15 years of experience, our team of experts delivers tailored solutions that drive real business results. We combine industry expertise with innovative approaches to help your business thrive.
              </p>
              
              <div className="space-y-4">
                <div className="flex">
                  <div className="flex-shrink-0 mt-1">
                    <div className="h-5 w-5 rounded-full bg-teal-600 flex items-center justify-center">
                      <div className="h-2 w-2 rounded-full bg-white"></div>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold">Experienced Team</h3>
                    <p className="text-gray-600">Our consultants have decades of combined experience across various industries.</p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="flex-shrink-0 mt-1">
                    <div className="h-5 w-5 rounded-full bg-teal-600 flex items-center justify-center">
                      <div className="h-2 w-2 rounded-full bg-white"></div>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold">Tailored Solutions</h3>
                    <p className="text-gray-600">We develop customized strategies based on your specific business needs and goals.</p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="flex-shrink-0 mt-1">
                    <div className="h-5 w-5 rounded-full bg-teal-600 flex items-center justify-center">
                      <div className="h-2 w-2 rounded-full bg-white"></div>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold">Measurable Results</h3>
                    <p className="text-gray-600">We focus on delivering tangible outcomes that you can measure and track.</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8">
                <Button asChild className="bg-teal-600 hover:bg-teal-700">
                  <Link to="/service/about">Learn More About Us</Link>
                </Button>
              </div>
            </div>
            
            <div className="hidden lg:grid grid-cols-2 gap-6">
              <img 
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80" 
                alt="Team meeting"
                className="rounded-lg shadow-md w-full h-64 object-cover"
              />
              <img 
                src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80" 
                alt="Business analysis"
                className="rounded-lg shadow-md w-full h-64 object-cover mt-8"
              />
              <img 
                src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80" 
                alt="Consulting session"
                className="rounded-lg shadow-md w-full h-64 object-cover"
              />
              <img 
                src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80" 
                alt="Business planning"
                className="rounded-lg shadow-md w-full h-64 object-cover mt-8"
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Stats */}
      <section className="py-16 bg-teal-700 text-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-teal-100">Clients Served</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">15+</div>
              <div className="text-teal-100">Years of Experience</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">98%</div>
              <div className="text-teal-100">Client Satisfaction</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">50+</div>
              <div className="text-teal-100">Industry Experts</div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">What Our Clients Say</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Hear from business owners and executives who have transformed their companies with our help.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Testimonial 
              quote="ServicePro's strategic guidance helped us streamline operations and increase revenue by 35% in just six months."
              author="Sarah Johnson"
              role="CEO"
              company="Johnson Enterprises"
              className="border-teal-200"
            />
            <Testimonial 
              quote="Their financial analysis uncovered inefficiencies we didn't even know existed. Their recommendations were game-changing."
              author="Michael Roberts"
              role="CFO"
              company="Roberts Manufacturing"
              className="border-teal-200"
            />
            <Testimonial 
              quote="The team development program transformed our workplace culture and drastically improved our productivity and retention."
              author="Lisa Chen"
              role="Operations Director"
              company="Chen Technologies"
              className="border-teal-200"
            />
          </div>
        </div>
      </section>
      
      {/* Process */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Our Approach</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We follow a proven methodology that ensures we deliver consistent results for our clients.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: "1", title: "Discover", desc: "We begin by understanding your business, goals, and challenges." },
              { step: "2", title: "Analyze", desc: "Our team conducts a thorough analysis to identify opportunities and issues." },
              { step: "3", title: "Strategize", desc: "We develop a tailored strategy and implementation plan for your business." },
              { step: "4", title: "Execute", desc: "We work with you to implement solutions and measure the results." }
            ].map(item => (
              <div key={item.step} className="text-center">
                <div className="w-16 h-16 bg-teal-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA */}
      <section className="py-16 bg-teal-800 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Business?</h2>
          <p className="text-xl mb-8 text-teal-100 max-w-2xl mx-auto">
            Schedule a free consultation with one of our experts to discuss how we can help your business grow.
          </p>
          <Button asChild size="lg" className="bg-white text-teal-800 hover:bg-teal-50">
            <Link to="/service/contact">Schedule Your Free Consultation</Link>
          </Button>
        </div>
      </section>
      
      {/* Clients/Partners */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold mb-10 text-center">Trusted By</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex justify-center">
                <div className="h-16 w-32 bg-gray-200 rounded flex items-center justify-center text-gray-500">
                  Client {i+1}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      <Footer 
        logo="ServicePro"
        description="Professional business consulting services to help your company grow and thrive."
        basePath="service"
        navItems={navItems}
        contactInfo={contactInfo}
      />
    </div>
  );
};

export default ServiceHome;
