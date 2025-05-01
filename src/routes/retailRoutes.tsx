
import { lazy, Suspense } from "react";
import { RouteConfig } from "../types/template";
import { retailData } from "../data/retailData";
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
    <p className="text-gray-700 mb-4">Error loading retail template.</p>
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
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
  </div>
);

// Lazy load templates
const RetailHome = lazy(() => import("../templates/retail/Home"));
const RetailAuth = lazy(() => import("../pages/Auth")); // Reuse main Auth component for now

// Wrap components with Suspense and ErrorBoundary
const SuspenseWrapper = ({ children }: { children: React.ReactNode }) => (
  <ErrorBoundary FallbackComponent={ErrorFallback}>
    <Suspense fallback={<Loading />}>
      {children}
    </Suspense>
  </ErrorBoundary>
);

export const RetailAbout = () => (
  <SuspenseWrapper>
    <AboutPageComponent
      template="RetailReady"
      title="About RetailReady"
      description={retailData.description}
      logo={retailData.logo}
      basePath={retailData.basePath}
      navItems={retailData.navItems}
      contactInfo={retailData.contactInfo}
      primaryColor="purple"
    />
  </SuspenseWrapper>
);

export const RetailProducts = () => (
  <SuspenseWrapper>
    <ServicesPageComponent
      template="RetailReady"
      title="Our Products"
      serviceType="Products"
      description={retailData.description}
      logo={retailData.logo}
      basePath={retailData.basePath}
      navItems={retailData.navItems}
      contactInfo={retailData.contactInfo}
      primaryColor="purple"
    />
  </SuspenseWrapper>
);

export const RetailBlog = () => (
  <SuspenseWrapper>
    <BlogPageComponent
      template="RetailReady"
      title="RetailReady Blog"
      description={retailData.description}
      logo={retailData.logo}
      basePath={retailData.basePath}
      navItems={retailData.navItems}
      contactInfo={retailData.contactInfo}
      primaryColor="purple"
    />
  </SuspenseWrapper>
);

export const RetailContact = () => (
  <SuspenseWrapper>
    <ContactPageGenericComponent
      template="RetailReady"
      title="Contact RetailReady"
      description={retailData.description}
      logo={retailData.logo}
      basePath={retailData.basePath}
      navItems={retailData.navItems}
      contactInfo={retailData.contactInfo}
      primaryColor="purple"
    />
  </SuspenseWrapper>
);

export const retailRoutes: RouteConfig[] = [
  {
    path: "/retail",
    element: <SuspenseWrapper><RetailHome /></SuspenseWrapper>,
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
    path: "/retail/auth",
    element: <SuspenseWrapper><RetailAuth /></SuspenseWrapper>,
  },
];
