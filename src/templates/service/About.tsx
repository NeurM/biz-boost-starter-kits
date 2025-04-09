
import React from 'react';

const ServiceAbout = () => {
  const serviceProData = {
    logo: "Service<span class='text-teal-600'>Pro</span>",
    description: "Professional services for businesses and individuals.",
    basePath: "service",
    navItems: [
      { name: "Home", path: "/service" },
      { name: "About", path: "/service/about" },
      { name: "Services", path: "/service/services" },
      { name: "Blog", path: "/service/blog" },
      { name: "Contact", path: "/service/contact" },
    ],
    contactInfo: {
      address: "123 Service Ave, Professional Park, SP 54321",
      phone: "(555) 123-9876",
      email: "info@servicepro.com",
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <h1>About ServicePro</h1>
      <p>{serviceProData.description}</p>
    </div>
  );
};

export default ServiceAbout;
