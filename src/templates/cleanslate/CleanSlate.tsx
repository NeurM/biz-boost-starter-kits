
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ServiceCard from '@/components/ServiceCard';
import Testimonial from '@/components/Testimonial';
import ContactForm from '@/components/ContactForm';
import { Link as ScrollLink } from 'react-scroll';
import { ArrowDown, Mail, MapPin, Phone, Wrench, Briefcase, Check } from 'lucide-react';

const CleanSlate = () => {
  return (
    <div className="min-h-screen bg-white text-gray-800">
      {/* Navigation */}
      <nav className="fixed w-full bg-white z-50 shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="text-2xl font-bold">Clean<span className="text-gray-500">Slate</span></div>
            
            <div className="hidden md:flex space-x-10">
              {['Home', 'Services', 'About', 'Testimonials', 'Contact'].map((item) => (
                <ScrollLink
                  key={item}
                  to={item.toLowerCase()}
                  smooth={true}
                  duration={500}
                  className="text-gray-600 hover:text-black cursor-pointer"
                >
                  {item}
                </ScrollLink>
              ))}
            </div>
            
            <div>
              <Button>
                <Phone className="mr-2 h-4 w-4" /> Call Now
              </Button>
            </div>
          </div>
        </div>
      </nav>
      
      {/* Hero Section */}
      <section id="home" className="pt-32 pb-20 px-6">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-5xl font-bold mb-6 animate-fade-up">Professional Solutions for Your Business</h1>
              <p className="text-xl text-gray-600 mb-8 animate-fade-up" style={{animationDelay: '0.2s'}}>
                We provide high-quality services tailored to meet your business needs.
                With over 10 years of experience, trust us to deliver exceptional results.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 animate-fade-up" style={{animationDelay: '0.4s'}}>
                <Button size="lg">
                  Our Services
                </Button>
                <Button variant="outline" size="lg">
                  Get a Quote
                </Button>
              </div>
            </div>
            
            <div className="md:w-1/2 flex justify-center">
              <Card className="w-full max-w-md overflow-hidden">
                <CardContent className="p-0">
                  <img 
                    src="https://images.unsplash.com/photo-1560179707-f14e90ef3623?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                    alt="Business office" 
                    className="w-full h-80 object-cover"
                  />
                </CardContent>
              </Card>
            </div>
          </div>
          
          <div className="flex justify-center mt-20">
            <ScrollLink to="services" smooth={true} duration={500} className="cursor-pointer">
              <ArrowDown className="animate-bounce h-10 w-10 text-gray-400" />
            </ScrollLink>
          </div>
        </div>
      </section>
      
      {/* Services Section */}
      <section id="services" className="py-20 bg-gray-50 px-6">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold mb-2 text-center">Our Services</h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            We offer a comprehensive range of professional services to help your business thrive.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <ServiceCard 
              title="Business Consulting" 
              description="Strategic guidance to optimize your operations and maximize growth potential."
              icon={<Briefcase className="h-10 w-10" />}
            />
            <ServiceCard 
              title="Technical Solutions" 
              description="Custom technical implementations tailored to your specific business requirements."
              icon={<Wrench className="h-10 w-10" />}
            />
            <ServiceCard 
              title="Marketing Strategy" 
              description="Effective marketing approaches to boost your visibility and attract more customers."
              icon={<Check className="h-10 w-10" />}
            />
          </div>
        </div>
      </section>
      
      {/* About Section */}
      <section id="about" className="py-20 px-6">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0 md:pr-10">
              <h2 className="text-4xl font-bold mb-6">About Our Company</h2>
              <p className="text-gray-600 mb-6">
                Founded in 2010, we've been providing exceptional services to small and medium businesses for over a decade. Our team of experts is dedicated to helping your business succeed through innovative solutions and personalized service.
              </p>
              <p className="text-gray-600 mb-6">
                We believe in building lasting relationships with our clients, understanding their unique needs, and delivering results that exceed expectations.
              </p>
              <div className="grid grid-cols-2 gap-4 mt-8">
                <div className="flex flex-col">
                  <span className="text-3xl font-bold">250+</span>
                  <span className="text-gray-600">Clients Served</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-3xl font-bold">10+</span>
                  <span className="text-gray-600">Years Experience</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-3xl font-bold">500+</span>
                  <span className="text-gray-600">Projects Completed</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-3xl font-bold">98%</span>
                  <span className="text-gray-600">Client Satisfaction</span>
                </div>
              </div>
            </div>
            
            <div className="md:w-1/2">
              <img 
                src="https://images.unsplash.com/photo-1542744173-05336fcc7ad4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                alt="Team meeting" 
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-gray-50 px-6">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold mb-2 text-center">What Our Clients Say</h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Don't just take our word for it, see what our valued clients have to say about our services.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Testimonial 
              quote="Working with this team transformed our business operations completely. Their attention to detail and expertise is unmatched."
              author="Sarah Johnson"
              role="CEO"
              company="Johnson Enterprises"
            />
            <Testimonial 
              quote="Their consultative approach helped us identify hidden opportunities and streamline our processes. Highly recommended!"
              author="Mike Thompson"
              role="Operations Director"
              company="Thompson Industries"
            />
            <Testimonial 
              quote="The level of professionalism and technical knowledge they bring to the table is exceptional. A true partner for our business."
              author="Lisa Chen"
              role="Marketing Manager"
              company="Chen Marketing"
            />
          </div>
        </div>
      </section>
      
      {/* Contact Section */}
      <section id="contact" className="py-20 px-6">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/2 mb-10 md:mb-0 md:pr-10">
              <h2 className="text-4xl font-bold mb-6">Get In Touch</h2>
              <p className="text-gray-600 mb-8">
                Have questions or need more information? Fill out the form and we'll get back to you as soon as possible.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <Phone className="h-6 w-6 text-gray-600 mr-4 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Phone</h3>
                    <p className="text-gray-600">(555) 123-4567</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Mail className="h-6 w-6 text-gray-600 mr-4 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Email</h3>
                    <p className="text-gray-600">info@cleanslate.com</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <MapPin className="h-6 w-6 text-gray-600 mr-4 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Address</h3>
                    <p className="text-gray-600">
                      123 Business Ave, Suite 200<br />
                      Business District, BZ 12345
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="md:w-1/2">
              <Card>
                <CardContent className="p-6">
                  <ContactForm />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-gray-900 text-white py-10 px-6">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div>
              <h3 className="text-xl font-semibold mb-4">Clean<span className="text-gray-400">Slate</span></h3>
              <p className="text-gray-400">
                Providing professional business solutions since 2010. We help small businesses succeed.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                {['Home', 'Services', 'About', 'Testimonials', 'Contact'].map((item) => (
                  <li key={item}>
                    <ScrollLink
                      to={item.toLowerCase()}
                      smooth={true}
                      duration={500}
                      className="text-gray-400 hover:text-white cursor-pointer"
                    >
                      {item}
                    </ScrollLink>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-4">Working Hours</h3>
              <ul className="text-gray-400 space-y-2">
                <li>Monday - Friday: 9:00 AM - 5:00 PM</li>
                <li>Saturday: 10:00 AM - 2:00 PM</li>
                <li>Sunday: Closed</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500">
            <p>&copy; 2025 CleanSlate. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CleanSlate;
