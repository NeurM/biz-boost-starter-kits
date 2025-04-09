
import { TemplateData } from "../types/template";

export const tradecraftData: TemplateData = {
  logo: "Trade<span class='text-blue-600'>Craft</span>",
  description: "Your trusted partner for professional trade services.",
  basePath: "tradecraft",
  navItems: [
    { name: "Home", path: "/tradecraft" },
    { name: "About", path: "/tradecraft/about" },
    { name: "Services", path: "/tradecraft/services" },
    { name: "Blog", path: "/tradecraft/blog" },
    { name: "Contact", path: "/tradecraft/contact" },
  ],
  contactInfo: {
    address: "123 Trade Street, Tradeville, TV 12345",
    phone: "(555) 456-7890",
    email: "info@tradecraft.com",
  }
};
