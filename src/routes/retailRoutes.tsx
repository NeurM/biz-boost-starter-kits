
import { lazy } from "react";
import { RouteConfig } from "../types/template";
import { retailData } from "../data/retailData";
import { 
  AboutPageComponent, 
  ServicesPageComponent, 
  BlogPageComponent, 
  ContactPageGenericComponent 
} from "../components/generic/GenericTemplatePages";

// Lazy load templates
const RetailHome = lazy(() => import("../templates/retail/Home"));

export const RetailAbout = () => (
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

export const RetailProducts = () => (
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

export const RetailBlog = () => (
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

export const RetailContact = () => (
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

export const retailRoutes: RouteConfig[] = [
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
];
