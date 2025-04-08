
import React from 'react';
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Mail, Phone, ArrowRight } from "lucide-react";

const CleanSlate = () => {
  // Navigation items
  const navItems = [
    { name: "Home", path: "/cleanslate" },
    { name: "About", path: "/cleanslate/about" },
    { name: "Services", path: "/cleanslate/services" },
    { name: "Contact", path: "/cleanslate/contact" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header/Navbar */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center justify-between">
            <div className="flex items-center">
              <h1 className="text-xl font-bold">Clean Slate</h1>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-6">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className="text-gray-600 hover:text-gray-900"
                >
                  {item.name}
                </Link>
              ))}
            </div>
            
            {/* Mobile menu button */}
            <div className="md:hidden">
              <button className="text-gray-600 hover:text-gray-900">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gray-50 py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold mb-6">Build Your Vision</h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              This clean slate template gives you the foundation to create something amazing.
              Start building your next great project with this simple, flexible starting point.
            </p>
            <div className="flex justify-center gap-4">
              <Button size="lg">Get Started</Button>
              <Button variant="outline" size="lg">Learn More</Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-12 text-center">Key Features</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white p-6 rounded-lg shadow-md">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <ArrowRight className="h-6 w-6 text-gray-700" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Feature {i}</h3>
                  <p className="text-gray-600">
                    This is where you can highlight the benefits of your product or service.
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gray-800 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Join thousands of satisfied customers who have transformed their business with our solutions.
            </p>
            <Button size="lg" className="bg-white text-gray-800 hover:bg-gray-100">
              Contact Us
            </Button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Clean Slate</h3>
              <p className="text-gray-400">
                Your foundation for building amazing web applications.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Links</h3>
              <ul className="space-y-2">
                {navItems.map((item) => (
                  <li key={item.name}>
                    <Link to={item.path} className="text-gray-400 hover:text-white">
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-center">
                  <Mail className="h-5 w-5 mr-2" />
                  <span>contact@cleanslate.com</span>
                </li>
                <li className="flex items-center">
                  <Phone className="h-5 w-5 mr-2" />
                  <span>(123) 456-7890</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Subscribe</h3>
              <p className="text-gray-400 mb-4">Stay updated with our newsletter</p>
              <div className="flex">
                <input 
                  type="email" 
                  placeholder="Your email" 
                  className="px-4 py-2 rounded-l-md focus:outline-none text-gray-900 w-full"
                />
                <Button className="rounded-l-none">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} Clean Slate. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CleanSlate;
