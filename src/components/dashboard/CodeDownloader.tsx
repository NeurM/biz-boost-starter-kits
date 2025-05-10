
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, Code, GitMerge, Package, Terminal } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getAllWebsiteConfigs } from "@/utils/websiteService";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

// This component provides functionality to download website code and assets
const CodeDownloader = () => {
  const { toast } = useToast();
  const [websites, setWebsites] = useState([]);
  const [selectedWebsiteId, setSelectedWebsiteId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Load websites on component mount
  useEffect(() => {
    const loadWebsites = async () => {
      try {
        const { data, error } = await getAllWebsiteConfigs();
        if (error) throw error;
        
        if (data && data.length > 0) {
          setWebsites(data);
          
          // Check for website ID in session storage
          const savedWebsiteId = sessionStorage.getItem('selectedWebsiteId');
          if (savedWebsiteId && data.some(w => w.id === savedWebsiteId)) {
            setSelectedWebsiteId(savedWebsiteId);
          } else {
            setSelectedWebsiteId(data[0].id);
          }
        }
      } catch (error) {
        console.error('Error loading websites:', error);
      }
    };
    
    loadWebsites();
  }, []);

  // Get the selected website object
  const selectedWebsite = websites.find(w => w.id === selectedWebsiteId);

  const handleSelectWebsite = (event) => {
    setSelectedWebsiteId(event.target.value);
    // Save selection to session storage
    sessionStorage.setItem('selectedWebsiteId', event.target.value);
  };
  
  const downloadFullProject = async () => {
    if (!selectedWebsite) {
      toast({
        title: "No Website Selected",
        description: "Please select a website to download",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const zip = new JSZip();

      // Create folders
      const srcFolder = zip.folder("src");
      const componentsFolder = srcFolder.folder("components");
      const pagesFolder = srcFolder.folder("pages");
      const publicFolder = zip.folder("public");
      
      // Add package.json with necessary dependencies
      zip.file("package.json", `
{
  "name": "${selectedWebsite.company_name.toLowerCase().replace(/\\s+/g, '-')}",
  "version": "0.1.0",
  "private": true,
  "dependencies": {
    "@testing-library/jest-dom": "^5.16.5",
    "@testing-library/react": "^13.4.0",
    "@testing-library/user-event": "^13.5.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.8.1",
    "react-scripts": "5.0.1",
    "web-vitals": "^2.1.4"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject",
    "predeploy": "npm run build",
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
      
      // Add tailwind config
      zip.file("tailwind.config.js", `
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ${selectedWebsite.color_scheme ? `"${selectedWebsite.color_scheme}": {
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
        },` : ''}
        ${selectedWebsite.secondary_color_scheme ? `"${selectedWebsite.secondary_color_scheme}": {
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
        },` : ''}
      },
    },
  },
  plugins: [],
}
      `);
      
      // Add postcss config
      zip.file("postcss.config.js", `
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
      `);
      
      // Add HTML template
      zip.file("public/index.html", `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" href="%PUBLIC_URL%/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#000000" />
    <meta
      name="description"
      content="${selectedWebsite.company_name} - Official Website"
    />
    <link rel="apple-touch-icon" href="%PUBLIC_URL%/logo192.png" />
    <link rel="manifest" href="%PUBLIC_URL%/manifest.json" />
    <title>${selectedWebsite.company_name}</title>
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
  </body>
</html>
      `);
      
      // Add manifest.json
      zip.file("public/manifest.json", `
{
  "short_name": "${selectedWebsite.company_name}",
  "name": "${selectedWebsite.company_name}",
  "icons": [
    {
      "src": "favicon.ico",
      "sizes": "64x64 32x32 24x24 16x16",
      "type": "image/x-icon"
    },
    {
      "src": "logo192.png",
      "type": "image/png",
      "sizes": "192x192"
    },
    {
      "src": "logo512.png",
      "type": "image/png",
      "sizes": "512x512"
    }
  ],
  "start_url": ".",
  "display": "standalone",
  "theme_color": "#000000",
  "background_color": "#ffffff"
}
      `);
      
      // Add favicon placeholder
      // In a real app, we would fetch and add the actual logo here
      
      // Add main React files
      srcFolder.file("index.js", `
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();
      `);
      
      // Add CSS with Tailwind
      srcFolder.file("index.css", `
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
      
      srcFolder.file("reportWebVitals.js", `
const reportWebVitals = (onPerfEntry) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(onPerfEntry);
      getFID(onPerfEntry);
      getFCP(onPerfEntry);
      getLCP(onPerfEntry);
      getTTFB(onPerfEntry);
    });
  }
};

export default reportWebVitals;
      `);
      
      srcFolder.file("App.js", `
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar 
          companyName="${selectedWebsite.company_name}"
          primaryColor="${selectedWebsite.color_scheme || 'blue'}"
        />
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={
              <Home 
                companyName="${selectedWebsite.company_name}"
                primaryColor="${selectedWebsite.color_scheme || 'blue'}"
                secondaryColor="${selectedWebsite.secondary_color_scheme || 'gray'}"
              />
            } />
            <Route path="/about" element={
              <About
                companyName="${selectedWebsite.company_name}"
                primaryColor="${selectedWebsite.color_scheme || 'blue'}"
              />
            } />
            <Route path="/contact" element={
              <Contact
                companyName="${selectedWebsite.company_name}"
                primaryColor="${selectedWebsite.color_scheme || 'blue'}"
                domainName="${selectedWebsite.domain_name || 'example.com'}"
              />
            } />
          </Routes>
        </div>
        <Footer companyName="${selectedWebsite.company_name}" />
      </div>
    </Router>
  );
}

export default App;
      `);
      
      // Add components
      componentsFolder.file("Navbar.js", `
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ companyName, primaryColor = 'blue' }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <span className={\`text-xl font-bold text-\${primaryColor}-600\`}>{companyName}</span>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link to="/" className={\`border-transparent text-gray-500 hover:text-gray-700 hover:border-\${primaryColor}-300 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium\`}>
                Home
              </Link>
              <Link to="/about" className={\`border-transparent text-gray-500 hover:text-gray-700 hover:border-\${primaryColor}-300 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium\`}>
                About
              </Link>
              <Link to="/contact" className={\`border-transparent text-gray-500 hover:text-gray-700 hover:border-\${primaryColor}-300 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium\`}>
                Contact
              </Link>
            </div>
          </div>
          
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <Link to="/contact">
              <button className={\`bg-\${primaryColor}-600 hover:bg-\${primaryColor}-700 text-white px-4 py-2 rounded\`}>
                Get Started
              </button>
            </Link>
          </div>
          
          <div className="flex items-center sm:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              <span className="sr-only">Open main menu</span>
              {!isMenuOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
      
      {isMenuOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <Link to="/" className={\`text-gray-600 hover:bg-\${primaryColor}-50 hover:text-\${primaryColor}-700 block px-3 py-2 rounded-md text-base font-medium\`}>
              Home
            </Link>
            <Link to="/about" className={\`text-gray-600 hover:bg-\${primaryColor}-50 hover:text-\${primaryColor}-700 block px-3 py-2 rounded-md text-base font-medium\`}>
              About
            </Link>
            <Link to="/contact" className={\`text-gray-600 hover:bg-\${primaryColor}-50 hover:text-\${primaryColor}-700 block px-3 py-2 rounded-md text-base font-medium\`}>
              Contact
            </Link>
            <Link to="/contact" className={\`bg-\${primaryColor}-600 text-white block px-3 py-2 rounded-md text-base font-medium mt-4 mx-3\`}>
              Get Started
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
      `);
      
      componentsFolder.file("Footer.js", `
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = ({ companyName }) => {
  const year = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="md:flex md:justify-between">
          <div className="mb-8 md:mb-0">
            <span className="text-xl font-bold">{companyName}</span>
            <p className="mt-2 text-gray-400">© {year} All rights reserved.</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Navigation</h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <Link to="/" className="text-gray-400 hover:text-white">Home</Link>
                </li>
                <li>
                  <Link to="/about" className="text-gray-400 hover:text-white">About Us</Link>
                </li>
                <li>
                  <Link to="/contact" className="text-gray-400 hover:text-white">Contact</Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Legal</h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">Privacy Policy</a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">Terms of Service</a>
                </li>
              </ul>
            </div>
            
            <div className="col-span-2 md:col-span-1">
              <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Connect</h3>
              <div className="mt-4 flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white">
                  <span className="sr-only">Facebook</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <span className="sr-only">Instagram</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
      `);
      
      // Add pages
      pagesFolder.file("Home.js", `
import React from 'react';
import { Link } from 'react-router-dom';

const Home = ({ companyName, primaryColor = 'blue', secondaryColor = 'gray' }) => {
  return (
    <div>
      {/* Hero Section */}
      <section className={\`bg-\${primaryColor}-600 text-white py-20\`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl tracking-tight font-extrabold sm:text-5xl md:text-6xl">
              <span className="block">Welcome to</span>
              <span className="block">{companyName}</span>
            </h1>
            <p className="mt-6 max-w-lg mx-auto text-xl sm:max-w-3xl">
              Your trusted partner for professional website solutions. We build engaging, responsive websites that help your business grow.
            </p>
            <div className="mt-10 flex justify-center">
              <div className="mx-2">
                <Link to="/contact">
                  <button className={\`bg-white text-\${primaryColor}-600 hover:bg-gray-100 px-6 py-3 rounded-md font-medium shadow-md\`}>
                    Contact Us
                  </button>
                </Link>
              </div>
              <div className="mx-2">
                <Link to="/about">
                  <button className={\`bg-transparent border border-white text-white hover:bg-\${primaryColor}-700 px-6 py-3 rounded-md font-medium\`}>
                    Learn More
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold sm:text-4xl">
              Our Services
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
              We provide a wide range of web services tailored to your needs.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className={\`bg-white p-8 rounded-lg shadow-md border-t-4 border-\${primaryColor}-500\`}>
              <div className={\`inline-flex items-center justify-center p-2 bg-\${primaryColor}-100 text-\${primaryColor}-600 rounded-lg\`}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="mt-4 text-xl font-medium">Web Design</h3>
              <p className="mt-2 text-gray-600">
                Custom-designed websites that are visually appealing and user-friendly.
              </p>
            </div>

            <div className={\`bg-white p-8 rounded-lg shadow-md border-t-4 border-\${primaryColor}-500\`}>
              <div className={\`inline-flex items-center justify-center p-2 bg-\${primaryColor}-100 text-\${primaryColor}-600 rounded-lg\`}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <h3 className="mt-4 text-xl font-medium">Web Development</h3>
              <p className="mt-2 text-gray-600">
                Fully functional websites built with the latest technologies and best practices.
              </p>
            </div>

            <div className={\`bg-white p-8 rounded-lg shadow-md border-t-4 border-\${primaryColor}-500\`}>
              <div className={\`inline-flex items-center justify-center p-2 bg-\${primaryColor}-100 text-\${primaryColor}-600 rounded-lg\`}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                </svg>
              </div>
              <h3 className="mt-4 text-xl font-medium">SEO Optimization</h3>
              <p className="mt-2 text-gray-600">
                Improve your website's visibility in search engines and drive more traffic.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className={\`py-16 bg-\${secondaryColor}-50\`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold sm:text-4xl">
              What Our Clients Say
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className={\`bg-\${primaryColor}-100 rounded-full p-2 mr-4\`}>
                  <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium">John Smith</h4>
                  <p className="text-sm text-gray-500">CEO, TechCorp</p>
                </div>
              </div>
              <p className="text-gray-600">
                "${companyName} transformed our online presence. Their team delivered a beautiful, functional website that perfectly represents our brand."
              </p>
              <div className="mt-4 flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className={\`bg-\${primaryColor}-100 rounded-full p-2 mr-4\`}>
                  <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium">Sarah Johnson</h4>
                  <p className="text-sm text-gray-500">Marketing Director, GrowFast</p>
                </div>
              </div>
              <p className="text-gray-600">
                "Working with ${companyName} was a pleasure from start to finish. They understood our needs and delivered beyond our expectations."
              </p>
              <div className="mt-4 flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className={\`bg-\${primaryColor}-100 rounded-full p-2 mr-4\`}>
                  <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium">Michael Brown</h4>
                  <p className="text-sm text-gray-500">Owner, Local Bistro</p>
                </div>
              </div>
              <p className="text-gray-600">
                "Our website traffic increased by 150% after launching our new site designed by ${companyName}. Best investment we've made!"
              </p>
              <div className="mt-4 flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={\`bg-\${primaryColor}-600 rounded-lg shadow-xl overflow-hidden\`}>
            <div className="px-6 py-12 md:p-12 text-center md:text-left">
              <div className="md:flex md:items-center md:justify-between">
                <div>
                  <h2 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
                    Ready to get started?
                  </h2>
                  <p className="mt-3 text-lg text-white opacity-90 max-w-md">
                    Contact us today for a free consultation and quote for your website project.
                  </p>
                </div>
                <div className="mt-8 md:mt-0">
                  <Link to="/contact">
                    <button className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-gray-900 bg-white hover:bg-gray-50">
                      Contact Us
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
      `);
      
      pagesFolder.file("About.js", `
import React from 'react';

const About = ({ companyName, primaryColor = 'blue' }) => {
  return (
    <div>
      {/* Hero Section */}
      <div className={\`bg-\${primaryColor}-600 text-white py-16\`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold">About {companyName}</h1>
            <p className="mt-4 text-xl">Learn more about our company and our mission</p>
          </div>
        </div>
      </div>
      
      {/* About Company Section */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="md:flex md:items-center md:space-x-12">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <div className={\`rounded-lg bg-\${primaryColor}-100 p-4\`}>
                <svg className={\`w-full h-auto text-\${primaryColor}-600\`} width="400" height="300" viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="400" height="300" rx="10" fill="currentColor" fillOpacity="0.2"/>
                  <path d="M200 150C200 172.091 182.091 190 160 190C137.909 190 120 172.091 120 150C120 127.909 137.909 110 160 110C182.091 110 200 127.909 200 150Z" fill="currentColor"/>
                  <path d="M280 150C280 172.091 262.091 190 240 190C217.909 190 200 172.091 200 150C200 127.909 217.909 110 240 110C262.091 110 280 127.909 280 150Z" fill="currentColor" fillOpacity="0.6"/>
                </svg>
              </div>
            </div>
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold mb-4">Our Story</h2>
              <p className="text-gray-600 mb-6">
                {companyName} was founded in 2015 with a simple mission: to help businesses succeed online by creating beautiful, functional websites that drive results. What started as a small freelance operation has grown into a full-service web design and development agency serving clients across multiple industries.
              </p>
              <p className="text-gray-600">
                We believe that great design combined with strategic thinking and technical excellence creates websites that not only look amazing but also achieve real business objectives. Our team of designers, developers, and digital strategists work closely with each client to understand their unique needs and create custom solutions that help them reach their goals.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Values Section */}
      <div className={\`py-16 bg-\${primaryColor}-50\`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Our Core Values</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
              These principles guide everything we do and help us deliver exceptional results for our clients.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className={\`inline-flex items-center justify-center p-3 bg-\${primaryColor}-100 text-\${primaryColor}-600 rounded-full mb-4\`}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Quality</h3>
              <p className="text-gray-600">
                We never compromise on quality. From design to development to ongoing support, we maintain the highest standards in everything we do.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className={\`inline-flex items-center justify-center p-3 bg-\${primaryColor}-100 text-\${primaryColor}-600 rounded-full mb-4\`}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Innovation</h3>
              <p className="text-gray-600">
                We stay at the forefront of web technology and design trends, constantly learning and incorporating new ideas to deliver cutting-edge solutions.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className={\`inline-flex items-center justify-center p-3 bg-\${primaryColor}-100 text-\${primaryColor}-600 rounded-full mb-4\`}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Client Focus</h3>
              <p className="text-gray-600">
                Our clients' success is our success. We listen closely to their needs and work collaboratively to achieve their goals and exceed expectations.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Team Section */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Meet Our Team</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
              Our talented team of professionals is dedicated to delivering exceptional results.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <div className="bg-gray-300 h-48"></div>
              <div className="p-6">
                <h3 className="font-semibold text-lg">Alex Johnson</h3>
                <p className={\`text-\${primaryColor}-600 mb-2\`}>CEO & Founder</p>
                <p className="text-gray-600">
                  With over 15 years of experience in web development and digital marketing, Alex leads our team with vision and expertise.
                </p>
              </div>
            </div>
            
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <div className="bg-gray-300 h-48"></div>
              <div className="p-6">
                <h3 className="font-semibold text-lg">Sophia Martinez</h3>
                <p className={\`text-\${primaryColor}-600 mb-2\`}>Lead Designer</p>
                <p className="text-gray-600">
                  Sophia brings creativity and user-focused design thinking to every project, creating beautiful and functional interfaces.
                </p>
              </div>
            </div>
            
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <div className="bg-gray-300 h-48"></div>
              <div className="p-6">
                <h3 className="font-semibold text-lg">David Kim</h3>
                <p className={\`text-\${primaryColor}-600 mb-2\`}>Senior Developer</p>
                <p className="text-gray-600">
                  David's technical skills and problem-solving abilities ensure our websites are robust, secure, and high-performing.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
      `);
      
      pagesFolder.file("Contact.js", `
import React, { useState } from 'react';

const Contact = ({ companyName, primaryColor = 'blue', domainName }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real application, this would send the form data to a server
    console.log('Form submitted:', formData);
    setSubmitted(true);
    setFormData({
      name: '',
      email: '',
      phone: '',
      message: ''
    });
    
    // Reset the success message after 5 seconds
    setTimeout(() => {
      setSubmitted(false);
    }, 5000);
  };

  return (
    <div>
      {/* Hero Section */}
      <div className={\`bg-\${primaryColor}-600 text-white py-16\`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold">Contact Us</h1>
            <p className="mt-4 text-xl">Get in touch with our team</p>
          </div>
        </div>
      </div>
      
      {/* Contact Form Section */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold mb-6">Get In Touch</h2>
              <p className="text-gray-600 mb-8">
                Have a question or want to discuss your project? Fill out the form and we'll get back to you as soon as possible.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className={\`flex-shrink-0 inline-flex items-center justify-center h-12 w-12 rounded-md bg-\${primaryColor}-100 text-\${primaryColor}-600\`}>
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium">Phone</h3>
                    <p className="mt-1 text-gray-600">+1 (555) 123-4567</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className={\`flex-shrink-0 inline-flex items-center justify-center h-12 w-12 rounded-md bg-\${primaryColor}-100 text-\${primaryColor}-600\`}>
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium">Email</h3>
                    <p className="mt-1 text-gray-600">info@{domainName}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className={\`flex-shrink-0 inline-flex items-center justify-center h-12 w-12 rounded-md bg-\${primaryColor}-100 text-\${primaryColor}-600\`}>
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium">Address</h3>
                    <p className="mt-1 text-gray-600">
                      123 Business Ave, Suite 100<br />
                      Metropolis, NY 10001<br />
                      United States
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mt-12">
                <h3 className="text-lg font-medium mb-4">Connect With Us</h3>
                <div className="flex space-x-4">
                  <a href="#" className={\`text-gray-400 hover:text-\${primaryColor}-500\`}>
                    <span className="sr-only">Facebook</span>
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                      <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                    </svg>
                  </a>
                  <a href="#" className={\`text-gray-400 hover:text-\${primaryColor}-500\`}>
                    <span className="sr-only">Twitter</span>
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                    </svg>
                  </a>
                  <a href="#" className={\`text-gray-400 hover:text-\${primaryColor}-500\`}>
                    <span className="sr-only">LinkedIn</span>
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                      <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
                    </svg>
                  </a>
                  <a href="#" className={\`text-gray-400 hover:text-\${primaryColor}-500\`}>
                    <span className="sr-only">Instagram</span>
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                      <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
            
            <div>
              <div className="bg-white shadow-md rounded-lg p-8">
                <h2 className="text-2xl font-bold mb-6">Send Us a Message</h2>
                
                {submitted ? (
                  <div className={\`bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6\`}>
                    <p>Thank you for your message! We'll get back to you soon.</p>
                  </div>
                ) : null}
                
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        id="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md px-4 py-2 border"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        id="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md px-4 py-2 border"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        id="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md px-4 py-2 border"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                        Your Message
                      </label>
                      <textarea
                        name="message"
                        id="message"
                        required
                        rows={4}
                        value={formData.message}
                        onChange={handleChange}
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md px-4 py-2 border"
                      ></textarea>
                    </div>
                    
                    <div>
                      <button
                        type="submit"
                        className={\`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-\${primaryColor}-600 hover:bg-\${primaryColor}-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-\${primaryColor}-500\`}
                      >
                        Send Message
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Map Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Find Us</h2>
            <p className="mt-4 text-lg text-gray-600">Visit our office</p>
          </div>
          
          <div className="h-96 bg-gray-200 rounded-lg flex items-center justify-center">
            {/* In a real application, this would be an iframe with Google Maps or similar */}
            <p className="text-gray-500">Map placeholder - In a real site, an interactive map would be displayed here</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
      `);

      // Add GitHub workflow file for deployment
      const workflowFolder = zip.folder(".github").folder("workflows");
      
      workflowFolder.file("deploy.yml", `
name: Deploy React Website

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 16
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build website
        run: npm run build
      
      - name: Deploy to GitHub Pages
        uses: JamesIves/github-pages-deploy-action@v4
        with:
          folder: build
          
      - name: Notify deployment success
        if: success()
        run: echo "Website deployed successfully!"
      `);
      
      // Add README file with setup instructions
      zip.file("README.md", `
# ${selectedWebsite.company_name} Website

This is a ready-to-deploy React website for ${selectedWebsite.company_name}.

## Setup Instructions

1. Clone this repository:
   \`\`\`bash
   git clone <your-repository-url>
   cd your-repository
   \`\`\`

2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

3. Run the development server:
   \`\`\`bash
   npm start
   \`\`\`

4. Build for production:
   \`\`\`bash
   npm run build
   \`\`\`

## Deployment

This project includes a GitHub Actions workflow for automatic deployment to GitHub Pages.

To deploy:

1. Create a GitHub repository with the name \`your-username/your-repo\`
2. Push the downloaded code to your repository
3. Go to your repository settings and configure GitHub Pages to deploy from the \`gh-pages\` branch
4. The included GitHub Actions workflow will handle deployment automatically

## Customization

Edit files in the \`src\` directory to customize your website further:

- \`src/App.js\`: Main application component
- \`src/pages/*.js\`: Individual page components
- \`src/components/*.js\`: Reusable components
- \`tailwind.config.js\`: Customize theme colors and more
      `);
      
      const content = await zip.generateAsync({ type: "blob" });
      saveAs(content, `${selectedWebsite.company_name.toLowerCase().replace(/\s+/g, "-")}-project.zip`);
      
      toast({
        title: "Download Complete",
        description: "Complete React project downloaded successfully!"
      });
    } catch (error) {
      console.error("Error downloading project:", error);
      toast({
        title: "Download Failed",
        description: "An error occurred while downloading the project.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-8">
      <div className="space-y-8">
        <div>
          <h3 className="text-lg font-medium mb-4">Select Website to Download</h3>
          
          {websites.length === 0 ? (
            <Alert>
              <AlertTitle>No websites found</AlertTitle>
              <AlertDescription>
                You need to create a website before you can download the code.
              </AlertDescription>
            </Alert>
          ) : (
            <select
              value={selectedWebsiteId || ''}
              onChange={handleSelectWebsite}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            >
              {websites.map(website => (
                <option key={website.id} value={website.id}>
                  {website.company_name} ({website.template_id})
                </option>
              ))}
            </select>
          )}
        </div>
        
        {selectedWebsite && (
          <Tabs defaultValue="react">
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="react">
                <Package className="w-4 h-4 mr-2" />
                React Project
              </TabsTrigger>
              <TabsTrigger value="deploy">
                <GitMerge className="w-4 h-4 mr-2" />
                Deployment
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="react" className="space-y-4">
              <div className="rounded-md bg-gray-50 p-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <Code className="h-5 w-5 text-gray-400" />
                  </div>
                  <div className="ml-3 flex-1">
                    <h3 className="font-medium mb-2">Full React Project</h3>
                    <p className="text-sm text-gray-600">
                      Download a complete ready-to-deploy React project with all components, pages, and configuration files. 
                      The project includes your branding, colors, and GitHub Actions workflow for easy deployment.
                    </p>
                    <Button 
                      className="mt-3"
                      onClick={downloadFullProject}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <span className="mr-2">Generating...</span>
                          <Terminal className="h-4 w-4 animate-spin" />
                        </>
                      ) : (
                        <>
                          <Download className="mr-2 h-4 w-4" />
                          Download React Project
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="rounded-md bg-gray-50 p-4">
                <h3 className="font-medium mb-2">Deployment Instructions</h3>
                <ol className="space-y-2 text-sm text-gray-600 list-decimal pl-5">
                  <li>Download the full React project using the button above</li>
                  <li>Create a GitHub repository for your project</li>
                  <li>Push the downloaded code to your repository</li>
                  <li>Configure GitHub Pages in your repository settings</li>
                  <li>The included GitHub Actions workflow will handle deployment</li>
                </ol>
              </div>
            </TabsContent>
            
            <TabsContent value="deploy" className="space-y-4">
              <div className="rounded-md bg-gray-50 p-4">
                <p className="text-sm text-gray-600">
                  For more advanced deployment options like custom domains, environment variables, and continuous integration, 
                  please configure deployment settings in the Deployment tab of the dashboard.
                </p>
                <Button 
                  className="mt-3"
                  variant="outline"
                  onClick={() => {
                    navigate('/dashboard');
                    sessionStorage.setItem('selectedWebsiteId', selectedWebsiteId);
                  }}
                >
                  <GitMerge className="mr-2 h-4 w-4" />
                  Configure Deployment
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
};

export default CodeDownloader;
