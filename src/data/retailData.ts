
import { TemplateData } from "../types/template";

export const retailData: TemplateData = {
  logo: "Retail<span class='text-green-600'>Ready</span>",
  description: "Quality products for your everyday needs.",
  basePath: "retail",
  navItems: [
    { name: "Home", path: "/retail" },
    { name: "About", path: "/retail/about" },
    { name: "Products", path: "/retail/products" },
    { name: "Blog", path: "/retail/blog" },
    { name: "Contact", path: "/retail/contact" },
  ],
  contactInfo: {
    address: "456 Shop Avenue, Retailville, RV 67890",
    phone: "(555) 123-4567",
    email: "info@retailready.com",
  }
};
