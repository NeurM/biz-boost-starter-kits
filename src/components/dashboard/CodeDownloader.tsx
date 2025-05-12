
import React, { useState } from 'react';
import { saveAs } from 'file-saver';
import JSZip from 'jszip';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, FileCode, Code, Package } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

interface WebsiteConfig {
  id: string;
  template_id: string;
  company_name: string;
  domain_name: string;
  logo: string;
  color_scheme?: string;
  secondary_color_scheme?: string;
  deployment_status?: string;
  deployment_url?: string;
  last_deployed_at?: string;
}

interface CodeDownloaderProps {
  websiteConfig?: WebsiteConfig | null;
}

const CodeDownloader: React.FC<CodeDownloaderProps> = ({ websiteConfig }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  const handleDownloadCode = async () => {
    if (!websiteConfig) {
      toast({
        title: "No website selected",
        description: "Please select a website from the dropdown first.",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Create a new JSZip instance
      const zip = new JSZip();
      
      // Add website configuration as JSON
      zip.file("website-config.json", JSON.stringify(websiteConfig, null, 2));
      
      // Add sample React code based on the template
      const templateFolder = zip.folder("src");
      if (templateFolder) {
        templateFolder.file("index.js", `
// Main entry point for ${websiteConfig.company_name} website
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
        `);
        
        templateFolder.file("App.js", `
// App component for ${websiteConfig.company_name} website (Template: ${websiteConfig.template_id})
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

function App() {
  return (
    <BrowserRouter>
      <Navbar companyName="${websiteConfig.company_name}" logo="${websiteConfig.logo}" />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
      <Footer companyName="${websiteConfig.company_name}" />
    </BrowserRouter>
  );
}

export default App;
        `);
        
        // Add CSS with custom colors
        templateFolder.file("styles.css", `
/* Styles for ${websiteConfig.company_name} website */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

:root {
  --primary-color: ${websiteConfig.color_scheme || '#3b82f6'};
  --secondary-color: ${websiteConfig.secondary_color_scheme || '#6b7280'};
  --text-color: #1f2937;
  --background-color: #ffffff;
}

body {
  font-family: 'Inter', sans-serif;
  color: var(--text-color);
  background-color: var(--background-color);
  margin: 0;
  padding: 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

/* Animation utilities */
.fade-in {
  animation: fadeIn 0.5s ease-in;
}

.slide-up {
  animation: slideUp 0.5s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
        `);
        
        // Add package.json
        zip.file("package.json", `{
  "name": "${websiteConfig.company_name.toLowerCase().replace(/\s+/g, '-')}",
  "version": "1.0.0",
  "private": true,
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.8.1",
    "react-scripts": "5.0.1",
    "framer-motion": "^10.12.4",
    "tailwindcss": "^3.3.2",
    "postcss": "^8.4.23",
    "autoprefixer": "^10.4.14"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject",
    "deploy": "gh-pages -d build"
  },
  "devDependencies": {
    "gh-pages": "^5.0.0"
  },
  "eslintConfig": {
    "extends": [
      "react-app"
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
  }
}`);
        
        // Add Tailwind config
        zip.file("tailwind.config.js", `
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "${websiteConfig.color_scheme || 'blue'}",
        secondary: "${websiteConfig.secondary_color_scheme || 'gray'}"
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in',
        'slide-up': 'slideUp 0.5s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
        `);
        
        // Add README
        zip.file("README.md", `# ${websiteConfig.company_name} Website

This is the source code for the ${websiteConfig.company_name} website, built with React.

## Getting Started

1. Install dependencies:
   \`\`\`
   npm install
   \`\`\`

2. Start the development server:
   \`\`\`
   npm start
   \`\`\`

3. Build for production:
   \`\`\`
   npm run build
   \`\`\`

## Template Information

This website was built using the ${websiteConfig.template_id} template.

## Deployment

${websiteConfig.deployment_url ? `This website is deployed at: ${websiteConfig.deployment_url}` : 'Not yet deployed.'}

## GitHub Actions Deployment

1. Create a GitHub repository
2. Push this code to the repository
3. Configure the deployment settings in the dashboard
4. Follow the deployment instructions to set up GitHub Actions
`);

        // Add GitHub Actions workflow example
        const workflowsFolder = zip.folder(".github/workflows");
        if (workflowsFolder) {
          workflowsFolder.file("deploy.yml", `
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
        }
      }
      
      // Generate the zip file
      const content = await zip.generateAsync({ type: "blob" });
      
      // Save with custom filename including company name
      const filename = websiteConfig.company_name.toLowerCase().replace(/\s+/g, '-') + "-website-code.zip";
      saveAs(content, filename);
      
      toast({
        title: "Download Started",
        description: `Your code for ${websiteConfig.company_name} is being downloaded.`,
      });
    } catch (error) {
      console.error('Error generating code zip:', error);
      toast({
        title: "Download Failed",
        description: "There was an error generating your code. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="overflow-hidden border-muted-foreground/20 shadow-md transition-all hover:shadow-lg">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Code className="h-5 w-5 text-blue-500" />
            <CardTitle className="text-lg">Code Downloader</CardTitle>
          </div>
          {websiteConfig && (
            <Badge variant="outline" className="bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
              {websiteConfig.template_id}
            </Badge>
          )}
        </div>
        <CardDescription>
          Download the source code for your website
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="mb-4">
          {websiteConfig ? (
            <p>
              Download the source code for your <span className="font-medium text-blue-600 dark:text-blue-400">{websiteConfig.company_name}</span> website. 
              This includes all the necessary files to run and deploy your website.
            </p>
          ) : (
            <p className="text-amber-600">
              Select a website from the dropdown above to download its code.
            </p>
          )}
        </div>
        
        <div className="rounded-md border bg-card/50 p-4">
          <h3 className="flex items-center font-semibold mb-3 text-muted-foreground">
            <Package className="mr-2 h-4 w-4" />
            What's included:
          </h3>
          <ul className="grid gap-2 text-sm">
            <li className="flex items-center">
              <div className="mr-2 h-1.5 w-1.5 rounded-full bg-green-500"></div>
              Complete React application with routing
            </li>
            <li className="flex items-center">
              <div className="mr-2 h-1.5 w-1.5 rounded-full bg-green-500"></div>
              TailwindCSS with your brand colors
            </li>
            <li className="flex items-center">
              <div className="mr-2 h-1.5 w-1.5 rounded-full bg-green-500"></div>
              Animation utilities and Framer Motion
            </li>
            <li className="flex items-center">
              <div className="mr-2 h-1.5 w-1.5 rounded-full bg-green-500"></div>
              GitHub Actions workflow for deployment
            </li>
            <li className="flex items-center">
              <div className="mr-2 h-1.5 w-1.5 rounded-full bg-green-500"></div>
              Detailed README with setup instructions
            </li>
          </ul>
        </div>
      </CardContent>
      <CardFooter className="bg-muted/20 pb-4 pt-4">
        <Button
          onClick={handleDownloadCode}
          disabled={isLoading || !websiteConfig}
          className="w-full bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
          size="lg"
        >
          {isLoading ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Preparing Download...
            </span>
          ) : (
            <>
              <Download className="mr-2 h-4 w-4" />
              Download Website Code
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CodeDownloader;
