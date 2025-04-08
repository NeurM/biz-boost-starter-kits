
import { RouteObject } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import CleanSlate from "./templates/cleanslate/CleanSlate";
import TradecraftHome from "./templates/tradecraft/Home";
import TradecraftContact from "./templates/tradecraft/Contact";
import TradecraftAuth from "./templates/tradecraft/Auth";
import RetailHome from "./templates/retail/Home";
import ExpertHome from "./templates/expert/Home";
import { Navigate } from "react-router-dom";

// Create placeholder pages for missing routes
const PlaceholderPage = ({ title }: { title: string }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="text-center max-w-md">
        <h1 className="text-3xl font-bold mb-4">{title}</h1>
        <p className="text-gray-600 mb-6">
          This page is a placeholder. It would be implemented with actual content in a complete application.
        </p>
        <a href="/" className="text-blue-500 hover:text-blue-700 underline">
          Return to Home
        </a>
      </div>
    </div>
  );
};

// Template-specific placeholders
const TradecraftAbout = () => <PlaceholderPage title="Tradecraft - About Us" />;
const TradecraftServices = () => <PlaceholderPage title="Tradecraft - Our Services" />;
const TradecraftBlog = () => <PlaceholderPage title="Tradecraft - Blog" />;

const RetailAbout = () => <PlaceholderPage title="Retail Ready - About Us" />;
const RetailProducts = () => <PlaceholderPage title="Retail Ready - Products" />;
const RetailBlog = () => <PlaceholderPage title="Retail Ready - Blog" />;
const RetailContact = () => <PlaceholderPage title="Retail Ready - Contact Us" />;

const ExpertAbout = () => <PlaceholderPage title="Local Expert - About Us" />;
const ExpertServices = () => <PlaceholderPage title="Local Expert - Services" />;
const ExpertBlog = () => <PlaceholderPage title="Local Expert - Blog" />;
const ExpertContact = () => <PlaceholderPage title="Local Expert - Contact Us" />;

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <Index />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
  // Clean Slate Template
  {
    path: "/cleanslate",
    element: <CleanSlate />,
  },
  // Tradecraft Template
  {
    path: "/tradecraft",
    element: <TradecraftHome />,
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
  // Retail Template
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
  // Expert Template
  {
    path: "/expert",
    element: <ExpertHome />,
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
];
