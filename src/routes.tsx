
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
      <Suspense fallback={<div>Loading...</div>}>
        <CleanSlate />
      </Suspense>
    ),
  },
  {
    path: "*",
    element: <NotFound />,
  },
];

// Combine all routes
export const routes: RouteConfig[] = [
  ...baseRoutes,
  ...tradecraftRoutes,
  ...retailRoutes,
  ...expertRoutes,
  ...serviceRoutes,
];
