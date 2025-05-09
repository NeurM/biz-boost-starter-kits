
import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { MoreHorizontal, Eye, Trash2, Download, Code } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { deleteWebsiteConfig } from "@/utils/websiteService";

interface WebsiteActionsProps {
  website: any;
  onDeleted: () => void;
}

const WebsiteActions = ({ website, onDeleted }: WebsiteActionsProps) => {
  const navigate = useNavigate();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const handleViewWebsite = () => {
    if (!website) return;
    
    // Store in sessionStorage for template to access
    try {
      sessionStorage.setItem('companyData', JSON.stringify({
        companyName: website.company_name,
        domainName: website.domain_name,
        logo: website.logo,
        colorScheme: website.color_scheme,
        secondaryColorScheme: website.secondary_color_scheme,
        template: website.template_id
      }));
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
  };

  const handleDelete = async () => {
    if (!website?.id) return;
    
    setIsDeleting(true);
    try {
      await deleteWebsiteConfig(website.id);
      setShowDeleteDialog(false);
      toast({
        title: "Website deleted",
        description: "The website has been successfully deleted",
      });
      onDeleted();
    } catch (error) {
      console.error('Error deleting website:', error);
      toast({
        title: "Error",
        description: "Failed to delete website",
        variant: "destructive"
      });
    } finally {
      setIsDeleting(false);
    }
  };
  
  const handleDownload = () => {
    if (!website) return;
    
    // Create a safe filename from company name
    const safeName = website.company_name.replace(/\s+/g, '_').toLowerCase();
    
    // Generate React component code based on template
    const reactCode = generateReactCode(website);
    
    // Create a blob with the React code
    const blob = new Blob([reactCode], { type: 'text/javascript' });
    
    // Create a download link
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${safeName}_${website.template_id}_component.jsx`;
    
    // Trigger the download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "React code downloaded",
      description: "Your website React component has been downloaded",
    });
  };
  
  // Function to generate React component code
  const generateReactCode = (website) => {
    const templateName = website.template_id.charAt(0).toUpperCase() + website.template_id.slice(1);
    const primaryColor = website.color_scheme || 'blue';
    const secondaryColor = website.secondary_color_scheme || 'orange';
    
    return `import React from 'react';

/**
 * ${templateName} Website Template for ${website.company_name}
 * Generated with Website Builder
 * 
 * Primary Color: ${primaryColor}
 * Secondary Color: ${secondaryColor}
 */

export const ${templateName}Website = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header/Navigation */}
      <header className={\`bg-${primaryColor}-600 text-white py-6\`}>
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              {${website.logo ? `<img src="${website.logo}" alt="${website.company_name}" className="h-10 mr-2" />` : ''}}
              <h1 className="text-2xl font-bold">${website.company_name}</h1>
            </div>
            <nav>
              <ul className="flex space-x-6">
                <li><a href="#" className="hover:text-${primaryColor}-200">Home</a></li>
                <li><a href="#about" className="hover:text-${primaryColor}-200">About</a></li>
                <li><a href="#services" className="hover:text-${primaryColor}-200">Services</a></li>
                <li><a href="#contact" className="hover:text-${primaryColor}-200">Contact</a></li>
              </ul>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h2 className={\`text-4xl font-bold mb-4 text-${primaryColor}-700\`}>Welcome to ${website.company_name}</h2>
              <p className="text-gray-600 mb-6">Your trusted partner for [services]. We provide exceptional solutions tailored to your needs.</p>
              <button className={\`bg-${secondaryColor}-600 text-white px-6 py-3 rounded-md hover:bg-${secondaryColor}-700 transition\`}>
                Get Started
              </button>
            </div>
            <div className="md:w-1/2">
              <div className="bg-gray-200 rounded-lg h-80 w-full flex items-center justify-center">
                [Your Hero Image]
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <h2 className={\`text-3xl font-bold mb-8 text-center text-${primaryColor}-700\`}>About Us</h2>
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-gray-600 mb-6">
              ${website.company_name} is dedicated to providing excellent services to our customers. 
              We believe in quality, integrity, and customer satisfaction.
            </p>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className={\`text-3xl font-bold mb-8 text-center text-${primaryColor}-700\`}>Our Services</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className={\`w-12 h-12 rounded-full bg-${primaryColor}-100 text-${primaryColor}-600 flex items-center justify-center mb-4\`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Service One</h3>
              <p className="text-gray-600">Description of your first service offering and its benefits to customers.</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className={\`w-12 h-12 rounded-full bg-${primaryColor}-100 text-${primaryColor}-600 flex items-center justify-center mb-4\`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Service Two</h3>
              <p className="text-gray-600">Description of your second service offering and its benefits to customers.</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className={\`w-12 h-12 rounded-full bg-${primaryColor}-100 text-${primaryColor}-600 flex items-center justify-center mb-4\`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Service Three</h3>
              <p className="text-gray-600">Description of your third service offering and its benefits to customers.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className={\`py-16 bg-${primaryColor}-700 text-white\`}>
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Contact Us</h2>
          <div className="max-w-3xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4">Get In Touch</h3>
                <p className="mb-4">We'd love to hear from you. Please fill out the form, and we'll get back to you as soon as possible.</p>
                <p className="mb-2"><strong>Email:</strong> contact@${website.domain_name || 'example.com'}</p>
                <p className="mb-2"><strong>Phone:</strong> (123) 456-7890</p>
                <p><strong>Address:</strong> 123 Business Street, City, State 12345</p>
              </div>
              <div>
                <form>
                  <div className="mb-4">
                    <input type="text" placeholder="Your Name" className="w-full px-4 py-2 rounded-md text-gray-900" />
                  </div>
                  <div className="mb-4">
                    <input type="email" placeholder="Your Email" className="w-full px-4 py-2 rounded-md text-gray-900" />
                  </div>
                  <div className="mb-4">
                    <textarea placeholder="Your Message" className="w-full px-4 py-2 rounded-md text-gray-900" rows={4}></textarea>
                  </div>
                  <button className={\`bg-${secondaryColor}-600 text-white px-6 py-2 rounded-md hover:bg-${secondaryColor}-700 transition\`}>
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h3 className="text-xl font-bold">${website.company_name}</h3>
              <p className="text-gray-400">© {new Date().getFullYear()} All rights reserved</p>
            </div>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-${secondaryColor}-400">Privacy Policy</a>
              <a href="#" className="hover:text-${secondaryColor}-400">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ${templateName}Website;
`;
  };
  
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleViewWebsite}>
            <Eye className="mr-2 h-4 w-4" />
            <span>View Website</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleDownload}>
            <Code className="mr-2 h-4 w-4" />
            <span>Download React Code</span>
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => setShowDeleteDialog(true)}
            className="text-destructive focus:text-destructive"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the website "{website?.company_name}" and all of its data.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete} 
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default WebsiteActions;
