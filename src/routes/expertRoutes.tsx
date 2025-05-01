
import { lazy, Suspense } from "react";
import { RouteConfig } from "../types/template";
import { expertData } from "../data/expertData";
import { 
  AboutPageComponent, 
  ServicesPageComponent, 
  BlogPageComponent, 
  ContactPageGenericComponent 
} from "../components/generic/GenericTemplatePages";

// Loading fallback
const Loading = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
  </div>
);

// Lazy load templates
const ExpertHome = lazy(() => import("../templates/expert/Home"));
const ExpertAuth = lazy(() => import("../pages/Auth")); // Reuse main Auth component for now

// Wrap components with Suspense
const SuspenseWrapper = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<Loading />}>
    {children}
  </Suspense>
);

export const ExpertAbout = () => (
  <SuspenseWrapper>
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
  </SuspenseWrapper>
);

export const ExpertServices = () => (
  <SuspenseWrapper>
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
  </SuspenseWrapper>
);

export const ExpertBlog = () => (
  <SuspenseWrapper>
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
  </SuspenseWrapper>
);

export const ExpertContact = () => (
  <SuspenseWrapper>
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
  </SuspenseWrapper>
);

export const expertRoutes: RouteConfig[] = [
  {
    path: "/expert",
    element: <SuspenseWrapper><ExpertHome /></SuspenseWrapper>,
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
    element: <SuspenseWrapper><ExpertAuth /></SuspenseWrapper>,
  },
];
