
import { RouteObject } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import CleanSlate from "./templates/cleanslate/CleanSlate";
import TradecraftHome from "./templates/tradecraft/Home";
import TradecraftContact from "./templates/tradecraft/Contact";
import TradecraftAuth from "./templates/tradecraft/Auth";
import RetailHome from "./templates/retail/Home";
import ExpertHome from "./templates/expert/Home";
import { Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { Card, CardContent } from "./components/ui/card";
import { Button } from "./components/ui/button";
import { ChevronRight, FileText, Info, MapPin, MessageSquare, Users } from "lucide-react";

// Create general template components for reusability
const TemplatePage = ({ 
  title, 
  description, 
  logo, 
  basePath, 
  navItems, 
  contactInfo,
  children 
}: {
  title: string;
  description: string;
  logo: string | React.ReactNode;
  basePath: string;
  navItems: Array<{ name: string; path: string; }>;
  contactInfo: {
    address: string;
    phone: string;
    email: string;
  };
  children: React.ReactNode;
}) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar
        logo={logo}
        basePath={basePath}
        navItems={navItems}
        ctaText={basePath === "expert" || basePath === "tradecraft" ? "Contact Us" : undefined}
        ctaLink={`/${basePath}/contact`}
      />
      
      <main className="flex-grow">
        {children}
      </main>
      
      <Footer
        logo={typeof logo === "string" ? logo : basePath.charAt(0).toUpperCase() + basePath.slice(1)}
        description={description}
        basePath={basePath}
        navItems={navItems}
        contactInfo={contactInfo}
      />
    </div>
  );
};

