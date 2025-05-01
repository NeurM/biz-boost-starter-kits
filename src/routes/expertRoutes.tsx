
import { lazy, Suspense } from "react";
import { RouteConfig } from "../types/template";
import { expertData } from "../data/expertData";
import { ErrorBoundary } from "react-error-boundary";
import { 
  AboutPageComponent, 
  ServicesPageComponent, 
  BlogPageComponent, 
  ContactPageGenericComponent 
} from "../components/generic/GenericTemplatePages";

// Error fallback
const ErrorFallback = ({error}: {error?: Error}) => (
  <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-red-50">
    <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h2>
    <p className="text-gray-700 mb-4">Error loading expert template.</p>
    {error && (
      <div className="mb-4 p-4 bg-red-100 rounded max-w-md overflow-auto">
        <p className="font-medium text-red-800">{error.message}</p>
      </div>
    )}
    <a href="/" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
      Return to Home
    </a>
  </div>
);

// Loading fallback
const Loading = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
  </div>
);

// Lazy load templates
const ExpertHome = lazy(() => import("../templates/expert/Home"));
const ExpertAuth = lazy(() => import("../pages/Auth")); // Reuse main Auth component for now

// Wrap components with Suspense and ErrorBoundary
const SuspenseWrapper = ({ children }: { children: React.ReactNode }) => (
  <ErrorBoundary FallbackComponent={ErrorFallback}>
    <Suspense fallback={<Loading />}>
      {children}
    </Suspense>
  </ErrorBoundary>
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
