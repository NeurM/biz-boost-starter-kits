
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Code } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

const CodeDownloader = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // Get website data from session storage if available
  const getWebsiteData = () => {
    try {
      const sessionData = sessionStorage.getItem('companyData');
      if (sessionData) {
        return JSON.parse(sessionData);
      }
    } catch (error) {
      console.error('Error reading session storage:', error);
    }
    return null;
  };

  const websiteData = getWebsiteData();
  const companyName = websiteData?.companyName || 'MyCompany';
  const templateId = websiteData?.template || 'website';
  const colorScheme = websiteData?.colorScheme || 'blue';
  const secondaryColorScheme = websiteData?.secondaryColorScheme || 'gray';

  const downloadFullCode = async () => {
    setIsLoading(true);
    try {
      // Create a zip file with all the necessary React components
      const zip = new JSZip();
      
      // Add package.json
      zip.file("package.json", `
{
  "name": "${companyName.toLowerCase().replace(/\s+/g, '-')}",
  "version": "0.1.0",
  "private": true,
  "dependencies": {
    "@testing-library/jest-dom": "^5.16.5",
    "@testing-library/react": "^13.4.0",
    "@testing-library/user-event": "^13.5.0",
    "@types/jest": "^27.5.2",
    "@types/node": "^16.18.12",
    "@types/react": "^18.0.28",
    "@types/react-dom": "^18.0.11",
    "classnames": "^2.3.2",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.8.1",
    "react-scripts": "5.0.1",
    "typescript": "^4.9.5"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject",
    "deploy": "gh-pages -d build"
  },
  "eslintConfig": {
    "extends": [
      "react-app",
      "react-app/jest"
    ]
  },
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  },
  "devDependencies": {
    "autoprefixer": "^10.4.13",
    "gh-pages": "^5.0.0",
    "postcss": "^8.4.21",
    "tailwindcss": "^3.2.7"
  }
}
      `);

      // Add tailwind.config.js
      zip.file("tailwind.config.js", `
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        secondary: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
      },
    },
  },
  plugins: [],
};
      `);

      // Add postcss.config.js
      zip.file("postcss.config.js", `
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
      `);

      // Add .gitignore
      zip.file(".gitignore", `
# dependencies
/node_modules
/.pnp
.pnp.js

# testing
/coverage

# production
/build

# misc
.DS_Store
.env.local
.env.development.local
.env.test.local
.env.production.local

npm-debug.log*
yarn-debug.log*
yarn-error.log*
      `);

      // Add GitHub workflow
      const workflowsDir = zip.folder(".github/workflows");
      workflowsDir.file("deploy.yml", `
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v2
        
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '16'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build
        run: npm run build
        
      - name: Deploy to GitHub Pages
        uses: JamesIves/github-pages-deploy-action@v4
        with:
          folder: build
      `);

      // Add README.md
      zip.file("README.md", `
# ${companyName} Website

This is a React website for ${companyName}, built with React, TypeScript, and Tailwind CSS.

## Getting Started

1. Install dependencies:
\`\`\`bash
npm install
\`\`\`

2. Run the development server:
\`\`\`bash
npm start
\`\`\`

3. Build for production:
\`\`\`bash
npm run build
\`\`\`

4. Deploy to GitHub Pages:
\`\`\`bash
npm run deploy
\`\`\`

## Project Structure

- \`src/components\`: Reusable UI components
- \`src/pages\`: Main page components
- \`src/hooks\`: Custom React hooks
- \`src/utils\`: Utility functions
- \`src/types\`: TypeScript type definitions
- \`src/assets\`: Static assets (images, fonts, etc.)

## Features

- Responsive design with Tailwind CSS
- TypeScript for type safety
- React Router for navigation
- GitHub Actions for CI/CD
      `);

      // Create the src directory and essential files
      const srcDir = zip.folder("src");

      // Add index.tsx
      srcDir.file("index.tsx", `
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
      `);

      // Add index.css with Tailwind directives
      srcDir.file("index.css", `
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
      `);

      // Add App.tsx
      srcDir.file("App.tsx", `
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/Home';
import AboutPage from './pages/About';
import ServicesPage from './pages/Services';
import ContactPage from './pages/Contact';
import NotFoundPage from './pages/NotFound';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="services" element={<ServicesPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
      `);

      // Create components directory
      const componentsDir = srcDir.folder("components");
      
      // Add Layout component
      componentsDir.file("Layout.tsx", `
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
      `);

      // Add Navbar component
      componentsDir.file("Navbar.tsx", `
import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-${colorScheme}-600">${companyName}</span>
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <NavLink 
                to="/" 
                className={({ isActive }) => 
                  isActive 
                    ? "border-${colorScheme}-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium" 
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                }
                end
              >
                Home
              </NavLink>
              <NavLink 
                to="/about" 
                className={({ isActive }) => 
                  isActive 
                    ? "border-${colorScheme}-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium" 
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                }
              >
                About
              </NavLink>
              <NavLink 
                to="/services" 
                className={({ isActive }) => 
                  isActive 
                    ? "border-${colorScheme}-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium" 
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                }
              >
                Services
              </NavLink>
              <NavLink 
                to="/contact" 
                className={({ isActive }) => 
                  isActive 
                    ? "border-${colorScheme}-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium" 
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                }
              >
                Contact
              </NavLink>
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <button 
              className="bg-${colorScheme}-600 hover:bg-${colorScheme}-700 text-white px-4 py-2 rounded"
            >
              Get Started
            </button>
          </div>
          <div className="-mr-2 flex items-center sm:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-${colorScheme}-500"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className={isMenuOpen ? "hidden h-6 w-6" : "block h-6 w-6"}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              <svg
                className={isMenuOpen ? "block h-6 w-6" : "hidden h-6 w-6"}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className={isMenuOpen ? "sm:hidden" : "hidden sm:hidden"}>
        <div className="pt-2 pb-3 space-y-1">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive
                ? "bg-${colorScheme}-50 border-${colorScheme}-500 text-${colorScheme}-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
                : "border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
            }
            end
          >
            Home
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) =>
              isActive
                ? "bg-${colorScheme}-50 border-${colorScheme}-500 text-${colorScheme}-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
                : "border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
            }
          >
            About
          </NavLink>
          <NavLink
            to="/services"
            className={({ isActive }) =>
              isActive
                ? "bg-${colorScheme}-50 border-${colorScheme}-500 text-${colorScheme}-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
                : "border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
            }
          >
            Services
          </NavLink>
          <NavLink
            to="/contact"
            className={({ isActive }) =>
              isActive
                ? "bg-${colorScheme}-50 border-${colorScheme}-500 text-${colorScheme}-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
                : "border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
            }
          >
            Contact
          </NavLink>
        </div>
        <div className="pt-4 pb-3 border-t border-gray-200">
          <div className="mt-3 px-2 space-y-1">
            <button 
              className="w-full text-left block px-3 py-2 rounded-md text-base font-medium bg-${colorScheme}-600 text-white"
            >
              Get Started
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
      `);

      // Add Footer component
      componentsDir.file("Footer.tsx", `
import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-gray-300">
      <div className="max-w-7xl mx-auto py-12 px-4 overflow-hidden sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Company</h3>
            <ul className="mt-4 space-y-4">
              <li>
                <Link to="/about" className="text-base text-gray-300 hover:text-white">
                  About
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-base text-gray-300 hover:text-white">
                  Services
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-base text-gray-300 hover:text-white">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Resources</h3>
            <ul className="mt-4 space-y-4">
              <li>
                <a href="#" className="text-base text-gray-300 hover:text-white">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="text-base text-gray-300 hover:text-white">
                  Knowledge Base
                </a>
              </li>
              <li>
                <a href="#" className="text-base text-gray-300 hover:text-white">
                  FAQ
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Legal</h3>
            <ul className="mt-4 space-y-4">
              <li>
                <a href="#" className="text-base text-gray-300 hover:text-white">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-base text-gray-300 hover:text-white">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Connect</h3>
            <div className="flex space-x-6 mt-4">
              <a href="#" className="text-gray-400 hover:text-gray-300">
                <span className="sr-only">Facebook</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-300">
                <span className="sr-only">Twitter</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-300">
                <span className="sr-only">LinkedIn</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm12.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-700 pt-8 md:flex md:items-center md:justify-between">
          <div className="mt-8 md:mt-0 md:order-1">
            <p className="text-base text-gray-400">&copy; ${new Date().getFullYear()} ${companyName}. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
      `);

      // Create a Hero component
      componentsDir.file("Hero.tsx", `
import React from 'react';

interface HeroProps {
  title: string;
  subtitle: string;
  ctaText?: string;
  ctaLink?: string;
  backgroundImage?: string;
}

const Hero: React.FC<HeroProps> = ({
  title,
  subtitle,
  ctaText = "Get Started",
  ctaLink = "#",
  backgroundImage,
}) => {
  return (
    <div className="relative bg-${colorScheme}-700 overflow-hidden">
      {backgroundImage && (
        <div className="absolute inset-0">
          <img
            className="w-full h-full object-cover"
            src={backgroundImage}
            alt="Background"
          />
          <div className="absolute inset-0 bg-${colorScheme}-700 opacity-75"></div>
        </div>
      )}
      <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
          {title}
        </h1>
        <p className="mt-6 max-w-3xl text-xl text-${colorScheme}-100">
          {subtitle}
        </p>
        <div className="mt-10">
          <a
            href={ctaLink}
            className="inline-block bg-white py-3 px-8 rounded-md font-medium text-${colorScheme}-600 hover:bg-gray-100"
          >
            {ctaText}
          </a>
        </div>
      </div>
    </div>
  );
};

export default Hero;
      `);

      // Create a Feature component
      componentsDir.file("Feature.tsx", `
import React from 'react';

interface FeatureProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
}

const Feature: React.FC<FeatureProps> = ({ icon, title, description }) => {
  return (
    <div className="flex flex-col items-start">
      {icon && (
        <div className="inline-flex items-center justify-center p-2 bg-${colorScheme}-100 text-${colorScheme}-600 rounded-lg">
          {icon}
        </div>
      )}
      <h3 className="mt-4 text-lg font-medium text-gray-900">{title}</h3>
      <p className="mt-2 text-base text-gray-500">{description}</p>
    </div>
  );
};

export default Feature;
      `);

      // Create a Contact Form component
      componentsDir.file("ContactForm.tsx", `
import React, { useState } from 'react';

const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you'd send the form data to your server here
    console.log('Form submitted:', formData);
    alert('Thank you for your message! We will get back to you soon.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <form className="grid grid-cols-1 gap-y-6" onSubmit={handleSubmit}>
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Name
        </label>
        <div className="mt-1">
          <input
            type="text"
            name="name"
            id="name"
            autoComplete="name"
            required
            value={formData.name}
            onChange={handleChange}
            className="py-3 px-4 block w-full shadow-sm focus:ring-${colorScheme}-500 focus:border-${colorScheme}-500 border-gray-300 rounded-md"
          />
        </div>
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <div className="mt-1">
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="py-3 px-4 block w-full shadow-sm focus:ring-${colorScheme}-500 focus:border-${colorScheme}-500 border-gray-300 rounded-md"
          />
        </div>
      </div>
      <div>
        <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
          Subject
        </label>
        <div className="mt-1">
          <input
            type="text"
            name="subject"
            id="subject"
            required
            value={formData.subject}
            onChange={handleChange}
            className="py-3 px-4 block w-full shadow-sm focus:ring-${colorScheme}-500 focus:border-${colorScheme}-500 border-gray-300 rounded-md"
          />
        </div>
      </div>
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700">
          Message
        </label>
        <div className="mt-1">
          <textarea
            id="message"
            name="message"
            rows={4}
            required
            value={formData.message}
            onChange={handleChange}
            className="py-3 px-4 block w-full shadow-sm focus:ring-${colorScheme}-500 focus:border-${colorScheme}-500 border border-gray-300 rounded-md"
          />
        </div>
      </div>
      <div>
        <button
          type="submit"
          className="w-full inline-flex items-center justify-center py-3 px-6 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-${colorScheme}-600 hover:bg-${colorScheme}-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${colorScheme}-500"
        >
          Send Message
        </button>
      </div>
    </form>
  );
};

export default ContactForm;
      `);

      // Create pages directory
      const pagesDir = srcDir.folder("pages");

      // Add Home page
      pagesDir.file("Home.tsx", `
import React from 'react';
import Hero from '../components/Hero';
import Feature from '../components/Feature';

const HomePage: React.FC = () => {
  // Sample features
  const features = [
    {
      title: 'Feature 1',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      icon: (
        <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
    },
    {
      title: 'Feature 2',
      description: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      icon: (
        <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
        </svg>
      ),
    },
    {
      title: 'Feature 3',
      description: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
      icon: (
        <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
    },
  ];

  return (
    <div>
      <Hero
        title="${companyName}"
        subtitle="Welcome to our website. We provide the best services in the industry."
        ctaText="Learn More"
        ctaLink="/about"
      />

      <div className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-${colorScheme}-600 font-semibold tracking-wide uppercase">Features</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              A better way to do business
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus magnam voluptatum cupiditate.
            </p>
          </div>

          <div className="mt-10">
            <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, index) => (
                <Feature
                  key={index}
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-${colorScheme}-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-${colorScheme}-600 font-semibold tracking-wide uppercase">Testimonials</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              What our customers say
            </p>
          </div>
          <div className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-600">JD</span>
                </div>
                <div className="ml-4">
                  <h4 className="font-bold">John Doe</h4>
                  <p className="text-sm text-gray-500">CEO, Company A</p>
                </div>
              </div>
              <p className="text-gray-600">"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero."</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-600">JS</span>
                </div>
                <div className="ml-4">
                  <h4 className="font-bold">Jane Smith</h4>
                  <p className="text-sm text-gray-500">CTO, Company B</p>
                </div>
              </div>
              <p className="text-gray-600">"Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet."</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-600">RJ</span>
                </div>
                <div className="ml-4">
                  <h4 className="font-bold">Robert Johnson</h4>
                  <p className="text-sm text-gray-500">Founder, Company C</p>
                </div>
              </div>
              <p className="text-gray-600">"Fusce nec tellus sed augue semper porta. Mauris massa. Vestibulum lacinia arcu eget nulla."</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-${colorScheme}-700 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-${colorScheme}-200 font-semibold tracking-wide uppercase">Call to Action</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-white sm:text-4xl">
              Ready to get started?
            </p>
            <p className="mt-4 max-w-2xl text-xl text-${colorScheme}-200 lg:mx-auto">
              Join us today and take your business to the next level.
            </p>
            <div className="mt-8 flex justify-center">
              <a
                href="/contact"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-${colorScheme}-700 bg-white hover:bg-${colorScheme}-50"
              >
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
      `);

      // Add About page
      pagesDir.file("About.tsx", `
import React from 'react';

const AboutPage: React.FC = () => {
  return (
    <div>
      <div className="bg-${colorScheme}-700 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-white">About Us</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center">
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Our Story
            </h2>
            <p className="mt-3 max-w-3xl text-lg text-gray-500">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, 
              nunc sit amet ultricies lacinia, nisi nisl aliquam nunc, vitae aliquam
              nisl nisl sit amet nunc. Nullam euismod, nunc sit amet ultricies lacinia,
              nisi nisl aliquam nunc, vitae aliquam nisl nisl sit amet nunc.
            </p>
            <p className="mt-3 max-w-3xl text-lg text-gray-500">
              Nullam euismod, nunc sit amet ultricies lacinia, nisi nisl aliquam nunc,
              vitae aliquam nisl nisl sit amet nunc. Nullam euismod, nunc sit amet ultricies
              lacinia, nisi nisl aliquam nunc, vitae aliquam nisl nisl sit amet nunc.
            </p>
          </div>
          <div className="mt-10 lg:mt-0">
            <div className="bg-gray-100 rounded-lg overflow-hidden">
              <div className="h-64 bg-gray-200 flex items-center justify-center">
                <span className="text-gray-400 text-lg">Company Image</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Our Mission
          </h2>
          <p className="mt-3 max-w-3xl text-lg text-gray-500">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, 
            nunc sit amet ultricies lacinia, nisi nisl aliquam nunc, vitae aliquam
            nisl nisl sit amet nunc. Nullam euismod, nunc sit amet ultricies lacinia,
            nisi nisl aliquam nunc, vitae aliquam nisl nisl sit amet nunc.
          </p>
        </div>

        <div className="mt-16">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Our Team
          </h2>
          <div className="mt-10 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((person) => (
              <div key={person} className="relative">
                <div className="h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                  <span className="text-gray-400 text-lg">Team Member {person}</span>
                </div>
                <div className="mt-4">
                  <h3 className="text-lg font-medium text-gray-900">Team Member {person}</h3>
                  <p className="text-sm text-gray-500">Position</p>
                  <p className="mt-2 text-sm text-gray-500">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, 
                    nunc sit amet ultricies lacinia.
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
      `);

      // Add Services page
      pagesDir.file("Services.tsx", `
import React from 'react';

const ServicesPage: React.FC = () => {
  // Sample services
  const services = [
    {
      title: 'Service 1',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      icon: (
        <svg className="h-8 w-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      title: 'Service 2',
      description: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      icon: (
        <svg className="h-8 w-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
      ),
    },
    {
      title: 'Service 3',
      description: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
      icon: (
        <svg className="h-8 w-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
    },
    {
      title: 'Service 4',
      description: 'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      icon: (
        <svg className="h-8 w-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
        </svg>
      ),
    },
    {
      title: 'Service 5',
      description: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.',
      icon: (
        <svg className="h-8 w-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
    },
    {
      title: 'Service 6',
      description: 'Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur.',
      icon: (
        <svg className="h-8 w-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
        </svg>
      ),
    },
  ];

  return (
    <div>
      <div className="bg-${colorScheme}-700 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-white">Our Services</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
        <div className="text-center">
          <h2 className="text-base font-semibold text-${colorScheme}-600 tracking-wide uppercase">
            Services
          </h2>
          <p className="mt-1 text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            What We Offer
          </p>
          <p className="max-w-xl mt-5 mx-auto text-xl text-gray-500">
            We provide top-notch services tailored to your specific needs.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <div key={index} className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="text-${colorScheme}-500 mb-4">
                  {service.icon}
                </div>
                <h3 className="text-lg font-medium text-gray-900">{service.title}</h3>
                <p className="mt-2 text-sm text-gray-500">
                  {service.description}
                </p>
              </div>
              <div className="bg-gray-50 px-4 py-4 sm:px-6">
                <div className="text-sm">
                  <a href="#" className="font-medium text-${colorScheme}-600 hover:text-${colorScheme}-500">
                    Learn more <span aria-hidden="true">&rarr;</span>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16">
          <h2 className="text-3xl font-extrabold text-gray-900">
            Our Process
          </h2>
          <div className="mt-8 flex flex-col md:flex-row justify-between">
            <div className="flex flex-col items-center mb-8 md:mb-0">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-${colorScheme}-100 text-${colorScheme}-600">
                1
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">Discovery</h3>
              <p className="mt-2 text-center text-sm text-gray-500 max-w-xs">
                We analyze your needs and requirements
              </p>
            </div>
            <div className="hidden md:block w-8 h-1 bg-gray-200 self-center"></div>
            <div className="flex flex-col items-center mb-8 md:mb-0">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-${colorScheme}-100 text-${colorScheme}-600">
                2
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">Planning</h3>
              <p className="mt-2 text-center text-sm text-gray-500 max-w-xs">
                We create a detailed action plan
              </p>
            </div>
            <div className="hidden md:block w-8 h-1 bg-gray-200 self-center"></div>
            <div className="flex flex-col items-center mb-8 md:mb-0">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-${colorScheme}-100 text-${colorScheme}-600">
                3
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">Execution</h3>
              <p className="mt-2 text-center text-sm text-gray-500 max-w-xs">
                We implement the solution
              </p>
            </div>
            <div className="hidden md:block w-8 h-1 bg-gray-200 self-center"></div>
            <div className="flex flex-col items-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-${colorScheme}-100 text-${colorScheme}-600">
                4
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">Support</h3>
              <p className="mt-2 text-center text-sm text-gray-500 max-w-xs">
                We provide ongoing maintenance and support
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-${colorScheme}-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">
              Ready to get started?
            </h2>
            <p className="mt-4 text-lg text-gray-500">
              Contact us today to discuss how we can help your business thrive.
            </p>
            <div className="mt-8">
              <a
                href="/contact"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-${colorScheme}-600 hover:bg-${colorScheme}-700"
              >
                Contact Us Now
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicesPage;
      `);

      // Add Contact page
      pagesDir.file("Contact.tsx", `
import React from 'react';
import ContactForm from '../components/ContactForm';

const ContactPage: React.FC = () => {
  return (
    <div>
      <div className="bg-${colorScheme}-700 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-white">Contact Us</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-8">
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900">
              Get in Touch
            </h2>
            <p className="mt-4 text-lg text-gray-500">
              Have a question or want to learn more about our services?
              Send us a message and we'll get back to you as soon as possible.
            </p>
            
            <div className="mt-8 space-y-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-${colorScheme}-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div className="ml-3 text-base text-gray-500">
                  <p>(123) 456-7890</p>
                </div>
              </div>
              
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-${colorScheme}-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="ml-3 text-base text-gray-500">
                  <p>info@example.com</p>
                </div>
              </div>
              
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-${colorScheme}-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div className="ml-3 text-base text-gray-500">
                  <p>123 Main St, Anytown, USA 12345</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-12 lg:mt-0">
            <div className="bg-white py-10 px-6 shadow-lg rounded-lg sm:px-10">
              <h3 className="text-lg font-medium text-gray-900 mb-6">Send a Message</h3>
              <ContactForm />
            </div>
          </div>
        </div>
        
        <div className="mt-16">
          <h3 className="text-lg font-medium text-gray-900 mb-6">Our Location</h3>
          <div className="h-96 bg-gray-300 rounded-lg overflow-hidden">
            {/* In a real app, you would embed a map here */}
            <div className="w-full h-full flex items-center justify-center text-gray-500">
              Google Map would be embedded here
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
      `);

      // Add NotFound page
      pagesDir.file("NotFound.tsx", `
import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white px-4 py-16 sm:px-6 sm:py-24 md:grid md:place-items-center lg:px-8">
      <div className="max-w-max mx-auto">
        <main className="sm:flex">
          <p className="text-4xl font-extrabold text-${colorScheme}-600 sm:text-5xl">404</p>
          <div className="sm:ml-6">
            <div className="sm:border-l sm:border-gray-200 sm:pl-6">
              <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">
                Page not found
              </h1>
              <p className="mt-1 text-base text-gray-500">
                Please check the URL in the address bar and try again.
              </p>
            </div>
            <div className="mt-10 flex space-x-3 sm:border-l sm:border-transparent sm:pl-6">
              <Link
                to="/"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-${colorScheme}-600 hover:bg-${colorScheme}-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${colorScheme}-500"
              >
                Go back home
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-${colorScheme}-700 bg-${colorScheme}-100 hover:bg-${colorScheme}-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${colorScheme}-500"
              >
                Contact support
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default NotFoundPage;
      `);

      // Generate and download the zip file
      const content = await zip.generateAsync({ type: "blob" });
      
      // Use FileSaver.js to save the zip
      saveAs(content, `${companyName.toLowerCase().replace(/\s+/g, '-')}-code.zip`);

      toast({
        title: "Download Complete",
        description: "Complete website code downloaded successfully!"
      });
    } catch (error) {
      console.error('Error downloading website code:', error);
      toast({
        title: "Download Failed",
        description: "An error occurred while downloading the website code.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Download Project Code</CardTitle>
        <CardDescription>
          Download your website code for local development or hosting
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-500 mb-6">
          Download a complete React project with all the components and styles needed for your website.
          The downloaded project includes:
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="flex flex-col items-start p-4 bg-gray-50 rounded-lg">
            <Code className="text-blue-500 mb-2" />
            <h3 className="font-medium">React Components</h3>
            <p className="text-sm text-gray-500">Fully functional React components</p>
          </div>
          <div className="flex flex-col items-start p-4 bg-gray-50 rounded-lg">
            <svg className="h-5 w-5 text-blue-500 mb-2" viewBox="0 0 54 33" fill="currentColor">
              <path fillRule="evenodd" clipRule="evenodd" d="M27 0C19.9 0 15.95 3.91 15.95 9.516c0 5.205 4.007 7.96 9.075 7.96 1.679 0 3.192-.204 4.238-.613 1.584-.613 2.366-1.787 2.366-2.832 0-.811-.511-1.583-1.837-1.583-.409 0-.92.102-1.43.204-1.43.307-2.86.511-3.78.511-3.272 0-5.23-1.379-5.23-3.86 0-3.764 2.85-5.923 8.258-5.923 1.924 0 4.321.307 6.04.818 1.277.409 2.401 1.175 2.401 2.299 0 .511-.205.971-.613 1.379-.409.409-.92.613-1.533.613-.92 0-2.093-.818-5.64-.818-1.226 0-1.635.307-1.635.716 0 .511.614.511 1.84.511h.408c4.884 0 9.132 1.736 9.132 6.517 0 .767-.153 1.482-.417 2.144 3.057-3.12 4.884-7.085 4.884-11.776C37.075 4.013 33.517 0 27 0z" />
            </svg>
            <h3 className="font-medium">Tailwind CSS</h3>
            <p className="text-sm text-gray-500">Responsive design with Tailwind</p>
          </div>
        </div>
        
        <Button
          onClick={downloadFullCode}
          disabled={isLoading} 
          className="w-full"
        >
          {isLoading ? "Preparing Download..." : "Download Source Code"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default CodeDownloader;
