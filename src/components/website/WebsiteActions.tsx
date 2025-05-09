
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Eye, Download, MoreHorizontal, Trash, Edit, ExternalLink } from "lucide-react";
import { deleteWebsiteConfig } from "@/utils/websiteService";
import { useToast } from "@/hooks/use-toast";
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { useTemplateTheme } from '@/context/TemplateThemeContext';

interface WebsiteActionsProps {
  website: any;
  onDeleted: () => void;
}

const WebsiteActions: React.FC<WebsiteActionsProps> = ({ website, onDeleted }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { setTemplateColor, setSecondaryColor } = useTemplateTheme();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleViewWebsite = () => {
    if (website.template_id) {
      // Save the colors in session storage before navigating
      try {
        const sessionData = {
          companyName: website.company_name,
          domainName: website.domain_name,
          logo: website.logo,
          colorScheme: website.color_scheme,
          secondaryColorScheme: website.secondary_color_scheme,
          template: website.template_id
        };
        
        sessionStorage.setItem('companyData', JSON.stringify(sessionData));
        
        // Set the colors in the theme context
        if (website.color_scheme) setTemplateColor(website.color_scheme);
        if (website.secondary_color_scheme) setSecondaryColor(website.secondary_color_scheme);
        
      } catch (error) {
        console.error('Error saving to session storage:', error);
      }
      
      // Navigate to the template
      navigate(`/${website.template_id}`, { 
        state: {
          companyName: website.company_name,
          domainName: website.domain_name,
          logo: website.logo,
          colorScheme: website.color_scheme,
          secondaryColorScheme: website.secondary_color_scheme
        }
      });
    }
  };

  const handleEditWebsite = () => {
    if (website.template_id) {
      // Save to session storage before navigating
      try {
        const sessionData = {
          companyName: website.company_name,
          domainName: website.domain_name,
          logo: website.logo,
          colorScheme: website.color_scheme,
          secondaryColorScheme: website.secondary_color_scheme,
          template: website.template_id
        };
        
        sessionStorage.setItem('companyData', JSON.stringify(sessionData));
      } catch (error) {
        console.error('Error saving to session storage:', error);
      }
      
      navigate(`/editor/${website.template_id}`);
    }
  };
  
  const handleDelete = async () => {
    try {
      await deleteWebsiteConfig(website.id);
      setIsDeleteDialogOpen(false);
      
      toast({
        title: "Website Deleted",
        description: `${website.company_name} has been deleted.`,
      });
      
      // Refresh the list
      onDeleted();
    } catch (error) {
      console.error('Error deleting website:', error);
      toast({
        title: "Failed to delete website",
        description: "An error occurred while deleting the website.",
        variant: "destructive",
      });
    }
  };

  const downloadWebsiteCode = async () => {
    setIsLoading(true);
    try {
      // Create a zip file with React components for the website
      const zip = new JSZip();
      
      // Add a main component file for the website
      zip.file(`${website.company_name.replace(/\s+/g, '')}Website.jsx`, `
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';

const ${website.company_name.replace(/\s+/g, '')}Website = () => {
  // Apply the theme colors from the website configuration
  const primaryColor = "${website.color_scheme || 'blue'}";
  const secondaryColor = "${website.secondary_color_scheme || 'gray'}";

  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar companyName="${website.company_name}" primaryColor={primaryColor} />
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<Home 
              companyName="${website.company_name}" 
              primaryColor={primaryColor} 
              secondaryColor={secondaryColor} 
            />} />
            <Route path="/about" element={<About 
              companyName="${website.company_name}" 
              primaryColor={primaryColor} 
            />} />
            <Route path="/contact" element={<Contact 
              companyName="${website.company_name}" 
              primaryColor={primaryColor} 
              domainName="${website.domain_name}" 
            />} />
          </Routes>
        </div>
        <Footer companyName="${website.company_name}" />
      </div>
    </Router>
  );
};

export default ${website.company_name.replace(/\s+/g, '')}Website;
      `);

      // Create components folder
      const componentsDir = zip.folder("components");
      
      // Add Navbar component
      componentsDir.file("Navbar.jsx", `
import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ companyName, primaryColor = 'blue' }) => {
  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <span className={\`text-xl font-bold text-\${primaryColor}-600\`}>{companyName}</span>
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
            <button className={\`bg-\${primaryColor}-600 hover:bg-\${primaryColor}-700 text-white px-4 py-2 rounded\`}>
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
      componentsDir.file("Footer.jsx", `
import React from 'react';

const Footer = ({ companyName }) => {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="md:flex md:justify-between">
          <div className="mb-8 md:mb-0">
            <span className="text-xl font-bold">{companyName}</span>
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
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
      `);
      
      // Create pages folder
      const pagesDir = zip.folder("pages");
      
      // Add Home page
      pagesDir.file("Home.jsx", `
import React from 'react';

const Home = ({ companyName, primaryColor = 'blue', secondaryColor = 'gray' }) => {
  return (
    <div>
      {/* Hero Section */}
      <section className={\`bg-\${primaryColor}-600 text-white py-24\`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold sm:text-5xl">
              Welcome to {companyName}
            </h1>
            <p className="mt-4 text-xl mx-auto max-w-2xl">
              Your partner in success. We help businesses grow and thrive in today's competitive market.
            </p>
            <div className="mt-8 flex justify-center">
              <button className={\`bg-white text-\${primaryColor}-600 px-6 py-3 rounded-md font-medium text-lg\`}>
                Get Started
              </button>
              <button className="ml-4 bg-transparent border border-white text-white px-6 py-3 rounded-md font-medium text-lg">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Our Features</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              We provide everything you need to grow your business.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 shadow-md rounded-lg">
              <h3 className={\`text-xl font-bold text-\${primaryColor}-600 mb-4\`}>Feature 1</h3>
              <p className="text-gray-600">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nunc sit amet ultricies lacinia.</p>
            </div>
            <div className="bg-white p-8 shadow-md rounded-lg">
              <h3 className={\`text-xl font-bold text-\${primaryColor}-600 mb-4\`}>Feature 2</h3>
              <p className="text-gray-600">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nunc sit amet ultricies lacinia.</p>
            </div>
            <div className="bg-white p-8 shadow-md rounded-lg">
              <h3 className={\`text-xl font-bold text-\${primaryColor}-600 mb-4\`}>Feature 3</h3>
              <p className="text-gray-600">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nunc sit amet ultricies lacinia.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className={\`bg-\${secondaryColor}-100 py-16\`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">Ready to get started?</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Join thousands of satisfied customers who are already using our services.
            </p>
            <div className="mt-8">
              <button className={\`bg-\${primaryColor}-600 text-white px-6 py-3 rounded-md font-medium text-lg hover:bg-\${primaryColor}-700\`}>
                Contact Us Today
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
      `);
      
      // Add About page
      pagesDir.file("About.jsx", `
import React from 'react';

const About = ({ companyName, primaryColor = 'blue' }) => {
  return (
    <div>
      {/* Hero Section */}
      <div className={\`bg-\${primaryColor}-600 py-16\`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-white">About Us</h1>
        </div>
      </div>
      
      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="prose prose-lg mx-auto">
          <h2>Our Story</h2>
          <p>
            {companyName} was founded with a mission to help businesses succeed in an increasingly digital world.
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
    </div>
  );
};

export default About;
      `);
      
      // Add Contact page
      pagesDir.file("Contact.jsx", `
import React from 'react';

const Contact = ({ companyName, primaryColor = 'blue', domainName }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Form submission logic would go here
    alert('Message sent! (This is a demo)');
  };

  return (
    <div>
      {/* Hero Section */}
      <div className={\`bg-\${primaryColor}-600 py-16\`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-white">Contact Us</h1>
        </div>
      </div>
      
      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-bold mb-4">Get in Touch</h2>
            <p className="mb-4">We'd love to hear from you. Please fill out the form below and we'll get back to you as soon as possible.</p>
            
            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-2">Contact Information</h3>
              <p className="mb-2">Email: contact@{domainName}</p>
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
                  className={\`bg-\${primaryColor}-600 hover:bg-\${primaryColor}-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline\`} 
                  type="submit"
                >
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
      `);

      // Create a README file with instructions
      zip.file("README.md", `
# ${website.company_name} Website

This repository contains the React components for the ${website.company_name} website.

## Setup

1. Create a new React project:
\`\`\`bash
npx create-react-app ${website.company_name.toLowerCase().replace(/\s+/g, '-')}
cd ${website.company_name.toLowerCase().replace(/\s+/g, '-')}
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install react-router-dom
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
\`\`\`

3. Add the files from this package to your project.

4. Configure Tailwind CSS to include your color scheme:
\`\`\`javascript
// tailwind.config.js
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "${website.color_scheme || 'blue'}",
        secondary: "${website.secondary_color_scheme || 'gray'}"
      },
    },
  },
  plugins: [],
};
\`\`\`

5. Update your App.js to use the main component.

## Deployment

You can deploy this website using GitHub Pages:

1. Install GitHub Pages package:
\`\`\`bash
npm install --save-dev gh-pages
\`\`\`

2. Add these scripts to your package.json:
\`\`\`json
"scripts": {
  "predeploy": "npm run build",
  "deploy": "gh-pages -d build"
}
\`\`\`

3. Deploy the website:
\`\`\`bash
npm run deploy
\`\`\`
      `);
      
      // Generate and download the zip file
      const content = await zip.generateAsync({ type: "blob" });
      
      // Use FileSaver.js to save the zip
      saveAs(content, `${website.company_name.toLowerCase().replace(/\s+/g, '-')}-code.zip`);

      toast({
        title: "Download Complete",
        description: "Website code downloaded successfully!"
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
  
  const openDeployPage = () => {
    // Store the website in session storage for the dashboard
    sessionStorage.setItem('selectedWebsiteId', website.id);
    // Navigate to the deployment page
    navigate('/dashboard');
  };
  
  const handleViewWebsite = () => {
    if (website.template_id) {
      // Save the colors in session storage before navigating
      try {
        const sessionData = {
          companyName: website.company_name,
          domainName: website.domain_name,
          logo: website.logo,
          colorScheme: website.color_scheme,
          secondaryColorScheme: website.secondary_color_scheme,
          template: website.template_id
        };
        
        sessionStorage.setItem('companyData', JSON.stringify(sessionData));
        
        // Set the colors in the theme context
        if (website.color_scheme) setTemplateColor(website.color_scheme);
        if (website.secondary_color_scheme) setSecondaryColor(website.secondary_color_scheme);
        
      } catch (error) {
        console.error('Error saving to session storage:', error);
      }
      
      // Navigate to the template
      navigate(`/${website.template_id}`, { 
        state: {
          companyName: website.company_name,
          domainName: website.domain_name,
          logo: website.logo,
          colorScheme: website.color_scheme,
          secondaryColorScheme: website.secondary_color_scheme
        }
      });
    }
  };

  const handleEditWebsite = () => {
    if (website.template_id) {
      // Save to session storage before navigating
      try {
        const sessionData = {
          companyName: website.company_name,
          domainName: website.domain_name,
          logo: website.logo,
          colorScheme: website.color_scheme,
          secondaryColorScheme: website.secondary_color_scheme,
          template: website.template_id
        };
        
        sessionStorage.setItem('companyData', JSON.stringify(sessionData));
      } catch (error) {
        console.error('Error saving to session storage:', error);
      }
      
      navigate(`/editor/${website.template_id}`);
    }
  };
  
  const handleDelete = async () => {
    try {
      await deleteWebsiteConfig(website.id);
      setIsDeleteDialogOpen(false);
      
      toast({
        title: "Website Deleted",
        description: `${website.company_name} has been deleted.`,
      });
      
      // Refresh the list
      onDeleted();
    } catch (error) {
      console.error('Error deleting website:', error);
      toast({
        title: "Failed to delete website",
        description: "An error occurred while deleting the website.",
        variant: "destructive",
      });
    }
  };
  
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleViewWebsite}>
            <Eye className="mr-2 h-4 w-4" />
            <span>View</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleEditWebsite}>
            <Edit className="mr-2 h-4 w-4" />
            <span>Edit</span>
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={downloadWebsiteCode}
            disabled={isLoading}
          >
            <Download className="mr-2 h-4 w-4" />
            <span>Download Code</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={openDeployPage}>
            <ExternalLink className="mr-2 h-4 w-4" />
            <span>Deploy Website</span>
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => setIsDeleteDialogOpen(true)}
            className="text-red-600 hover:text-red-700"
          >
            <Trash className="mr-2 h-4 w-4" />
            <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete <strong>{website.company_name}</strong>. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default WebsiteActions;
