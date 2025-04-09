
import { lazy } from "react";
import { RouteConfig } from "../types/template";

// Lazy load templates
const ServiceHome = lazy(() => import("../templates/service/Home"));
const ServiceAbout = lazy(() => import("../templates/service/About"));
const ServiceBlog = lazy(() => import("../templates/service/Blog"));
const ServiceContact = lazy(() => import("../templates/service/Contact"));
const ServiceServices = lazy(() => import("../templates/service/Services"));

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
];
