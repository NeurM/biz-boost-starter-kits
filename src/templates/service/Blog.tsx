
import React from 'react';
import { serviceProData } from '../../data/serviceProData';
import { TemplatePage } from '../../components/generic/GenericTemplatePages';

const ServiceBlog = () => {
  return (
    <TemplatePage
      title="ServicePro Blog"
      description={serviceProData.description}
      logo={serviceProData.logo}
      basePath={serviceProData.basePath}
      navItems={serviceProData.navItems}
      contactInfo={serviceProData.contactInfo}
    >
      <div className="container mx-auto px-6 py-16">
        <h1 className="text-3xl font-bold mb-10">ServicePro Blog</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((post) => (
            <div key={post} className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="h-48 bg-gray-200"></div>
              <div className="p-6">
                <span className="text-teal-600 text-sm font-medium">Category</span>
                <h2 className="text-xl font-semibold mt-2 mb-3">Blog Post Title {post}</h2>
                <p className="text-gray-600 mb-4">
                  A short description of the blog post that gives readers a preview of what the content is about.
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">April {post + 2}, 2025</span>
                  <button className="text-teal-600 font-medium">Read more</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </TemplatePage>
  );
};

export default ServiceBlog;
