
import { lazy } from "react";
import { RouteConfig } from "../types/template";
import { tradecraftData } from "../data/tradecraftData";
import { 
  AboutPageComponent, 
  ServicesPageComponent, 
  BlogPageComponent 
} from "../components/generic/GenericTemplatePages";

// Lazy load templates
const TradeHome = lazy(() => import("../templates/tradecraft/Home"));
const TradecraftContact = lazy(() => import("../templates/tradecraft/Contact"));
const TradecraftAuth = lazy(() => import("../templates/tradecraft/Auth"));

export const TradecraftAbout = () => (
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

export const TradecraftServices = () => (
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

export const TradecraftBlog = () => (
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

export const tradecraftRoutes: RouteConfig[] = [
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
    element: <TradecraftContact />,
  },
  {
    path: "/tradecraft/auth",
    element: <TradecraftAuth />,
  },
];
