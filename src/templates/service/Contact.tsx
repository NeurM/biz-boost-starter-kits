
import React from 'react';
import { ContactPageGeneric } from '../../routes';

const ServiceContact = () => {
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
    <ContactPageGeneric
      template="ServicePro"
      title="Contact ServicePro"
      description={serviceProData.description}
      logo={serviceProData.logo}
      basePath={serviceProData.basePath}
      navItems={serviceProData.navItems}
      contactInfo={serviceProData.contactInfo}
    />
  );
};

export default ServiceContact;
