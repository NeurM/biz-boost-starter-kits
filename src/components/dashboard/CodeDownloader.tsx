
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Code, Download } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface CodeDownloaderProps {
  websiteConfig: any;
}

const CodeDownloader = ({ websiteConfig }: CodeDownloaderProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  
  const generateZipFile = (templateId: string, companyName: string) => {
    // Replace spaces with underscores and lowercase everything
    const safeName = companyName.replace(/\s+/g, '_').toLowerCase();
    
    // Create a blob object with simple HTML content
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${companyName} - ${templateId}</title>
  <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
  <style>
    /* Custom styles for ${templateId} template */
    .custom-header {
      background-color: ${websiteConfig.color_scheme ? `var(--${websiteConfig.color_scheme}-500)` : '#3b82f6'};
      color: white;
    }
    .custom-button {
      background-color: ${websiteConfig.secondary_color_scheme ? `var(--${websiteConfig.secondary_color_scheme}-500)` : '#f59e0b'};
      color: white;
      padding: 0.5rem 1rem;
      border-radius: 0.375rem;
      font-weight: 500;
    }
  </style>
</head>
<body class="bg-gray-50">
  <header class="custom-header py-6">
    <div class="container mx-auto px-4">
      <h1 class="text-3xl font-bold">${companyName}</h1>
      <p class="mt-2">${websiteConfig.domain_name || 'example.com'}</p>
    </div>
  </header>

  <main class="container mx-auto px-4 py-8">
    <section class="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 class="text-2xl font-semibold mb-4">Welcome to ${companyName}</h2>
      <p class="mb-4">This is a sample page for your ${templateId} template website.</p>
      <button class="custom-button">Contact Us</button>
    </section>
  </main>

  <footer class="bg-gray-800 text-white py-6">
    <div class="container mx-auto px-4">
      <p>&copy; ${new Date().getFullYear()} ${companyName}. All rights reserved.</p>
    </div>
  </footer>
</body>
</html>`;
    
    // Create a Blob from the content
    const blob = new Blob([htmlContent], { type: 'text/html' });
    
    // Create a download link
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${safeName}_${templateId}_template.html`;
    
    // Trigger the download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const handleDownloadCode = async () => {
    if (!websiteConfig) return;
    
    setIsGenerating(true);
    try {
      // Simulating a delay as if generating the code
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      generateZipFile(
        websiteConfig.template_id, 
        websiteConfig.company_name
      );
      
      toast({
        title: "Code generated successfully",
        description: "Your website code has been downloaded",
      });
    } catch (error) {
      console.error("Error generating code:", error);
      toast({
        title: "Error generating code",
        description: "There was an issue generating your website code",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Website Code</CardTitle>
        <CardDescription>
          Download code snippets for your website
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!websiteConfig ? (
          <p className="text-muted-foreground">No website configured yet</p>
        ) : (
          <div>
            <p className="text-sm text-gray-600 mb-4">
              Download sample HTML code for your website based on your selected template and configuration.
            </p>
            <Button
              onClick={handleDownloadCode}
              disabled={isGenerating}
              className="w-full"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Code...
                </>
              ) : (
                <>
                  <Code className="mr-2 h-4 w-4" />
                  Download Code Snippets
                </>
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CodeDownloader;
