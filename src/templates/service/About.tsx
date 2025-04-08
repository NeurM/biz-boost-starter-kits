
import React from 'react';
import { AboutPage } from '../../routes';

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
    <AboutPage
      template="ServicePro"
      title="About ServicePro"
      description={serviceProData.description}
      logo={serviceProData.logo}
      basePath={serviceProData.basePath}
      navItems={serviceProData.navItems}
      contactInfo={serviceProData.contactInfo}
    />
  );
};

export default ServiceAbout;
