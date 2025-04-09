
import { TemplateData } from "../types/template";

export const expertData: TemplateData = {
  logo: "Local<span class='text-yellow-600'>Expert</span>",
  description: "Professional expertise for your local needs.",
  basePath: "expert",
  navItems: [
    { name: "Home", path: "/expert" },
    { name: "About", path: "/expert/about" },
    { name: "Services", path: "/expert/services" },
    { name: "Blog", path: "/expert/blog" },
    { name: "Contact", path: "/expert/contact" },
  ],
  contactInfo: {
    address: "789 Expert Lane, Expertville, EV 54321",
    phone: "(555) 987-6543",
    email: "info@localexpert.com",
  }
};
