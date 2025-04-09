
import React from 'react';
import { serviceProData } from '../../data/serviceProData';
import { AboutPageComponent } from '../../components/generic/GenericTemplatePages';

const ServiceAbout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <h1>About ServicePro</h1>
      <p>{serviceProData.description}</p>
    </div>
  );
};

export default ServiceAbout;
