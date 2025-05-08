
import React from 'react';
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface ServiceCardProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  link?: string;
  linkText?: string;
  className?: string;
}

const ServiceCard = ({
  title,
  description,
  icon,
  link,
  linkText = "Learn More",
  className = ""
}: ServiceCardProps) => {
  // Ensure we have safe rendering even if props are missing
  const safeTitle = title || "Service";
  const safeDescription = description || "Service description";
  
  return (
    <div className={`glass-card card-hover group ${className}`}>
      <div className="p-6">
        {icon && (
          <div className="bg-gray-50 rounded-full w-14 h-14 flex items-center justify-center mb-4 transform transition-transform group-hover:scale-110 group-hover:shadow-md">
            <div className="text-primary">
              {icon}
            </div>
          </div>
        )}
        <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">{safeTitle}</h3>
        <p className="text-gray-600 mb-5">{safeDescription}</p>
        {link && (
          <Button asChild variant="ghost" size="sm" className="p-0 hover:bg-transparent group-hover:text-primary">
            <Link to={link} className="flex items-center">
              {linkText}
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-4 w-4 ml-1 transition-all duration-300 group-hover:translate-x-1" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
};

export default ServiceCard;
