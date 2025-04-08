
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Clean Slate Template (Single Page)
import CleanSlate from "./templates/cleanslate/CleanSlate";

// Tradecraft Template (Plumber, Electrician)
import TradecraftHome from "./templates/tradecraft/Home";
import TradecraftAbout from "./templates/tradecraft/About";
import TradecraftServices from "./templates/tradecraft/Services";
import TradecraftBlog from "./templates/tradecraft/Blog";
import TradecraftContact from "./templates/tradecraft/Contact";
import TradecraftAuth from "./templates/tradecraft/Auth";

// Retail Ready Template (Retail Store)
import RetailHome from "./templates/retail/Home";
import RetailAbout from "./templates/retail/About";
import RetailProducts from "./templates/retail/Products";
import RetailBlog from "./templates/retail/Blog";
import RetailContact from "./templates/retail/Contact";
import RetailAuth from "./templates/retail/Auth";

// Service Pro Template (Service Business)
import ServiceHome from "./templates/service/Home";
import ServiceAbout from "./templates/service/About";
import ServiceOfferings from "./templates/service/Offerings";
import ServiceBlog from "./templates/service/Blog";
import ServiceContact from "./templates/service/Contact";
import ServiceAuth from "./templates/service/Auth";

// Local Expert Template (Consultant)
import ExpertHome from "./templates/expert/Home";
import ExpertAbout from "./templates/expert/About";
import ExpertServices from "./templates/expert/Services";
import ExpertBlog from "./templates/expert/Blog";
import ExpertContact from "./templates/expert/Contact";
import ExpertAuth from "./templates/expert/Auth";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Main template selector page */}
          <Route path="/" element={<Index />} />
          
          {/* Clean Slate - Single page template */}
          <Route path="/cleanslate" element={<CleanSlate />} />
          
          {/* Tradecraft Template Routes */}
          <Route path="/tradecraft" element={<TradecraftHome />} />
          <Route path="/tradecraft/about" element={<TradecraftAbout />} />
          <Route path="/tradecraft/services" element={<TradecraftServices />} />
          <Route path="/tradecraft/blog" element={<TradecraftBlog />} />
          <Route path="/tradecraft/contact" element={<TradecraftContact />} />
          <Route path="/tradecraft/auth" element={<TradecraftAuth />} />
          
          {/* Retail Template Routes */}
          <Route path="/retail" element={<RetailHome />} />
          <Route path="/retail/about" element={<RetailAbout />} />
          <Route path="/retail/products" element={<RetailProducts />} />
          <Route path="/retail/blog" element={<RetailBlog />} />
          <Route path="/retail/contact" element={<RetailContact />} />
          <Route path="/retail/auth" element={<RetailAuth />} />
          
          {/* Service Pro Template Routes */}
          <Route path="/service" element={<ServiceHome />} />
          <Route path="/service/about" element={<ServiceAbout />} />
          <Route path="/service/offerings" element={<ServiceOfferings />} />
          <Route path="/service/blog" element={<ServiceBlog />} />
          <Route path="/service/contact" element={<ServiceContact />} />
          <Route path="/service/auth" element={<ServiceAuth />} />
          
          {/* Local Expert Template Routes */}
          <Route path="/expert" element={<ExpertHome />} />
          <Route path="/expert/about" element={<ExpertAbout />} />
          <Route path="/expert/services" element={<ExpertServices />} />
          <Route path="/expert/blog" element={<ExpertBlog />} />
          <Route path="/expert/contact" element={<ExpertContact />} />
          <Route path="/expert/auth" element={<ExpertAuth />} />
          
          {/* Catch-all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
