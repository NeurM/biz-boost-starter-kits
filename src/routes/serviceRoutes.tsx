
import { lazy, Suspense } from "react";
import { RouteConfig } from "../types/template";
import { serviceProData } from "../data/serviceProData";
import { 
  ServicesPageComponent, 
  BlogPageComponent, 
  ContactPageGenericComponent 
} from "../components/generic/GenericTemplatePages";
import { ErrorBoundary } from "react-error-boundary";

// Loading component
const Loading = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
  </div>
);

// Error fallback
const ErrorFallback = ({error}: {error?: Error}) => (
  <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-red-50">
    <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h2>
    <p className="text-gray-700 mb-4">We've encountered an error while loading the service template.</p>
    {error && (
      <div className="mb-4 p-4 bg-red-100 rounded max-w-md overflow-auto">
        <p className="font-medium text-red-800">{error.message}</p>
      </div>
    )}
    <a href="/" className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700">
      Return to Home
    </a>
  </div>
);

// Lazy load templates with error handling
const ServiceHome = lazy(() => import("../templates/service/Home"));
const ServiceAbout = lazy(() => import("../templates/service/About"));
const ServiceAuth = lazy(() => import("../pages/Auth")); // Reuse main Auth component for now

// Wrap component with error boundary and suspense
const withErrorHandling = (Component: React.ComponentType) => {
  return () => (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Suspense fallback={<Loading />}>
        <Component />
      </Suspense>
    </ErrorBoundary>
  );
};

export const ServiceServices = withErrorHandling(() => (
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
));

export const ServiceBlog = withErrorHandling(() => (
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
));

export const ServiceContact = withErrorHandling(() => (
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
));

export const serviceRoutes: RouteConfig[] = [
  {
    path: "/service",
    element: withErrorHandling(ServiceHome)(),
  },
  {
    path: "/service/about",
    element: withErrorHandling(ServiceAbout)(),
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
    element: withErrorHandling(ServiceAuth)(),
  },
];
