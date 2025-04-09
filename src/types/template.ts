
export interface TemplateData {
  description: string;
  logo: string;
  basePath: string;
  navItems: { name: string; path: string }[];
  contactInfo: { address: string; phone: string; email: string };
}

export interface RouteConfig {
  path: string;
  element: React.ReactNode;
}