// Generic About Page
const AboutPage = ({ 
  template, 
  title,
  description, 
  logo, 
  basePath, 
  navItems, 
  contactInfo 
}: { 
  template: string;
  title: string;
  description: string;
  logo: string | React.ReactNode;
  basePath: string;
  navItems: Array<{ name: string; path: string; }>;
  contactInfo: {
    address: string;
    phone: string;
    email: string;
  };
}) => {
  return (
    <TemplatePage 
      title={title}
      description={description}
      logo={logo}
      basePath={basePath}
      navItems={navItems}
      contactInfo={contactInfo}
    >
      <div className="py-12 bg-blue-700 text-white">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold">{title}</h1>
          <p className="text-xl mt-2 text-blue-100">Learn more about our company and mission</p>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div>
            <h2 className="text-2xl font-bold mb-4">Our Story</h2>
            <p className="text-gray-600 mb-4">
              Founded in 2015, {template} has been dedicated to providing exceptional 
              {basePath === "retail" ? " products" : " services"} to our customers. 
              Our journey began with a simple mission: to deliver quality and value in everything we do.
            </p>
            <p className="text-gray-600">
              Over the years, we've grown from a small local business to a trusted name in the industry,
              serving thousands of satisfied customers across the region.
            </p>
          </div>
          <div className="bg-gray-200 rounded-lg h-64 flex items-center justify-center">
            <span className="text-gray-500 text-lg">Company Image</span>
          </div>
        </div>
        
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: "Quality", description: "We never compromise on the quality of our offerings." },
              { title: "Integrity", description: "We conduct our business with honesty and transparency." },
              { title: "Innovation", description: "We continuously strive to improve and innovate." }
            ].map((value, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-2">{value.title}</h3>
                  <p className="text-gray-500">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        
        <div>
          <h2 className="text-2xl font-bold mb-6">Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { name: "Jane Doe", role: "CEO & Founder" },
              { name: "John Smith", role: "Operations Manager" },
              { name: "Emily Johnson", role: "Customer Relations" },
              { name: "Michael Brown", role: "Lead Developer" }
            ].map((member, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-md transition-shadow">
                <div className="h-48 bg-gray-300 flex items-center justify-center">
                  <Users className="h-12 w-12 text-gray-500" />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold">{member.name}</h3>
                  <p className="text-gray-500 text-sm">{member.role}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </TemplatePage>
  );
};

// Generic Services/Products Page
const ServicesPage = ({ 
  template, 
  title,
  serviceType, // "Services" or "Products"
  description, 
  logo, 
  basePath, 
  navItems, 
  contactInfo 
}: { 
  template: string;
  title: string;
  serviceType: string;
  description: string;
  logo: string | React.ReactNode;
  basePath: string;
  navItems: Array<{ name: string; path: string; }>;
  contactInfo: {
    address: string;
    phone: string;
    email: string;
  };
}) => {
  const items = basePath === "retail" 
    ? [
        { title: "Premium Collection", description: "Our flagship line of high-quality products designed for the discerning customer." },
        { title: "Everyday Essentials", description: "Affordable products for daily use without compromising on quality." },
        { title: "Limited Editions", description: "Exclusive products available for a limited time only." },
        { title: "Featured Deals", description: "Special offers and discounted products updated regularly." },
        { title: "New Arrivals", description: "The latest additions to our product catalog, fresh from our suppliers." },
        { title: "Bestsellers", description: "Our most popular products that customers love and keep coming back for." }
      ]
    : [
        { title: "Consultation", description: "Expert advice and guidance tailored to your specific needs and requirements." },
        { title: "Implementation", description: "Professional execution of solutions based on the consultation findings." },
        { title: "Maintenance", description: "Ongoing support and maintenance to ensure everything runs smoothly." },
        { title: "Training", description: "Comprehensive training sessions for you and your team." },
        { title: "Support", description: "Dedicated customer support available when you need assistance." },
        { title: "Analysis", description: "In-depth analysis and reporting to help you make informed decisions." }
      ];
  
  return (
    <TemplatePage 
      title={title}
      description={description}
      logo={logo}
      basePath={basePath}
      navItems={navItems}
      contactInfo={contactInfo}
    >
      <div className="py-12 bg-blue-700 text-white">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold">{title}</h1>
          <p className="text-xl mt-2 text-blue-100">
            {basePath === "retail" 
              ? "Browse our selection of high-quality products" 
              : "Discover our professional and reliable services"}
          </p>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Our {serviceType}</h2>
          <p className="max-w-2xl mx-auto text-gray-600">
            {basePath === "retail" 
              ? "We offer a wide range of quality products to meet your needs. Browse our catalog and find exactly what you're looking for."
              : "We provide a comprehensive range of professional services tailored to meet the unique needs of our clients."}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {items.map((item, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                <p className="text-gray-600 mb-4">{item.description}</p>
                <Button variant="outline" className="flex items-center gap-2">
                  Learn More <ChevronRight className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="bg-gray-100 p-8 rounded-lg">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0 md:mr-6">
              <h3 className="text-2xl font-bold mb-2">Need a custom solution?</h3>
              <p className="text-gray-600">
                {basePath === "retail" 
                  ? "Can't find what you're looking for? We can help with custom orders."
                  : "Have a specific requirement? We offer customized services to meet your needs."}
              </p>
            </div>
            <Button asChild size="lg">
              <a href={`/${basePath}/contact`}>Contact Us</a>
            </Button>
          </div>
        </div>
      </div>
    </TemplatePage>
  );
};

// Generic Blog Page
const BlogPage = ({ 
  template, 
  title,
  description, 
  logo, 
  basePath, 
  navItems, 
  contactInfo 
}: { 
  template: string;
  title: string;
  description: string;
  logo: string | React.ReactNode;
  basePath: string;
  navItems: Array<{ name: string; path: string; }>;
  contactInfo: {
    address: string;
    phone: string;
    email: string;
  };
}) => {
  const blogPosts = [
    {
      title: "Industry Trends for 2025",
      excerpt: "Discover the latest trends shaping our industry and how they might impact your business in the coming year.",
      date: "April 5, 2025",
      category: basePath === "retail" ? "Products" : "Services",
      readTime: "5 min read"
    },
    {
      title: "Customer Success Stories",
      excerpt: "Read about how our clients have benefited from working with us and achieved their goals.",
      date: "March 22, 2025",
      category: "Case Studies",
      readTime: "8 min read"
    },
    {
      title: "Behind the Scenes",
      excerpt: "Take a peek behind the curtain and see how we operate and what makes our company special.",
      date: "March 15, 2025",
      category: "Company News",
      readTime: "4 min read"
    },
    {
      title: "Tips and Tricks",
      excerpt: "Helpful advice and insights to get the most out of our products and services.",
      date: "February 28, 2025",
      category: "Resources",
      readTime: "6 min read"
    },
    {
      title: "Meet the Team",
      excerpt: "Get to know the passionate individuals who make our company what it is today.",
      date: "February 14, 2025",
      category: "Company News",
      readTime: "7 min read"
    },
    {
      title: "Q&A with Industry Experts",
      excerpt: "We sit down with leading experts to discuss current challenges and opportunities in the field.",
      date: "January 30, 2025",
      category: "Interviews",
      readTime: "10 min read"
    }
  ];
  
  return (
    <TemplatePage 
      title={title}
      description={description}
      logo={logo}
      basePath={basePath}
      navItems={navItems}
      contactInfo={contactInfo}
    >
      <div className="py-12 bg-blue-700 text-white">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold">{title}</h1>
          <p className="text-xl mt-2 text-blue-100">News, insights, and updates from our team</p>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post, index) => (
            <Card key={index} className="overflow-hidden hover:shadow-md transition-shadow">
              <div className="h-48 bg-gray-200 flex items-center justify-center">
                <FileText className="h-12 w-12 text-gray-400" />
              </div>
              <CardContent className="p-6">
                <div className="flex justify-between items-center text-sm text-gray-500 mb-2">
                  <span>{post.date}</span>
                  <span>{post.readTime}</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
                <p className="text-gray-600 mb-4">{post.excerpt}</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm bg-gray-100 text-gray-600 px-2 py-1 rounded">{post.category}</span>
                  <Button variant="link" className="p-0">Read More</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <Button>Load More Articles</Button>
        </div>
      </div>
    </TemplatePage>
  );
};

// Generic Contact Page for Expert and RetailReady templates
const ContactPageGeneric = ({ 
  template, 
  title,
  description, 
  logo, 
  basePath, 
  navItems, 
  contactInfo 
}: { 
  template: string;
  title: string;
  description: string;
  logo: string | React.ReactNode;
  basePath: string;
  navItems: Array<{ name: string; path: string; }>;
  contactInfo: {
    address: string;
    phone: string;
    email: string;
  };
}) => {
  return (
    <TemplatePage 
      title={title}
      description={description}
      logo={logo}
      basePath={basePath}
      navItems={navItems}
      contactInfo={contactInfo}
    >
      <div className="py-12 bg-blue-700 text-white">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold">{title}</h1>
          <p className="text-xl mt-2 text-blue-100">Get in touch with our team</p>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-1">
            <div className="space-y-10">
              <div>
                <h2 className="text-2xl font-bold mb-4">Contact Information</h2>
                <p className="text-gray-600 mb-6">
                  Reach out to us by phone, email, or visiting our office. Our team is ready to assist you.
                </p>
              </div>
              
              <Card className="overflow-hidden border-blue-200">
                <CardContent className="p-0">
                  <div className="flex items-center p-6 border-b">
                    <Info className="h-6 w-6 text-blue-600 mr-4" />
                    <div>
                      <h3 className="font-semibold text-lg">{template}</h3>
                      <p className="text-gray-600">{description}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center p-6 border-b">
                    <MessageSquare className="h-6 w-6 text-blue-600 mr-4" />
                    <div>
                      <h3 className="font-semibold text-lg">Phone</h3>
                      <p className="text-gray-600">{contactInfo.phone}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center p-6 border-b">
                    <MapPin className="h-6 w-6 text-blue-600 mr-4" />
                    <div>
                      <h3 className="font-semibold text-lg">Address</h3>
                      <p className="text-gray-600">{contactInfo.address}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-6">Send Us a Message</h2>
                <form className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                      <input
                        type="text"
                        id="name"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        id="email"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Your email"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                    <input
                      type="text"
                      id="subject"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Subject"
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                    <textarea
                      id="message"
                      rows={5}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Your message"
                    ></textarea>
                  </div>
                  <Button type="submit" className="w-full">Send Message</Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </TemplatePage>
  );
};

// Template-specific data
const tradecraftData = {
  logo: "Trade<span class='text-blue-600'>Craft</span>",
  description: "Your trusted partner for professional trade services.",
  basePath: "tradecraft",
  navItems: [
    { name: "Home", path: "/tradecraft" },
    { name: "About", path: "/tradecraft/about" },
    { name: "Services", path: "/tradecraft/services" },
    { name: "Blog", path: "/tradecraft/blog" },
    { name: "Contact", path: "/tradecraft/contact" },
  ],
  contactInfo: {
    address: "123 Trade Street, Tradeville, TV 12345",
    phone: "(555) 456-7890",
    email: "info@tradecraft.com",
  }
};

const retailData = {
  logo: "Retail<span class='text-green-600'>Ready</span>",
  description: "Quality products for your everyday needs.",
  basePath: "retail",
  navItems: [
    { name: "Home", path: "/retail" },
    { name: "About", path: "/retail/about" },
    { name: "Products", path: "/retail/products" },
    { name: "Blog", path: "/retail/blog" },
    { name: "Contact", path: "/retail/contact" },
  ],
  contactInfo: {
    address: "456 Shop Avenue, Retailville, RV 67890",
    phone: "(555) 123-4567",
    email: "info@retailready.com",
  }
};

const expertData = {
  logo: "Local<span class='text-yellow-600'>Expert</span>",
  description: "Professional expertise for your local needs.",
  basePath: "expert",
  navItems: [
    { name: "Home", path: "/expert" },
    { name: "About", path: "/expert/about" },
    { name: "Services", path: "/expert/services" },
    { name: "Blog", path: "/expert/blog" },
    { name: "Contact", path: "/expert/contact" },
  ],
  contactInfo: {
    address: "789 Expert Lane, Expertville, EV 54321",
    phone: "(555) 987-6543",
    email: "info@localexpert.com",
  }
};

// Template-specific placeholders
const TradecraftAbout = () => (
  <AboutPage
    template="TradeCraft"
    title="About TradeCraft"
    description={tradecraftData.description}
    logo={tradecraftData.logo}
    basePath={tradecraftData.basePath}
    navItems={tradecraftData.navItems}
    contactInfo={tradecraftData.contactInfo}
  />
);

const TradecraftServices = () => (
  <ServicesPage
    template="TradeCraft"
    title="Our Services"
    serviceType="Services"
    description={tradecraftData.description}
    logo={tradecraftData.logo}
    basePath={tradecraftData.basePath}
    navItems={tradecraftData.navItems}
    contactInfo={tradecraftData.contactInfo}
  />
);

const TradecraftBlog = () => (
  <BlogPage
    template="TradeCraft"
    title="TradeCraft Blog"
    description={tradecraftData.description}
    logo={tradecraftData.logo}
    basePath={tradecraftData.basePath}
    navItems={tradecraftData.navItems}
    contactInfo={tradecraftData.contactInfo}
  />
);

const RetailAbout = () => (
  <AboutPage
    template="RetailReady"
    title="About RetailReady"
    description={retailData.description}
    logo={retailData.logo}
    basePath={retailData.basePath}
    navItems={retailData.navItems}
    contactInfo={retailData.contactInfo}
  />
);

const RetailProducts = () => (
  <ServicesPage
    template="RetailReady"
    title="Our Products"
    serviceType="Products"
    description={retailData.description}
    logo={retailData.logo}
    basePath={retailData.basePath}
    navItems={retailData.navItems}
    contactInfo={retailData.contactInfo}
  />
);

const RetailBlog = () => (
  <BlogPage
    template="RetailReady"
    title="RetailReady Blog"
    description={retailData.description}
    logo={retailData.logo}
    basePath={retailData.basePath}
    navItems={retailData.navItems}
    contactInfo={retailData.contactInfo}
  />
);

const RetailContact = () => (
  <ContactPageGeneric
    template="RetailReady"
    title="Contact RetailReady"
    description={retailData.description}
    logo={retailData.logo}
    basePath={retailData.basePath}
    navItems={retailData.navItems}
    contactInfo={retailData.contactInfo}
  />
);

const ExpertAbout = () => (
  <AboutPage
    template="LocalExpert"
    title="About LocalExpert"
    description={expertData.description}
    logo={expertData.logo}
    basePath={expertData.basePath}
    navItems={expertData.navItems}
    contactInfo={expertData.contactInfo}
  />
);

const ExpertServices = () => (
  <ServicesPage
    template="LocalExpert"
    title="Our Services"
    serviceType="Services"
    description={expertData.description}
    logo={expertData.logo}
    basePath={expertData.basePath}
    navItems={expertData.navItems}
    contactInfo={expertData.contactInfo}
  />
);

const ExpertBlog = () => (
  <BlogPage
    template="LocalExpert"
    title="LocalExpert Blog"
    description={expertData.description}
    logo={expertData.logo}
    basePath={expertData.basePath}
    navItems={expertData.navItems}
    contactInfo={expertData.contactInfo}
  />
);

const ExpertContact = () => (
  <ContactPageGeneric
    template="LocalExpert"
    title="Contact LocalExpert"
    description={expertData.description}
    logo={expertData.logo}
    basePath={expertData.basePath}
    navItems={expertData.navItems}
    contactInfo={expertData.contactInfo}
  />
);

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <Index />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
  // Clean Slate Template
  {
    path: "/cleanslate",
    element: <CleanSlate />,
  },
  // Tradecraft Template
  {
    path: "/tradecraft",
    element: <TradecraftHome />,
  },
  {
    path: "/tradecraft/about",
    element: <TradecraftAbout />,
  },
  {
    path: "/tradecraft/services",
    element: <TradecraftServices />,
  },
  {
    path: "/tradecraft/blog",
    element: <TradecraftBlog />,
  },
  {
    path: "/tradecraft/contact",
    element: <TradecraftContact />,
  },
  {
    path: "/tradecraft/auth",
    element: <TradecraftAuth />,
  },
  // Retail Template
  {
    path: "/retail",
    element: <RetailHome />,
  },
  {
    path: "/retail/about",
    element: <RetailAbout />,
  },
  {
    path: "/retail/products",
    element: <RetailProducts />,
  },
  {
    path: "/retail/blog",
    element: <RetailBlog />,
  },
  {
    path: "/retail/contact",
    element: <RetailContact />,
  },
  // Expert Template
  {
    path: "/expert",
    element: <ExpertHome />,
  },
  {
    path: "/expert/about",
    element: <ExpertAbout />,
  },
  {
    path: "/expert/services",
    element: <ExpertServices />,
  },
  {
    path: "/expert/blog",
    element: <ExpertBlog />,
  },
  {
    path: "/expert/contact",
    element: <ExpertContact />,
  },
];
