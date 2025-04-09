
import { lazy } from "react";
import { RouteConfig } from "../types/template";
import { serviceProData } from "../data/serviceProData";
import { 
  AboutPageComponent, 
  ServicesPageComponent, 
  BlogPageComponent, 
  ContactPageGenericComponent 
} from "../components/generic/GenericTemplatePages";

// Lazy load templates
const ServiceHome = lazy(() => import("../templates/service/Home"));
const ServiceAuth = lazy(() => import("../pages/Auth")); // Reuse main Auth component for now

export const ServiceAbout = () => (
  <AboutPageComponent
    template="ServicePro"
    title="About ServicePro"
    description={serviceProData.description}
    logo={serviceProData.logo}
    basePath={serviceProData.basePath}
    navItems={serviceProData.navItems}
    contactInfo={serviceProData.contactInfo}
    primaryColor="teal"
  />
);

export const ServiceServices = () => (
  <ServicesPageComponent
    template="ServicePro"
    title="Our Services"
    serviceType="Services"
    description={serviceProData.description}
    logo={serviceProData.logo}
    basePath={serviceProData.basePath}
    navItems={serviceProData.navItems}
    contactInfo={serviceProData.contactInfo}
    primaryColor="teal"
  />
);

export const ServiceBlog = () => (
  <BlogPageComponent
    template="ServicePro"
    title="ServicePro Blog"
    description={serviceProData.description}
    logo={serviceProData.logo}
    basePath={serviceProData.basePath}
    navItems={serviceProData.navItems}
    contactInfo={serviceProData.contactInfo}
    primaryColor="teal"
  />
);

export const ServiceContact = () => (
  <ContactPageGenericComponent
    template="ServicePro"
    title="Contact ServicePro"
    description={serviceProData.description}
    logo={serviceProData.logo}
    basePath={serviceProData.basePath}
    navItems={serviceProData.navItems}
    contactInfo={serviceProData.contactInfo}
    primaryColor="teal"
  />
);

export const serviceRoutes: RouteConfig[] = [
  {
    path: "/service",
    element: <ServiceHome />,
  },
  {
    path: "/service/about",
    element: <ServiceAbout />,
  },
  {
    path: "/service/services",
    element: <ServiceServices />,
  },
  {
    path: "/service/blog",
    element: <ServiceBlog />,
  },
  {
    path: "/service/contact",
    element: <ServiceContact />,
  },
  {
    path: "/service/auth",
    element: <ServiceAuth />,
  },
];
