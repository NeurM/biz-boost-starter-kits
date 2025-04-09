
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

export const ServiceProAbout = () => (
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

export const ServiceProServices = () => (
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

export const ServiceProBlog = () => (
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

export const ServiceProContact = () => (
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

export const serviceRoutes: RouteConfig[] = [
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
];
