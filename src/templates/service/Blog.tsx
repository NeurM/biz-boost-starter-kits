
import React from 'react';
import { serviceProData } from '../../data/serviceProData';
import { BlogPageComponent } from '../../components/generic/GenericTemplatePages';

const ServiceBlog = () => {
  return (
    <BlogPageComponent
      template="ServicePro"
      title="ServicePro Blog"
      description={serviceProData.description}
      logo={serviceProData.logo}
      basePath={serviceProData.basePath}
      navItems={serviceProData.navItems}
      contactInfo={serviceProData.contactInfo}
    />
  );
};

export default ServiceBlog;
