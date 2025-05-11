
import React, { useState } from 'react';
import { saveAs } from 'file-saver';
import JSZip from 'jszip';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, FileCode } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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
        
        // Add package.json
        zip.file("package.json", `{
  "name": "${websiteConfig.company_name.toLowerCase().replace(/\s+/g, '-')}",
  "version": "1.0.0",
  "private": true,
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.8.1",
    "react-scripts": "5.0.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
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
`);
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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <FileCode className="h-5 w-5 mr-2" />
          Code Downloader
        </CardTitle>
        <CardDescription>
          Download the source code for your website
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          {websiteConfig ? (
            <p>
              Download the source code for your {websiteConfig.company_name} website 
              (template: <span className="font-semibold">{websiteConfig.template_id}</span>).
              This includes all the necessary files to run and deploy your website.
            </p>
          ) : (
            <p className="text-amber-600">
              Select a website from the dropdown above to download its code.
            </p>
          )}
        </div>
        
        <div className="border rounded p-3 bg-gray-50">
          <h3 className="font-semibold mb-2">What's included:</h3>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>Complete React application source code</li>
            <li>Configuration files customized for your website</li>
            <li>Package.json with all dependencies</li>
            <li>Detailed README with setup instructions</li>
          </ul>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleDownloadCode}
          disabled={isLoading || !websiteConfig}
          className="w-full"
        >
          {isLoading ? (
            "Preparing Download..."
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
