
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
                Modern web applications built with the latest technologies and best practices.
              </p>
            </div>

            <div className={\`bg-white p-8 rounded-lg shadow-md border-t-4 border-\${primaryColor}-500\`}>
              <div className={\`inline-flex items-center justify-center p-2 bg-\${primaryColor}-100 text-\${primaryColor}-600 rounded-lg\`}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h3 className="mt-4 text-xl font-medium">SEO Optimization</h3>
              <p className="mt-2 text-gray-600">
                Improve your visibility online and attract more customers to your website.
              </p>
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
      <div className={\`bg-\${primaryColor}-600 py-16 text-white\`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-extrabold text-center">About {companyName}</h1>
          <p className="mt-4 max-w-3xl mx-auto text-center text-xl">
            We're passionate about creating digital experiences that make a difference.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-2xl font-bold mb-6">Our Story</h2>
            <p className="mb-4 text-gray-600">
              {companyName} was founded in 2020 with a single mission: to build websites that make our clients successful.
              We believe in creating digital solutions that are both beautiful and functional.
            </p>
            <p className="mb-4 text-gray-600">
              Our team brings together decades of experience in design, development, and digital marketing.
              We work closely with our clients to understand their unique needs and craft solutions that exceed expectations.
            </p>
            <p className="text-gray-600">
              Whether you're a small business looking to establish your online presence or a large enterprise seeking
              to revamp your digital strategy, we're here to help you succeed.
            </p>
          </div>
          <div className="bg-gray-200 h-80 rounded-lg flex items-center justify-center">
            <span className="text-gray-500 text-lg">Company Image</span>
          </div>
        </div>

        <div className="mt-20">
          <h2 className="text-2xl font-bold mb-6 text-center">Our Values</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-10">
            <div className={\`p-6 bg-white rounded-lg shadow-md border-t-4 border-\${primaryColor}-500\`}>
              <h3 className="text-xl font-medium mb-3">Quality</h3>
              <p className="text-gray-600">We never compromise on quality. Our websites are built to the highest standards.</p>
            </div>
            
            <div className={\`p-6 bg-white rounded-lg shadow-md border-t-4 border-\${primaryColor}-500\`}>
              <h3 className="text-xl font-medium mb-3">Innovation</h3>
              <p className="text-gray-600">We stay at the forefront of technology to bring you cutting-edge solutions.</p>
            </div>
            
            <div className={\`p-6 bg-white rounded-lg shadow-md border-t-4 border-\${primaryColor}-500\`}>
              <h3 className="text-xl font-medium mb-3">Reliability</h3>
              <p className="text-gray-600">You can count on us to deliver on time and on budget, every time.</p>
            </div>
            
            <div className={\`p-6 bg-white rounded-lg shadow-md border-t-4 border-\${primaryColor}-500\`}>
              <h3 className="text-xl font-medium mb-3">Customer Focus</h3>
              <p className="text-gray-600">Your satisfaction is our top priority. We're not happy until you're thrilled.</p>
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

const Contact = ({ companyName, primaryColor = 'blue', domainName = 'example.com' }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  
  const [formStatus, setFormStatus] = useState({
    submitted: false,
    error: false
  });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, you'd send this data to an API
    console.log('Form submitted:', formData);
    
    // Simulate submission success
    setFormStatus({
      submitted: true,
      error: false
    });
    
    // Reset form
    setFormData({
      name: '',
      email: '',
      message: ''
    });
  };
  
  return (
    <div>
      <div className={\`bg-\${primaryColor}-600 py-16 text-white\`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-extrabold text-center">Contact Us</h1>
          <p className="mt-4 max-w-3xl mx-auto text-center text-xl">
            We'd love to hear from you. Drop us a line and we'll get back to you as soon as possible.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl font-bold mb-6">Get In Touch</h2>
            
            {formStatus.submitted && (
              <div className={\`mb-6 p-4 bg-\${primaryColor}-100 text-\${primaryColor}-700 rounded-lg\`}>
                Thank you for your message! We'll be in touch soon.
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="name" className="block text-gray-700 font-medium mb-2">Your Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="email" className="block text-gray-700 font-medium mb-2">Your Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="message" className="block text-gray-700 font-medium mb-2">Your Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                ></textarea>
              </div>
              
              <button
                type="submit"
                className={\`bg-\${primaryColor}-600 text-white px-6 py-3 rounded-lg hover:bg-\${primaryColor}-700 transition-colors\`}
              >
                Send Message
              </button>
            </form>
          </div>
          
          <div>
            <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="mb-6">
                <h3 className="font-medium text-lg mb-2">Address</h3>
                <p className="text-gray-600">
                  123 Main Street<br />
                  Suite 101<br />
                  San Francisco, CA 94105
                </p>
              </div>
              
              <div className="mb-6">
                <h3 className="font-medium text-lg mb-2">Email</h3>
                <p className="text-gray-600">
                  <a href={\`mailto:contact@\${domainName}\`} className={\`text-\${primaryColor}-600 hover:underline\`}>
                    contact@{domainName}
                  </a>
                </p>
              </div>
              
              <div>
                <h3 className="font-medium text-lg mb-2">Phone</h3>
                <p className="text-gray-600">
                  <a href="tel:+15551234567" className={\`text-\${primaryColor}-600 hover:underline\`}>
                    (555) 123-4567
                  </a>
                </p>
              </div>
            </div>
            
            <div className="mt-8 bg-gray-200 h-64 rounded-lg flex items-center justify-center">
              <span className="text-gray-500 text-lg">Map placeholder</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
      `);
      
      // Generate a complete package
      const content = await zip.generateAsync({type:"blob"});
      saveAs(content, `${selectedWebsite.company_name.toLowerCase().replace(/\\s+/g, '-')}-website.zip`);
      
      toast({
        title: "Download Complete",
        description: "Your website code has been downloaded successfully",
      });
    } catch (error) {
      console.error('Error downloading code:', error);
      toast({
        title: "Download Error",
        description: "Failed to generate downloadable code package",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="p-6 bg-white rounded-md shadow">
      <h2 className="text-xl font-semibold mb-4">Website Code</h2>
      
      <p className="mb-4 text-gray-600">
        Download your complete website code package with all necessary files and configurations.
      </p>
      
      {websites.length > 0 ? (
        <>
          <div className="mb-4">
            <Label htmlFor="website-select">Select Website</Label>
            <select 
              id="website-select"
              value={selectedWebsiteId || ""}
              onChange={handleSelectWebsite}
              className="w-full border border-gray-300 rounded p-2 mt-1"
            >
              {websites.map(website => (
                <option key={website.id} value={website.id}>
                  {website.company_name} - {website.domain_name || 'No domain'}
                </option>
              ))}
            </select>
          </div>
          
          <Tabs defaultValue="react">
            <TabsList className="mb-4">
              <TabsTrigger value="react" className="flex items-center gap-1">
                <Code size={16} /> React
              </TabsTrigger>
              <TabsTrigger value="workflow" className="flex items-center gap-1">
                <GitMerge size={16} /> GitHub Actions
              </TabsTrigger>
              <TabsTrigger value="packages" className="flex items-center gap-1">
                <Package size={16} /> Dependencies
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="react">
              <Alert className="mb-4">
                <AlertTitle>React Website</AlertTitle>
                <AlertDescription>
                  Download a complete React website with routing and your branding applied.
                </AlertDescription>
              </Alert>
              
              {selectedWebsite ? (
                <div className="flex flex-col gap-2">
                  <p className="text-sm text-gray-500 mb-2">
                    <span className="font-semibold">Company:</span> {selectedWebsite.company_name}
                  </p>
                  {selectedWebsite.color_scheme && (
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <span className="font-semibold">Primary Color:</span>
                      <div 
                        className="w-4 h-4 rounded-full" 
                        style={{backgroundColor: `var(--${selectedWebsite.color_scheme}-500, #3b82f6)`}}
                      ></div>
                      {selectedWebsite.color_scheme}
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-sm text-gray-500">Select a website to see details</p>
              )}
              
              <Button
                onClick={downloadFullProject}
                disabled={!selectedWebsite || isLoading}
                className="mt-4 flex items-center gap-2"
              >
                <Download size={16} />
                {isLoading ? 'Preparing...' : 'Download Full Project'}
              </Button>
            </TabsContent>
            
            <TabsContent value="workflow">
              <Alert className="mb-4">
                <AlertTitle>GitHub Actions Workflow</AlertTitle>
                <AlertDescription>
                  Includes a GitHub Actions workflow for automatic deployment to GitHub Pages.
                </AlertDescription>
              </Alert>
              
              <div className="bg-gray-100 p-4 rounded text-sm font-mono mb-4">
                <pre className="whitespace-pre-wrap">
                  {`name: Deploy React Website

on:
  push:
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
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build website
        run: npm run build
      
      - name: Deploy to GitHub Pages
        uses: JamesIves/github-pages-deploy-action@v4
        with:
          folder: build`}
                </pre>
              </div>
              
              <p className="text-sm text-gray-600">
                This workflow automatically builds and deploys your React site to GitHub Pages
                whenever you push to the main branch.
              </p>
            </TabsContent>
            
            <TabsContent value="packages">
              <Alert className="mb-4">
                <AlertTitle>Package Dependencies</AlertTitle>
                <AlertDescription>
                  The downloaded project includes these key dependencies.
                </AlertDescription>
              </Alert>
              
              <div className="space-y-2">
                <div className="flex justify-between p-2 rounded bg-gray-50">
                  <span>react</span>
                  <span className="text-gray-500">^18.2.0</span>
                </div>
                <div className="flex justify-between p-2 rounded bg-gray-50">
                  <span>react-dom</span>
                  <span className="text-gray-500">^18.2.0</span>
                </div>
                <div className="flex justify-between p-2 rounded bg-gray-50">
                  <span>react-router-dom</span>
                  <span className="text-gray-500">^6.8.1</span>
                </div>
                <div className="flex justify-between p-2 rounded bg-gray-50">
                  <span>tailwindcss</span>
                  <span className="text-gray-500">^3.2.7</span>
                </div>
                <div className="flex justify-between p-2 rounded bg-gray-50">
                  <span>gh-pages</span>
                  <span className="text-gray-500">^5.0.0</span>
                </div>
              </div>
              
              <p className="mt-4 text-sm text-gray-600">
                Installation is handled by running <code className="bg-gray-100 px-1 py-0.5 rounded">npm install</code> after downloading.
              </p>
              
              <div className="mt-4 p-3 border border-yellow-200 bg-yellow-50 rounded">
                <p className="text-sm flex items-start gap-2">
                  <Terminal size={16} className="mt-0.5" />
                  <span>
                    Run <code className="bg-gray-100 px-1 py-0.5 rounded">npm run deploy</code> to publish your site to GitHub Pages.
                  </span>
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">No websites found. Create a website first.</p>
          <Button onClick={() => window.location.href = '/templates'}>
            Create Website
          </Button>
        </div>
      )}
    </div>
  );
};

export default CodeDownloader;
