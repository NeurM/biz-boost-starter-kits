
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
import { MoreHorizontal, Eye, Trash2, Download } from "lucide-react";
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
    
    // Create a blob object with simple HTML content
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${website.company_name} - ${website.template_id}</title>
  <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
  <style>
    /* Custom styles for ${website.template_id} template */
    .custom-header {
      background-color: ${website.color_scheme ? `var(--${website.color_scheme}-500)` : '#3b82f6'};
      color: white;
    }
    .custom-button {
      background-color: ${website.secondary_color_scheme ? `var(--${website.secondary_color_scheme}-500)` : '#f59e0b'};
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
      <h1 class="text-3xl font-bold">${website.company_name}</h1>
      <p class="mt-2">${website.domain_name || 'example.com'}</p>
    </div>
  </header>

  <main class="container mx-auto px-4 py-8">
    <section class="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 class="text-2xl font-semibold mb-4">Welcome to ${website.company_name}</h2>
      <p class="mb-4">This is a sample page for your ${website.template_id} template website.</p>
      <button class="custom-button">Contact Us</button>
    </section>
  </main>

  <footer class="bg-gray-800 text-white py-6">
    <div class="container mx-auto px-4">
      <p>&copy; ${new Date().getFullYear()} ${website.company_name}. All rights reserved.</p>
    </div>
  </footer>
</body>
</html>`;
    
    // Create a Blob from the content
    const blob = new Blob([htmlContent], { type: 'text/html' });
    
    // Create a download link
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${safeName}_${website.template_id}_template.html`;
    
    // Trigger the download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Code downloaded",
      description: "Your website code has been downloaded",
    });
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
            <Download className="mr-2 h-4 w-4" />
            <span>Download Code</span>
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
