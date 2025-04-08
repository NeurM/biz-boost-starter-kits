
import { RouteObject } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Clean Slate Template
import CleanSlate from "./templates/cleanslate/CleanSlate";

// Tradecraft Template (Plumber, Electrician)
import TradecraftHome from "./templates/tradecraft/Home";
import TradecraftContact from "./templates/tradecraft/Contact";
import TradecraftAuth from "./templates/tradecraft/Auth";

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
    path: "/tradecraft/contact",
    element: <TradecraftContact />,
  },
  {
    path: "/tradecraft/auth",
    element: <TradecraftAuth />,
  },
];
