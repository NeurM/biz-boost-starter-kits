
import { lazy, Suspense } from "react";
import { RouteConfig } from "./types/template";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import SavedWebsites from "./pages/SavedWebsites";

// Import routes from route files
import { tradecraftRoutes } from "./routes/tradecraftRoutes";
import { retailRoutes } from "./routes/retailRoutes";
import { expertRoutes } from "./routes/expertRoutes";
import { serviceRoutes } from "./routes/serviceRoutes";

// Lazy load templates
const CleanSlate = lazy(() => import("./templates/cleanslate/CleanSlate"));

// Export components and data for use in other files
export { 
  TemplatePage, 
  AboutPageComponent, 
  ServicesPageComponent, 
  BlogPageComponent, 
  ContactPageGenericComponent 
} from "./components/generic/GenericTemplatePages";

// Create a wrapper component for Suspense boundaries
const SuspenseWrapper = ({ children }) => (
  <Suspense fallback={<div className="w-full h-screen flex items-center justify-center">Loading...</div>}>
    {children}
  </Suspense>
);

// Base routes
const baseRoutes: RouteConfig[] = [
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
      <SuspenseWrapper>
        <CleanSlate />
      </SuspenseWrapper>
    ),
  },
  {
    path: "*",
    element: <NotFound />,
  },
];

// Process template routes to add Suspense boundaries
const processRoutes = (routes: RouteConfig[]): RouteConfig[] => {
  return routes.map(route => {
    // If element already has Suspense boundary, leave it alone
    if (route.element.type === SuspenseWrapper || 
        (typeof route.element.type === 'function' && 
         route.element.type.name !== 'lazy')) {
      return route;
    }
    
    // Add Suspense boundary to lazy-loaded components
    return {
      ...route,
      element: <SuspenseWrapper>{route.element}</SuspenseWrapper>
    };
  });
};

// Combine all routes with proper Suspense boundaries
export const routes: RouteConfig[] = [
  ...baseRoutes,
  ...processRoutes(tradecraftRoutes),
  ...processRoutes(retailRoutes),
  ...processRoutes(expertRoutes),
  ...processRoutes(serviceRoutes),
];
