
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, Code, GitMerge, Package, Terminal } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getAllWebsiteConfigs, getTemplateFiles } from "@/utils/websiteService";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

interface CodeDownloaderProps {
  websiteConfig?: {
    id: string;
    template_id: string;
    company_name: string;
    domain_name: string;
    logo?: string;
    color_scheme?: string;
    secondary_color_scheme?: string;
  } | null;
}

const CodeDownloader: React.FC<CodeDownloaderProps> = ({ websiteConfig }) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('full');

  // Function to download a full React project with all necessary files
  const downloadFullProject = async () => {
    if (!websiteConfig) {
      toast({
        title: "Error",
        description: "No website selected",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      // In a real implementation, this would fetch all template files from the backend
      // For now, we'll create a basic structure with essential files
      const zip = new JSZip();
      
      // Add package.json
      zip.file("package.json", JSON.stringify({
        name: websiteConfig.domain_name.replace(/[^a-zA-Z0-9]/g, '-'),
        version: "0.1.0",
        private: true,
        scripts: {
          start: "vite",
          build: "vite build",
          serve: "vite preview",
          deploy: "gh-pages -d dist"
        },
        dependencies: {
          "react": "^18.3.1",
          "react-dom": "^18.3.1",
          "react-router-dom": "^6.26.2",
          "tailwindcss": "^3.3.0",
          "vite": "^4.5.0"
        },
        devDependencies: {
          "@types/react": "^18.2.0",
          "@types/react-dom": "^18.2.0",
          "gh-pages": "^6.0.0",
          "typescript": "^5.2.0"
        }
      }, null, 2));
      
      // Add vite.config.js
      zip.file("vite.config.js", `
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  base: './',
});
      `);
      
      // Add tailwind.config.js
      zip.file("tailwind.config.js", `
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "${websiteConfig.color_scheme || 'blue'}",
        secondary: "${websiteConfig.secondary_color_scheme || 'gray'}"
      },
    },
  },
  plugins: [],
};
      `);

      // Create src directory and add files
      const srcDir = zip.folder("src");
      
      // Add main.tsx
      srcDir.file("main.tsx", `
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
      `);
      
      // Add App.tsx
      srcDir.file("App.tsx", `
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import './App.css';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </Router>
  );
};

export default App;
      `);
      
      // Add index.css
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

      // Add App.css
      srcDir.file("App.css", `
.App {
  text-align: center;
}

.App-header {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: calc(10px + 2vmin);
}
      `);
      
      // Create components directory
      const componentsDir = srcDir.folder("components");
      
      // Add Navbar.tsx
      componentsDir.file("Navbar.tsx", `
import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-${websiteConfig.color_scheme || 'blue'}-600">${websiteConfig.company_name}</span>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link to="/" className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                Home
              </Link>
              <Link to="/about" className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                About
              </Link>
              <Link to="/contact" className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                Contact
              </Link>
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <button className="bg-${websiteConfig.color_scheme || 'blue'}-600 hover:bg-${websiteConfig.color_scheme || 'blue'}-700 text-white px-4 py-2 rounded">
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

      // Add Footer.tsx
      componentsDir.file("Footer.tsx", `
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="md:flex md:justify-between">
          <div className="mb-8 md:mb-0">
            <span className="text-xl font-bold">${websiteConfig.company_name}</span>
            <p className="mt-2 text-gray-400">© {new Date().getFullYear()} All rights reserved.</p>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider">Navigate</h3>
              <div className="mt-4 space-y-4">
                <a href="/" className="text-gray-400 hover:text-white block">Home</a>
                <a href="/about" className="text-gray-400 hover:text-white block">About</a>
                <a href="/contact" className="text-gray-400 hover:text-white block">Contact</a>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider">Contact</h3>
              <div className="mt-4 space-y-4">
                <p className="text-gray-400">contact@${websiteConfig.domain_name}</p>
                <p className="text-gray-400">123-456-7890</p>
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
      
      // Create pages directory
      const pagesDir = srcDir.folder("pages");
      
      // Add Home.tsx
      pagesDir.file("Home.tsx", `
import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <section className="bg-${websiteConfig.color_scheme || 'blue'}-600 text-white py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl font-extrabold sm:text-5xl">
                Welcome to ${websiteConfig.company_name}
              </h1>
              <p className="mt-4 text-xl mx-auto max-w-2xl">
                Your partner in success. We help businesses grow and thrive in today's competitive market.
              </p>
              <div className="mt-8 flex justify-center">
                <button className="bg-white text-${websiteConfig.color_scheme || 'blue'}-600 px-6 py-3 rounded-md font-medium text-lg">
                  Get Started
                </button>
                <button className="ml-4 bg-transparent border border-white text-white px-6 py-3 rounded-md font-medium text-lg">
                  Learn More
                </button>
              </div>
            </div>
          </div>
        </section>
        
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900">Our Services</h2>
              <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
                We offer a wide range of services to meet your business needs.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-8 shadow-md rounded-lg">
                <h3 className="text-xl font-bold text-${websiteConfig.color_scheme || 'blue'}-600 mb-4">Service 1</h3>
                <p className="text-gray-600">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nunc sit amet ultricies lacinia.</p>
              </div>
              <div className="bg-white p-8 shadow-md rounded-lg">
                <h3 className="text-xl font-bold text-${websiteConfig.color_scheme || 'blue'}-600 mb-4">Service 2</h3>
                <p className="text-gray-600">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nunc sit amet ultricies lacinia.</p>
              </div>
              <div className="bg-white p-8 shadow-md rounded-lg">
                <h3 className="text-xl font-bold text-${websiteConfig.color_scheme || 'blue'}-600 mb-4">Service 3</h3>
                <p className="text-gray-600">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nunc sit amet ultricies lacinia.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Home;
      `);

      // Add About.tsx
      pagesDir.file("About.tsx", `
import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <div className="bg-${websiteConfig.color_scheme || 'blue'}-600 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold text-white">About Us</h1>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="prose prose-lg mx-auto">
            <h2>Our Story</h2>
            <p>
              ${websiteConfig.company_name} was founded with a mission to help businesses succeed in an increasingly digital world.
              We believe in innovation, quality, and exceptional customer service.
            </p>
            
            <h2>Our Team</h2>
            <p>
              Our team consists of experienced professionals who are passionate about what they do.
              We combine technical expertise with creative thinking to deliver outstanding results.
            </p>
            
            <h2>Our Values</h2>
            <ul>
              <li>Customer Focus: We put our customers first in everything we do.</li>
              <li>Innovation: We embrace new technologies and approaches.</li>
              <li>Quality: We maintain high standards in all our work.</li>
              <li>Integrity: We operate with honesty and transparency.</li>
            </ul>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default About;
      `);

      // Add Contact.tsx
      pagesDir.file("Contact.tsx", `
import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Contact = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Form submission logic would go here
    alert('Message sent! (This is a demo)');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <div className="bg-${websiteConfig.color_scheme || 'blue'}-600 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold text-white">Contact Us</h1>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-bold mb-4">Get in Touch</h2>
              <p className="mb-4">We'd love to hear from you. Please fill out the form below and we'll get back to you as soon as possible.</p>
              
              <div className="mt-8">
                <h3 className="text-xl font-semibold mb-2">Contact Information</h3>
                <p className="mb-2">Email: contact@${websiteConfig.domain_name}</p>
                <p className="mb-2">Phone: 123-456-7890</p>
                <p className="mb-2">Address: 123 Main St, Anytown, USA</p>
              </div>
            </div>
            
            <div>
              <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                    Name
                  </label>
                  <input 
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                    id="name" 
                    type="text" 
                    placeholder="Your Name"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                    Email
                  </label>
                  <input 
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                    id="email" 
                    type="email" 
                    placeholder="your.email@example.com"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="message">
                    Message
                  </label>
                  <textarea 
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                    id="message" 
                    placeholder="Your Message"
                    rows="5"
                  ></textarea>
                </div>
                <div className="flex items-center justify-between">
                  <button 
                    className="bg-${websiteConfig.color_scheme || 'blue'}-600 hover:bg-${websiteConfig.color_scheme || 'blue'}-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" 
                    type="submit"
                  >
                    Send Message
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
      `);
      
      // Add public directory with index.html
      const publicDir = zip.folder("public");
      publicDir.file("index.html", `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${websiteConfig.company_name}</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
      `);
      
      // Add .github/workflows directory with deploy.yml
      const githubDir = zip.folder(".github");
      const workflowsDir = githubDir.folder("workflows");
      workflowsDir.file("deploy.yml", `
name: Deploy Website

on:
  push:
    branches: [main]

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
          folder: dist
      `);

      // Generate and download the zip file
      const content = await zip.generateAsync({ type: "blob" });
      
      // Use FileSaver.js to save the zip
      saveAs(content, `${websiteConfig.company_name.toLowerCase().replace(/\s+/g, '-')}-project.zip`);

      toast({
        title: "Download Complete",
        description: "Project files downloaded successfully. Ready for deployment!"
      });
    } catch (error) {
      console.error("Error downloading code:", error);
      toast({
        title: "Download Failed",
        description: "Could not generate project files",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Function to download only component files
  const downloadComponentsOnly = async () => {
    if (!websiteConfig) {
      toast({
        title: "Error",
        description: "No website selected",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      // Create a zip for component files only
      const zip = new JSZip();
      
      // Create components directory
      zip.file("Navbar.tsx", `
import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-${websiteConfig.color_scheme || 'blue'}-600">${websiteConfig.company_name}</span>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link to="/" className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                Home
              </Link>
              <Link to="/about" className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                About
              </Link>
              <Link to="/contact" className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
      `);

      zip.file("Footer.tsx", `
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="md:flex md:justify-between">
          <div className="mb-8 md:mb-0">
            <span className="text-xl font-bold">${websiteConfig.company_name}</span>
            <p className="mt-2 text-gray-400">© {new Date().getFullYear()} All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
      `);
      
      zip.file("HomePage.tsx", `
import React from 'react';

const HomePage = () => {
  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
            Welcome to ${websiteConfig.company_name}
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg">
            We deliver exceptional solutions for your business needs.
          </p>
          <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center">
            <div className="rounded-md shadow">
              <a href="#" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-${websiteConfig.color_scheme || 'blue'}-600 hover:bg-${websiteConfig.color_scheme || 'blue'}-700">
                Get started
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
      
      // Generate and download the zip file
      const content = await zip.generateAsync({ type: "blob" });
      
      // Use FileSaver.js to save the zip
      saveAs(content, `${websiteConfig.company_name.toLowerCase().replace(/\s+/g, '-')}-components.zip`);

      toast({
        title: "Download Complete",
        description: "Component files downloaded successfully."
      });
    } catch (error) {
      console.error("Error downloading components:", error);
      toast({
        title: "Download Failed",
        description: "Could not generate component files",
        variant: "destructive" 
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!websiteConfig) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle className="text-xl font-bold">Download Code</CardTitle>
            <CardDescription>Download your website code</CardDescription>
          </div>
          <Code className="h-5 w-5 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertTitle>No Website Selected</AlertTitle>
            <AlertDescription>
              Please select a website from your saved websites above to download its code.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-xl font-bold">Download Code</CardTitle>
          <CardDescription>Download your website code for {websiteConfig.company_name}</CardDescription>
        </div>
        <Code className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <Alert className="mb-4">
          <AlertDescription>
            You can download a complete React project ready for GitHub deployment, or just the component files.
          </AlertDescription>
        </Alert>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="full">Full Project</TabsTrigger>
            <TabsTrigger value="components">Components Only</TabsTrigger>
          </TabsList>
          <TabsContent value="full" className="pt-4">
            <div className="space-y-2">
              <div className="flex items-start space-x-4">
                <Package className="h-8 w-8 text-gray-400" />
                <div>
                  <h3 className="font-medium">Complete React Project</h3>
                  <p className="text-sm text-gray-500">
                    Download a complete React project with routing, TailwindCSS, and deployment config.
                  </p>
                  <ul className="mt-2 text-xs text-gray-500 list-disc pl-4 space-y-1">
                    <li>Includes package.json with all dependencies</li>
                    <li>Vite build configuration</li>
                    <li>GitHub Actions workflow for deployment</li>
                    <li>Ready to push to GitHub</li>
                  </ul>
                </div>
              </div>
              <Button 
                className="w-full mt-3"
                onClick={downloadFullProject}
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <Download className="mr-2 h-4 w-4" />
                    Download Complete Project
                  </span>
                )}
              </Button>
            </div>
          </TabsContent>
          <TabsContent value="components" className="pt-4">
            <div className="space-y-2">
              <div className="flex items-start space-x-4">
                <GitMerge className="h-8 w-8 text-gray-400" />
                <div>
                  <h3 className="font-medium">React Components Only</h3>
                  <p className="text-sm text-gray-500">
                    Download just the React component files for your website.
                  </p>
                  <ul className="mt-2 text-xs text-gray-500 list-disc pl-4 space-y-1">
                    <li>Core components with your branding</li>
                    <li>No configuration files or build setup</li>
                    <li>Great for integrating into existing projects</li>
                  </ul>
                </div>
              </div>
              <Button 
                className="w-full mt-3"
                variant="outline"
                onClick={downloadComponentsOnly}
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <Download className="mr-2 h-4 w-4" />
                    Download Components
                  </span>
                )}
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-6 pt-4 border-t border-gray-200">
          <h3 className="font-medium mb-2">Deployment Instructions</h3>
          <ol className="space-y-2 text-sm text-gray-600 list-decimal pl-5">
            <li>Download the full React project using the button above</li>
            <li>Create a GitHub repository with the name <code className="bg-muted px-1 rounded text-xs">{repository || 'your-username/your-repo'}</code></li>
            <li>Push the downloaded code to your repository</li>
            <li>Configure GitHub Pages in your repository settings</li>
            <li>The included GitHub Actions workflow will handle deployment</li>
          </ol>
          <div className="mt-3">
            <Button
              variant="secondary"
              size="sm"
              className="text-xs"
              onClick={() => {
                window.open('https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site', '_blank');
              }}
            >
              <Terminal className="mr-1 h-3 w-3" />
              GitHub Pages Setup Guide
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CodeDownloader;
