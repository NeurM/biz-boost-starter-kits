
import React from 'react';

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
    <div className={`glass-card ${className} hover:shadow-xl transition-shadow duration-300`}>
      <div className="p-6 relative">
        {/* Quote mark */}
        <div className="absolute top-4 left-4 text-6xl text-gray-200 font-serif leading-none z-0">"</div>
        
        <div className="flex flex-col gap-4 relative z-10">
          <div className="relative pt-5">
            <p className="text-gray-700 italic">{quote}</p>
          </div>
          
          <div className="flex items-center mt-4 pt-4 border-t border-gray-100">
            {imgSrc ? (
              <div className="mr-4">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-md">
                  <img
                    src={imgSrc}
                    alt={author}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            ) : (
              <div className="mr-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-xl font-semibold text-gray-500 border-2 border-white shadow-md">
                  {author.charAt(0)}
                </div>
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
            
            {/* Star rating */}
            <div className="ml-auto flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg 
                  key={star}
                  className="w-4 h-4 text-yellow-400 fill-current" 
                  viewBox="0 0 24 24"
                >
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Testimonial;
