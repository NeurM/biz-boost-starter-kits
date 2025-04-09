
import React from 'react';
import { serviceProData } from '../../data/serviceProData';
import { ContactPageGenericComponent } from '../../components/generic/GenericTemplatePages';

const ServiceContact = () => {
  return (
    <ContactPageGenericComponent
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
