
import { lazy } from "react";
import { RouteConfig } from "../types/template";
import { expertData } from "../data/expertData";
import { 
  AboutPageComponent, 
  ServicesPageComponent, 
  BlogPageComponent, 
  ContactPageGenericComponent 
} from "../components/generic/GenericTemplatePages";

// Lazy load templates
const ExpertHome = lazy(() => import("../templates/expert/Home"));
const ExpertAuth = lazy(() => import("../pages/Auth")); // Reuse main Auth component for now

export const ExpertAbout = () => (
  <AboutPageComponent
    template="LocalExpert"
    title="About LocalExpert"
    description={expertData.description}
    logo={expertData.logo}
    basePath={expertData.basePath}
    navItems={expertData.navItems}
    contactInfo={expertData.contactInfo}
    primaryColor="amber"
  />
);

export const ExpertServices = () => (
  <ServicesPageComponent
    template="LocalExpert"
    title="Our Services"
    serviceType="Services"
    description={expertData.description}
    logo={expertData.logo}
    basePath={expertData.basePath}
    navItems={expertData.navItems}
    contactInfo={expertData.contactInfo}
    primaryColor="amber"
  />
);

export const ExpertBlog = () => (
  <BlogPageComponent
    template="LocalExpert"
    title="LocalExpert Blog"
    description={expertData.description}
    logo={expertData.logo}
    basePath={expertData.basePath}
    navItems={expertData.navItems}
    contactInfo={expertData.contactInfo}
    primaryColor="amber"
  />
);

export const ExpertContact = () => (
  <ContactPageGenericComponent
    template="LocalExpert"
    title="Contact LocalExpert"
    description={expertData.description}
    logo={expertData.logo}
    basePath={expertData.basePath}
    navItems={expertData.navItems}
    contactInfo={expertData.contactInfo}
    primaryColor="amber"
  />
);

export const expertRoutes: RouteConfig[] = [
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
    path: "/expert/auth",
    element: <ExpertAuth />,
  },
];
