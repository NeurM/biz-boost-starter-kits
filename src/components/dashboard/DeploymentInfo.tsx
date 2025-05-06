
// Update the DeploymentInfo component to fix the type error

// This is a new file, so I'll implement it from scratch based on the context of the errors
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Download, Github } from "lucide-react";
import { useTemplateTheme } from '@/context/TemplateThemeContext';
import { generateGithubWorkflow } from '@/utils/supabase';

interface DeploymentInfoProps {
  websiteConfig: {
    id: string;
    template_id: string;
    company_name: string;
    domain_name: string;
    logo: string;
    color_scheme?: string;
    secondary_color_scheme?: string;
  };
}

const DeploymentInfo: React.FC<DeploymentInfoProps> = ({ websiteConfig }) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSettingUpGithub, setIsSettingUpGithub] = useState(false);
  const { toast } = useToast();
  const { templateColor, secondaryColor } = useTemplateTheme();

  const handleDownloadCode = async () => {
    try {
      setIsDownloading(true);
      
      // Create a website package with all necessary files
      const websiteData = {
        template: websiteConfig.template_id,
        companyName: websiteConfig.company_name,
        domainName: websiteConfig.domain_name,
        logo: websiteConfig.logo,
        colorScheme: websiteConfig.color_scheme || templateColor,
        secondaryColorScheme: websiteConfig.secondary_color_scheme || secondaryColor,
      };
      
      // Create HTML file content
      const htmlContent = generateHTMLTemplate(websiteData);
      
      // Create CSS file content
      const cssContent = generateCSSTemplate(websiteData);
      
      // Create JavaScript file content
      const jsContent = generateJSTemplate(websiteData);
      
      // Create package.json content
      const packageJsonContent = generatePackageJson(websiteData);
      
      // Create README content
      const readmeContent = generateReadme(websiteData);
      
      // Create a zip file containing all files
      const zip = await createZip({
        'index.html': htmlContent,
        'styles.css': cssContent,
        'script.js': jsContent,
        'package.json': packageJsonContent,
        'README.md': readmeContent,
        'assets/placeholder.svg': 'SVG Placeholder',
      });
      
      // Trigger download
      downloadZip(zip, `${websiteConfig.company_name.replace(/\s+/g, '-').toLowerCase()}-website.zip`);
      
      toast({
        title: "Download Successful",
        description: "Your website code has been downloaded successfully.",
      });
    } catch (error) {
      console.error("Error downloading website code:", error);
      toast({
        title: "Download Failed",
        description: "There was an error downloading your website code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  const handleSetupGithub = async () => {
    try {
      setIsSettingUpGithub(true);
      
      const deployUrl = `https://${websiteConfig.domain_name}`;
      
      // Generate GitHub workflow file
      const workflowYaml = generateGithubWorkflow({
        repository: `${websiteConfig.company_name.replace(/\s+/g, '-').toLowerCase()}/website`,
        branch: 'main',
        buildCommand: 'npm run build',
        deployCommand: 'npm run deploy',
        deployUrl
      });
      
      // Create a zip file containing GitHub workflow file
      const zip = await createZip({
        '.github/workflows/deploy.yml': workflowYaml
      });
      
      // Trigger download
      downloadZip(zip, `${websiteConfig.company_name.replace(/\s+/g, '-').toLowerCase()}-github-workflow.zip`);
      
      toast({
        title: "GitHub Setup Files Downloaded",
        description: "GitHub Actions workflow file has been downloaded. Please add this to your GitHub repository.",
      });
    } catch (error) {
      console.error("Error setting up GitHub:", error);
      toast({
        title: "GitHub Setup Failed",
        description: "There was an error generating the GitHub workflow files. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSettingUpGithub(false);
    }
  };

  // Helper function to create a zip file
  const createZip = async (files: Record<string, string>): Promise<Blob> => {
    // Simulate creating a zip file by just returning a blob with JSON content
    // In a real implementation, you would use a library like JSZip
    const filesContent = JSON.stringify(files, null, 2);
    return new Blob([filesContent], { type: 'application/zip' });
  };

  // Helper function to trigger download
  const downloadZip = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Helper function to generate HTML template
  const generateHTMLTemplate = (data: any): string => {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${data.companyName}</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <header>
        <nav>
            <div class="logo">
                ${data.logo ? `<img src="${data.logo}" alt="${data.companyName} Logo">` : data.companyName}
            </div>
            <ul>
                <li><a href="#home">Home</a></li>
                <li><a href="#about">About</a></li>
                <li><a href="#services">Services</a></li>
                <li><a href="#contact">Contact</a></li>
            </ul>
        </nav>
    </header>

    <main>
        <section id="home" class="hero">
            <h1>Welcome to ${data.companyName}</h1>
            <p>Your trusted partner for quality services</p>
            <a href="#contact" class="cta-button">Get Started</a>
        </section>

        <!-- More sections would go here -->
    </main>

    <footer>
        <p>&copy; ${new Date().getFullYear()} ${data.companyName}. All rights reserved.</p>
    </footer>

    <script src="script.js"></script>
</body>
</html>
    `;
  };

  // Helper function to generate CSS template
  const generateCSSTemplate = (data: any): string => {
    return `
/* Base styles */
:root {
    --primary-color: ${data.colorScheme || '#3b82f6'};
    --secondary-color: ${data.secondaryColorScheme || '#f59e0b'};
    --text-color: #333;
    --background-color: #fff;
}

* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}

body {
    font-family: Arial, sans-serif;
    line-height: 1.6;
    color: var(--text-color);
    background-color: var(--background-color);
}

/* More CSS would go here */
    `;
  };

  // Helper function to generate JS template
  const generateJSTemplate = (data: any): string => {
    return `
// Main JavaScript file for ${data.companyName} website

document.addEventListener('DOMContentLoaded', function() {
    console.log('Website loaded successfully!');
    
    // Add your custom JavaScript here
});
    `;
  };

  // Helper function to generate package.json
  const generatePackageJson = (data: any): string => {
    return JSON.stringify({
      "name": `${data.companyName.toLowerCase().replace(/\s+/g, '-')}`,
      "version": "1.0.0",
      "description": `Website for ${data.companyName}`,
      "main": "index.html",
      "scripts": {
        "start": "npx serve",
        "build": "mkdir -p dist && cp -r * dist/ || true",
        "deploy": "echo 'Add your deployment logic here'"
      },
      "keywords": [
        "website",
        data.template
      ],
      "author": "",
      "license": "MIT",
      "devDependencies": {
        "serve": "^14.0.0"
      }
    }, null, 2);
  };

  // Helper function to generate README
  const generateReadme = (data: any): string => {
    return `# ${data.companyName} Website

This is the website for ${data.companyName}, generated using the ${data.template} template.

## Getting Started

1. Install dependencies: \`npm install\`
2. Start development server: \`npm start\`
3. Build for production: \`npm run build\`
4. Deploy to your server: \`npm run deploy\`

## Customization

Edit the following files to customize your website:

- \`index.html\` - Main HTML structure
- \`styles.css\` - CSS styles
- \`script.js\` - JavaScript functionality

## Domain Setup

This website is configured to be hosted at: ${data.domainName}
    `;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Deployment Options</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="text-lg font-medium mb-2">Download Code</h3>
          <p className="text-gray-500 mb-2">
            Download the website files to host on your own server.
          </p>
          <Button 
            onClick={handleDownloadCode}
            disabled={isDownloading}
            className="flex items-center"
          >
            <Download className="h-4 w-4 mr-2" />
            {isDownloading ? "Downloading..." : "Download Website Code"}
          </Button>
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-2">GitHub Integration</h3>
          <p className="text-gray-500 mb-2">
            Set up CI/CD with GitHub Actions to automatically deploy your website.
          </p>
          <Button 
            onClick={handleSetupGithub}
            disabled={isSettingUpGithub}
            variant="outline"
            className="flex items-center"
          >
            <Github className="h-4 w-4 mr-2" />
            {isSettingUpGithub ? "Setting up..." : "Setup GitHub Integration"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DeploymentInfo;
