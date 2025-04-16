import React from 'react';
import { Link } from 'react-router-dom';
import { TemplateData } from '../../types/template';
import { Button } from "@/components/ui/button";
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import { Card, CardContent } from "@/components/ui/card";
import UserMenu from '@/components/UserMenu';
import { MessageSquare, Building, Clock, Mail, MapPin, Phone } from 'lucide-react';
import ContactForm from '@/components/ContactForm';
import { useTemplateTheme } from '@/context/TemplateThemeContext';

// Helper component for theme color controls - simplified to just display user menu
const ThemeControls = ({ templateType }: { templateType: string }) => {
  return (
    <div className="absolute top-4 right-20 z-50">
      {/* Theme color switching functionality has been removed */}
    </div>
  );
};

export const AboutPageComponent = ({ template, title, description, logo, basePath, navItems, contactInfo, primaryColor = "purple" }: TemplateData & { template: string, title: string, primaryColor?: string }) => {
  const { colorClasses, templateType } = useTemplateTheme();
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar 
        logo={logo} 
        basePath={basePath}
        navItems={navItems}
        ctaText="Contact" 
        ctaLink={`/${basePath}/contact`}
      />
      
      {/* Template-specific User Menu */}
      <div className="absolute top-4 right-6 z-50">
        <UserMenu isTemplate={true} templatePath={basePath} />
      </div>
      
      {/* Theme Color Switcher */}
      <ThemeControls templateType={templateType} />
      
      {/* About Hero Section */}
      <section className={`${colorClasses.bg} text-white py-16`}>
        <div className="container mx-auto px-6">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{title}</h1>
          <p className="text-xl max-w-2xl">{description}</p>
        </div>
      </section>
      
      {/* Our Story */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row gap-12">
            <div className="md:w-1/2">
              <h2 className="text-2xl font-bold mb-6">Our Story</h2>
              <p className="text-gray-600 mb-4">
                Founded in 2015, {template} began with a simple vision: to provide exceptional 
                {template.includes("Service") || template.includes("Expert") ? " services" : 
                  template.includes("Retail") ? " products" : " solutions"} 
                that meet the needs of our clients and customers.
              </p>
              <p className="text-gray-600 mb-4">
                What started as a small operation has grown into a trusted name in the industry. 
                We've built our reputation on quality, reliability, and putting our 
                {template.includes("Retail") ? " customers" : " clients"} first.
              </p>
              <p className="text-gray-600">
                Today, we continue to grow while maintaining the core values that have made us successful:
                integrity, excellence, and a commitment to making a positive impact.
              </p>
            </div>
            <div className="md:w-1/2">
              <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
                <span className="text-gray-500">Company Image</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Team Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-2xl font-bold mb-10 text-center">Our Team</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { name: "Jane Smith", title: "CEO & Founder" },
              { name: "Michael Johnson", title: "Operations Director" },
              { name: "Sarah Williams", title: "Head of Marketing" },
              { name: "David Garcia", title: "Customer Relations" },
            ].map((member, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm text-center">
                <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Building className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold mb-1">{member.name}</h3>
                <p className={`${colorClasses.muted}`}>{member.title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Values */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-2xl font-bold mb-10 text-center">Our Values</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "Quality", description: "We never compromise on quality, ensuring that every product and service meets the highest standards." },
              { title: "Integrity", description: "We operate with transparency and honesty in all of our business practices and relationships." },
              { title: "Innovation", description: "We constantly explore new ideas and approaches to better serve our clients and stay ahead of industry trends." },
            ].map((value, index) => (
              <Card key={index} className="overflow-hidden">
                <CardContent className="p-6">
                  <h3 className={`text-xl font-semibold mb-3 ${colorClasses.text}`}>{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
      <Footer 
        logo={template}
        description={description}
        basePath={basePath}
        navItems={navItems}
        contactInfo={contactInfo}
      />
    </div>
  );
};

export const ServicesPageComponent = ({ template, title, serviceType, description, logo, basePath, navItems, contactInfo, primaryColor = "purple" }: TemplateData & { template: string, title: string, serviceType: string, primaryColor?: string }) => {
  const { colorClasses, templateType } = useTemplateTheme();
  const isProducts = serviceType.toLowerCase().includes("product");
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar 
        logo={logo} 
        basePath={basePath}
        navItems={navItems}
        ctaText={isProducts ? "Shop Now" : "Get Started"} 
        ctaLink={`/${basePath}/contact`}
      />
      
      {/* Template-specific User Menu */}
      <div className="absolute top-4 right-6 z-50">
        <UserMenu isTemplate={true} templatePath={basePath} />
      </div>
      
      {/* Theme Color Switcher */}
      <ThemeControls templateType={templateType} />
      
      {/* Services/Products Hero Section */}
      <section className={`${colorClasses.bg} text-white py-16`}>
        <div className="container mx-auto px-6">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{title}</h1>
          <p className="text-xl max-w-2xl">
            {isProducts 
              ? "Browse our selection of high-quality products designed to meet your needs."
              : "Discover our comprehensive range of services tailored to help you succeed."}
          </p>
        </div>
      </section>
      
      {/* Services/Products List */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[...Array(6)].map((_, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-md transition-shadow">
                <CardContent className="p-0">
                  {isProducts ? (
                    <>
                      <div className="aspect-square bg-gray-100 flex items-center justify-center">
                        <span className="text-gray-400">Product Image</span>
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-semibold mb-2">{`${serviceType} ${index + 1}`}</h3>
                        <p className="text-gray-600 mb-4">High-quality product designed to meet your specific needs with premium features.</p>
                        <div className="flex justify-between items-center">
                          <span className={`font-semibold ${colorClasses.text}`}>$99.99</span>
                          <Button className={`${colorClasses.bg} ${colorClasses.hover}`}>Add to Cart</Button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="p-6">
                      <h3 className="text-xl font-semibold mb-2">{`${serviceType} ${index + 1}`}</h3>
                      <p className="text-gray-600 mb-4">Professional service tailored to meet your business needs and help you achieve your goals.</p>
                      <Button className={`${colorClasses.bg} ${colorClasses.hover}`}>Learn More</Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
      {/* Process or Benefits */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-2xl font-bold mb-10 text-center">
            {isProducts ? "Product Benefits" : "Our Process"}
          </h2>
          
          <div className="max-w-3xl mx-auto">
            {isProducts ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[
                  "Premium Quality Materials",
                  "Sustainable Manufacturing",
                  "Excellent Customer Support",
                  "Extended Warranty Coverage"
                ].map((benefit, index) => (
                  <div key={index} className="flex items-start">
                    <div className={`rounded-full p-2 ${colorClasses.bg} text-white mr-4 flex-shrink-0`}>
                      <Clock className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">{benefit}</h3>
                      <p className="text-gray-600">We ensure every product meets the highest standards.</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-12">
                {[
                  { title: "Initial Consultation", description: "We begin by understanding your specific needs and goals." },
                  { title: "Strategic Planning", description: "Our team develops a customized strategy tailored to your requirements." },
                  { title: "Implementation", description: "We put the plan into action with meticulous attention to detail." },
                  { title: "Review & Refinement", description: "Regular check-ins ensure we're meeting expectations and making adjustments as needed." }
                ].map((step, index) => (
                  <div key={index} className="flex">
                    <div className={`rounded-full h-10 w-10 ${colorClasses.bg} text-white flex items-center justify-center mr-4 flex-shrink-0`}>
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                      <p className="text-gray-600">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className={`${colorClasses.bg} text-white py-12`}>
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8">
            {isProducts 
              ? "Browse our full catalog and find the perfect products for your needs."
              : "Contact us today to learn how our services can benefit your business."}
          </p>
          <Button asChild variant="outline" className="border-white text-white hover:bg-white/10">
            <Link to={`/${basePath}/contact`}>
              {isProducts ? "Shop Now" : "Contact Us"}
            </Link>
          </Button>
        </div>
      </section>
      
      <Footer 
        logo={template}
        description={description}
        basePath={basePath}
        navItems={navItems}
        contactInfo={contactInfo}
      />
    </div>
  );
};

export const BlogPageComponent = ({ template, title, description, logo, basePath, navItems, contactInfo, primaryColor = "purple" }: TemplateData & { template: string, title: string, primaryColor?: string }) => {
  const { colorClasses, templateType } = useTemplateTheme();
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar 
        logo={logo} 
        basePath={basePath}
        navItems={navItems}
        ctaText="Contact" 
        ctaLink={`/${basePath}/contact`}
      />
      
      {/* Template-specific User Menu */}
      <div className="absolute top-4 right-6 z-50">
        <UserMenu isTemplate={true} templatePath={basePath} />
      </div>
      
      {/* Theme Color Switcher */}
      <ThemeControls templateType={templateType} />
      
      {/* Blog Hero Section */}
      <section className={`${colorClasses.bg} text-white py-16`}>
        <div className="container mx-auto px-6">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{title}</h1>
          <p className="text-xl max-w-2xl">Stay updated with the latest news, insights, and industry trends.</p>
        </div>
      </section>
      
      {/* Featured Article */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/2 bg-gray-100 aspect-video flex items-center justify-center">
              <span className="text-gray-500">Featured Article Image</span>
            </div>
            <div className="md:w-1/2">
              <span className={`${colorClasses.text} font-medium`}>Featured</span>
              <h2 className="text-2xl font-bold mt-2 mb-4">10 Ways to Improve Your Business Efficiency</h2>
              <p className="text-gray-600 mb-4">
                In today's competitive landscape, business efficiency is more important than ever. 
                Learn proven strategies to streamline operations and boost productivity.
              </p>
              <div className="flex items-center text-gray-500 text-sm mb-6">
                <span>April 5, 2025</span>
                <span className="mx-2">•</span>
                <span>5 min read</span>
              </div>
              <Button className={`${colorClasses.bg} ${colorClasses.hover}`}>Read Article</Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Blog Grid */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-2xl font-bold mb-8">Latest Articles</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[...Array(6)].map((_, index) => (
              <Card key={index} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="aspect-video bg-gray-100 flex items-center justify-center">
                    <span className="text-gray-400">Article Image</span>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center text-gray-500 text-sm mb-2">
                      <span>April {index + 1}, 2025</span>
                      <span className="mx-2">•</span>
                      <span>4 min read</span>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Article Title {index + 1}</h3>
                    <p className="text-gray-600 mb-4">A brief overview of the article content, providing readers with a glimpse into what they can expect.</p>
                    <Link to="#" className={`${colorClasses.text} font-medium flex items-center`}>
                      Read More <Clock className="ml-2 h-4 w-4" />
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
      {/* Categories */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-2xl font-bold mb-6">Categories</h2>
          
          <div className="flex flex-wrap gap-4">
            {["Industry News", "Tips & Tricks", "Case Studies", "Tutorials", "Company Updates", "Resources"].map((category, index) => (
              <Link key={index} to="#" className="px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-800">
                {category}
              </Link>
            ))}
          </div>
        </div>
      </section>
      
      {/* Newsletter */}
      <section className={`${colorClasses.bg} text-white py-12`}>
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-2xl font-bold mb-4">Subscribe to Our Newsletter</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Stay up to date with our latest articles and industry insights delivered directly to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <input 
              type="email" 
              placeholder="Your email address" 
              className="px-4 py-3 rounded text-gray-800 focus:outline-none focus:ring-2 focus:ring-white/50 w-full sm:w-auto max-w-md mx-auto sm:mx-0"
            />
            <Button variant="outline" className="border-white text-white hover:bg-white/10">
              Subscribe
            </Button>
          </div>
        </div>
      </section>
      
      <Footer 
        logo={template}
        description={description}
        basePath={basePath}
        navItems={navItems}
        contactInfo={contactInfo}
      />
    </div>
  );
};

export const ContactPageGenericComponent = ({ template, title, description, logo, basePath, navItems, contactInfo, primaryColor = "purple" }: TemplateData & { template: string, title: string, primaryColor?: string }) => {
  const { colorClasses, templateType } = useTemplateTheme();
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar 
        logo={logo} 
        basePath={basePath}
        navItems={navItems}
        ctaText="Contact" 
        ctaLink={`/${basePath}/contact`}
      />
      
      {/* Template-specific User Menu */}
      <div className="absolute top-4 right-6 z-50">
        <UserMenu isTemplate={true} templatePath={basePath} />
      </div>
      
      {/* Theme Color Switcher */}
      <ThemeControls templateType={templateType} />
      
      {/* Contact Hero Section */}
      <section className={`${colorClasses.bg} text-white py-16`}>
        <div className="container mx-auto px-6">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{title}</h1>
          <p className="text-xl max-w-2xl">We'd love to hear from you. Reach out with any questions or inquiries.</p>
        </div>
      </section>
      
      {/* Contact Content */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-12">
            <div className="lg:w-1/2">
              <h2 className="text-2xl font-bold mb-6">Get in Touch</h2>
              <ContactForm />
            </div>
            
            <div className="lg:w-1/2">
              <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="space-y-6">
                  <div className="flex items-start">
                    <MapPin className={`${colorClasses.text} h-6 w-6 mr-3 flex-shrink-0`} />
                    <div>
                      <h3 className="font-semibold mb-1">Address</h3>
                      <p className="text-gray-600">{contactInfo.address}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Phone className={`${colorClasses.text} h-6 w-6 mr-3 flex-shrink-0`} />
                    <div>
                      <h3 className="font-semibold mb-1">Phone</h3>
                      <p className="text-gray-600">{contactInfo.phone}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Mail className={`${colorClasses.text} h-6 w-6 mr-3 flex-shrink-0`} />
                    <div>
                      <h3 className="font-semibold mb-1">Email</h3>
                      <p className="text-gray-600">{contactInfo.email}</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8">
                  <h3 className="font-semibold mb-3">Business Hours</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex justify-between">
                      <span>Monday - Friday</span>
                      <span>9:00 AM - 6:00 PM</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Saturday</span>
                      <span>10:00 AM - 4:00 PM</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Sunday</span>
                      <span>Closed</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-8">
                <h3 className="font-semibold mb-3">Location</h3>
                <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                  <span className="text-gray-400">Map Placeholder</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-2xl font-bold mb-10 text-center">Frequently Asked Questions</h2>
          
          <div className="max-w-3xl mx-auto space-y-6">
            {[
              { q: "How can I schedule a consultation?", a: "You can schedule a consultation by filling out our contact form, calling our office, or sending us an email." },
              { q: "What are your response times?", a: "We typically respond to all inquiries within 24 business hours." },
              { q: "Do you offer virtual meetings?", a: "Yes, we offer both in-person and virtual meeting options to accommodate your preferences." },
              { q: "How do I request a quote?", a: "You can request a quote by contacting us directly or by using the dedicated form on our website." }
            ].map((faq, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="font-semibold mb-2">{faq.q}</h3>
                <p className="text-gray-600">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      <Footer 
        logo={template}
        description={description}
        basePath={basePath}
        navItems={navItems}
        contactInfo={contactInfo}
      />
    </div>
  );
};

export const TemplatePage: React.FC<{
  children: React.ReactNode;
  title: string;
  description: string;
  logo: string;
  basePath: string;
  navItems: { name: string; path: string }[];
  contactInfo: { address: string; phone: string; email: string };
  headerBgColor?: string;
}> = ({ children, title, description, logo, basePath, navItems, contactInfo, headerBgColor }) => {
  return (
    <div className="min-h-screen">
      <Navbar 
        logo={logo} 
        basePath={basePath}
        navItems={navItems}
        ctaText="Contact" 
        ctaLink={`/${basePath}/contact`}
      />
      {children}
      <Footer 
        logo={basePath.charAt(0).toUpperCase() + basePath.slice(1)}
        description={description}
        basePath={basePath}
        navItems={navItems}
        contactInfo={contactInfo}
      />
    </div>
  );
};
