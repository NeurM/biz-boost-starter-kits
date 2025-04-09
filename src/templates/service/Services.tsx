
import React from 'react';
import { serviceProData } from '../../data/serviceProData';
import { ServicesPageComponent } from '../../components/generic/GenericTemplatePages';

const ServiceServices = () => {
  return (
    <ServicesPageComponent
      template="ServicePro"
      title="Our Services"
      serviceType="Services"
      description={serviceProData.description}
      logo={serviceProData.logo}
      basePath={serviceProData.basePath}
      navItems={serviceProData.navItems}
      contactInfo={serviceProData.contactInfo}
    />
  );
};

export default ServiceServices;
