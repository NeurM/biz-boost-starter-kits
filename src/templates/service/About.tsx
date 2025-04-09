
import React from 'react';
import { serviceProData } from '../../data/serviceProData';
import { AboutPageComponent } from '../../components/generic/GenericTemplatePages';

const ServiceAbout = () => {
  return (
    <AboutPageComponent
      template="ServicePro"
      title="About ServicePro"
      description={serviceProData.description}
      logo={serviceProData.logo}
      basePath={serviceProData.basePath}
      navItems={serviceProData.navItems}
      contactInfo={serviceProData.contactInfo}
      primaryColor="teal"
    />
  );
};

export default ServiceAbout;
