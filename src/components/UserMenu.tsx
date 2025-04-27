
import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, LogOut, Edit, Globe } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/hooks/use-toast';
import { useLanguage } from '@/context/LanguageContext';

interface UserMenuProps {
  isTemplate?: boolean;
  templatePath?: string;
  isAppLevel?: boolean;
}

const UserMenu = ({ isTemplate = false, templatePath = '', isAppLevel = false }: UserMenuProps) => {
  const { user, signOut: handleAuthSignOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();
  
  // Check if we're on a template page
  const isTemplatePage = location.pathname.startsWith("/service") || 
                         location.pathname.startsWith("/tradecraft") || 
                         location.pathname.startsWith("/retail") || 
                         location.pathname.startsWith("/expert") || 
                         location.pathname.startsWith("/cleanslate");

  // If this is a template-specific UserMenu but we're not on the corresponding template page, don't show it
  if (isTemplate && templatePath && !location.pathname.startsWith(`/${templatePath}`)) {
    return null;
  }

  // If there's no user, render the Login button for app-level navigation
  if (!user && isAppLevel) {
    return (
      <Button variant="default" size="sm" asChild>
        <Link to="/auth">
          {t('auth.login') || "Login"}
        </Link>
      </Button>
    );
  }
  
  // If there's no user at all, render nothing
  if (!user) {
    return null;
  }
  
  const handleLogout = async () => {
    try {
      await handleAuthSignOut();
      
      toast({
        title: t('auth.loggedOut') || "Logged out successfully",
        description: t('auth.logoutSuccess') || "You have been logged out of your account.",
      });
      
      // If on a template page, stay on that template's home
      if (isTemplatePage) {
        const currentTemplate = location.pathname.split('/')[1];
        navigate(`/${currentTemplate}`);
      } else {
        navigate('/');
      }
    } catch (error: any) {
      console.error('Logout error:', error);
      toast({
        title: t('auth.logoutFailed') || "Logout Failed",
        description: error.message || "There was a problem logging out",
        variant: "destructive"
      });
    }
  };

  // Only show website-specific controls in template pages
  // AND only when we're not in the app-level navigation (isAppLevel === false)
  const renderTemplateActions = () => {
    // Only show edit/publish buttons on template pages
    if (!isTemplate || isAppLevel) return null;
    
    return (
      <div className="flex items-center mr-4 space-x-2">
        <Button variant="outline" size="sm" onClick={handleEditContent}>
          <Edit className="h-4 w-4 mr-2" />
          {t('actions.edit') || "Edit Content"}
        </Button>
        <Button size="sm" onClick={handlePublishWebsite}>
          <Globe className="h-4 w-4 mr-2" />
          {t('actions.publish') || "Publish"}
        </Button>
      </div>
    );
  };
  
  // Handle website content editing
  const handleEditContent = () => {
    const template = templatePath || location.pathname.split('/')[1];
    navigate(`/${template}/edit`, { state: { editMode: true } });
  };
  
  // Handle website publishing with domain checks
  const handlePublishWebsite = () => {
    // Extract template info from URL and get domain
    const template = templatePath || location.pathname.split('/')[1];
    const domain = sessionStorage.getItem('companyData') ? 
                   JSON.parse(sessionStorage.getItem('companyData') || '{}').domainName : 
                   'example.com';
    
    // Check if domain appears valid
    if (!domain || domain === 'example.com' || !domain.includes('.')) {
      toast({
        title: "Domain Required",
        description: "Please set a valid domain name in the website editor first.",
        variant: "destructive"
      });
      return;
    }
    
    // Check domain availability
    checkDomainAvailability(domain).then(isAvailable => {
      if (!isAvailable) {
        toast({
          title: "Domain Not Available",
          description: "The domain you specified is already in use. Please try a different domain name.",
          variant: "destructive"
        });
        return;
      }
      
      // Simulate Hostinger integration
      toast({
        title: "Publishing Website...",
        description: "Checking domain availability and preparing deployment.",
      });
      
      // Simulate publishing process
      setTimeout(() => {
        toast({
          title: "Website Published!",
          description: `Your website is now live at ${domain}. Connect with Hostinger to set up DNS.`,
        });
        
        // Add link to Hostinger in a second toast
        setTimeout(() => {
          toast({
            title: "Connect with Hostinger",
            description: "Click to set up your domain with Hostinger",
            action: (
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => window.open('https://www.hostinger.com', '_blank')}
              >
                Go to Hostinger
              </Button>
            ),
          });
        }, 1000);
      }, 2000);
    });
  };
  
  // Mock domain availability check (would connect to real API)
  const checkDomainAvailability = async (domain: string): Promise<boolean> => {
    // In a real implementation, this would call an API to check domain availability
    return new Promise((resolve) => {
      setTimeout(() => {
        // Randomly return true or false, but mostly true for better UX
        resolve(Math.random() > 0.2);
      }, 1000);
    });
  };
  
  // Determine auth link based on whether this is a template or main menu
  const authLink = isTemplate ? `/${templatePath}/auth` : "/auth";
  
  const loginText = t('auth.login') || "Login";
  const logoutText = t('auth.logout') || "Logout";
  
  return (
    <div className="z-50 flex items-center">
      {renderTemplateActions()}
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            size="sm"
            className="flex items-center"
          >
            <User className="h-4 w-4 mr-2" />
            {user.email?.split('@')[0]}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>{t('nav.userMenu') || "Navigation"}</DropdownMenuLabel>
          {isAppLevel && (
            <>
              <DropdownMenuItem asChild>
                <Link to="/">{t('nav.home') || "Home"}</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/templates">{t('nav.templates') || "Templates"}</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/dashboard">{t('nav.dashboard') || "Dashboard"}</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/saved-websites">{t('nav.savedwebsites') || "Saved Websites"}</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </>
          )}
          <DropdownMenuItem onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            {logoutText}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default UserMenu;
