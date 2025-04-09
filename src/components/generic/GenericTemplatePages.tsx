
import React from 'react';
import { TemplateData } from '../../types/template';

export const AboutPageComponent = ({ template, title, description, logo, basePath, navItems, contactInfo }: TemplateData & { template: string, title: string }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <h1>{title}</h1>
      <p>About page for {template} template</p>
    </div>
  );
};

export const ServicesPageComponent = ({ template, title, serviceType, description, logo, basePath, navItems, contactInfo }: TemplateData & { template: string, title: string, serviceType: string }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <h1>{title}</h1>
      <p>{serviceType} page for {template} template</p>
    </div>
  );
};

export const BlogPageComponent = ({ template, title, description, logo, basePath, navItems, contactInfo }: TemplateData & { template: string, title: string }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <h1>{title}</h1>
      <p>Blog page for {template} template</p>
    </div>
  );
};

export const ContactPageGenericComponent = ({ template, title, description, logo, basePath, navItems, contactInfo }: TemplateData & { template: string, title: string }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <h1>{title}</h1>
      <p>Contact page for {template} template</p>
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
}> = ({ children, ...props }) => {
  return (
    <div className="min-h-screen">
      {children}
    </div>
  );
};
