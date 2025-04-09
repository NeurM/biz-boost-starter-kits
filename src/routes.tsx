import { lazy, Suspense } from "react";
import { Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import SavedWebsites from "./pages/SavedWebsites";

// Lazy load templates
const CleanSlate = lazy(() => import("./templates/cleanslate/CleanSlate"));
const TradeHome = lazy(() => import("./templates/tradecraft/Home"));
const RetailHome = lazy(() => import("./templates/retail/Home"));
const ServiceHome = lazy(() => import("./templates/service/Home"));
const ExpertHome = lazy(() => import("./templates/expert/Home"));

// Import or lazy load the remaining pages
const TradecraftContact = lazy(() => import("./templates/tradecraft/Contact"));
const TradecraftAuth = lazy(() => import("./templates/tradecraft/Auth"));

// Generic components for page templates
const AboutPageComponent = ({ template, title, description, logo, basePath, navItems, contactInfo }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <h1>{title}</h1>
      <p>About page for {template} template</p>
    </div>
  );
};

const ServicesPageComponent = ({ template, title, serviceType, description, logo, basePath, navItems, contactInfo }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <h1>{title}</h1>
      <p>{serviceType} page for {template} template</p>
    </div>
  );
};

const BlogPageComponent = ({ template, title, description, logo, basePath, navItems, contactInfo }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <h1>{title}</h1>
      <p>Blog page for {template} template</p>
    </div>
  );
};

const ContactPageGenericComponent = ({ template, title, description, logo, basePath, navItems, contactInfo }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <h1>{title}</h1>
      <p>Contact page for {template} template</p>
    </div>
  );
};

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

const serviceProData = {
  logo: "Service<span class='text-teal-600'>Pro</span>",
  description: "Professional services for businesses and individuals.",
  basePath: "service",
  navItems: [
    { name: "Home", path: "/service" },
    { name: "About", path: "/service/about" },
    { name: "Services", path: "/service/services" },
    { name: "Blog", path: "/service/blog" },
    { name: "Contact", path: "/service/contact" },
  ],
  contactInfo: {
    address: "123 Service Ave, Professional Park, SP 54321",
    phone: "(555) 123-9876",
    email: "info@servicepro.com",
  }
};

const TradecraftAbout = () => (
  <AboutPageComponent
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
  <ServicesPageComponent
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
  <BlogPageComponent
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
  <AboutPageComponent
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
  <ServicesPageComponent
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
  <BlogPageComponent
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
  <ContactPageGenericComponent
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
  <AboutPageComponent
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
  <ServicesPageComponent
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
  <BlogPageComponent
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
  <ContactPageGenericComponent
    template="LocalExpert"
    title="Contact LocalExpert"
    description={expertData.description}
    logo={expertData.logo}
    basePath={expertData.basePath}
    navItems={expertData.navItems}
    contactInfo={expertData.contactInfo}
  />
);

const ServiceProAbout = () => (
  <AboutPageComponent
    template="ServicePro"
    title="About ServicePro"
    description={serviceProData.description}
    logo={serviceProData.logo}
    basePath={serviceProData.basePath}
    navItems={serviceProData.navItems}
    contactInfo={serviceProData.contactInfo}
  />
);

const ServiceProServices = () => (
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

const ServiceProBlog = () => (
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

const ServiceProContact = () => (
  <ContactPageGenericComponent
    template="ServicePro"
    title="Contact ServicePro"
    description={serviceProData.description}
    logo={serviceProData.logo}
    basePath={serviceProData.basePath}
    navItems={serviceProData.navItems}
    contactInfo={serviceProData.contactInfo}
  />
);

export const routes = [
  {
    path: "/",
    element: <Index />,
  },
  {
    path: "/saved-websites",
    element: <SavedWebsites />,
  },
  {
    path: "/auth",
    element: <Auth />,
  },
  {
    path: "/cleanslate",
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <CleanSlate />
      </Suspense>
    ),
  },
  {
    path: "/tradecraft",
    element: <TradeHome />,
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
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <TradecraftContact />
      </Suspense>
    ),
  },
  {
    path: "/tradecraft/auth",
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <TradecraftAuth />
      </Suspense>
    ),
  },
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
  {
    path: "/service",
    element: <ServiceHome />,
  },
  {
    path: "/service/about",
    element: <ServiceProAbout />,
  },
  {
    path: "/service/services",
    element: <ServiceProServices />,
  },
  {
    path: "/service/blog",
    element: <ServiceProBlog />,
  },
  {
    path: "/service/contact",
    element: <ServiceProContact />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
];
