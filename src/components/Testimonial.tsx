
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";

interface TestimonialProps {
  quote: string;
  author: string;
  role?: string;
  company?: string;
  imgSrc?: string;
  className?: string;
}

const Testimonial = ({
  quote,
  author,
  role,
  company,
  imgSrc,
  className = ""
}: TestimonialProps) => {
  return (
    <Card className={`overflow-hidden ${className}`}>
      <CardContent className="p-6">
        <div className="flex flex-col gap-4">
          <div className="relative">
            <span className="absolute text-gray-300 text-6xl font-serif -top-6 -left-2">"</span>
            <p className="text-gray-700 italic relative z-10 pl-4">{quote}</p>
          </div>
          
          <div className="flex items-center mt-2">
            {imgSrc && (
              <div className="mr-4">
                <img
                  src={imgSrc}
                  alt={author}
                  className="w-12 h-12 rounded-full object-cover"
                />
              </div>
            )}
            
            <div>
              <p className="font-semibold text-gray-900">{author}</p>
              {(role || company) && (
                <p className="text-sm text-gray-600">
                  {role}{role && company && ", "}{company}
                </p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Testimonial;
