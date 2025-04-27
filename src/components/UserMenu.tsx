
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
}

const UserMenu = ({ isTemplate = false, templatePath = '' }: UserMenuProps) => {
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

  // Hide app navigation when in templates
  if (!isTemplate && isTemplatePage && location.pathname !== "/") {
    return null;
  }
  
  // If this is a template-specific UserMenu but we're not on the corresponding template page, don't show it
  if (isTemplate && templatePath && !location.pathname.startsWith(`/${templatePath}`)) {
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
  const renderTemplateActions = () => {
    if (!isTemplate) return null;
    
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
    
    // Mock domain availability check (would be replaced by actual API call)
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
    }, 2000);
    
    // In a real application, this would trigger a website publishing process
    console.log(`Publishing website: ${template} to domain: ${domain}`);
  };
  
  // Determine auth link based on whether this is a template or main menu
  const authLink = isTemplate ? `/${templatePath}/auth` : "/auth";
  
  const loginText = t('auth.login') || "Login";
  const logoutText = t('auth.logout') || "Logout";
  
  return (
    <div className="z-50 flex items-center">
      {renderTemplateActions()}
      
      {!user ? (
        <Button variant="outline" asChild size="sm" className={isTemplate ? "template-login-btn" : ""}>
          <Link to={authLink}>
            <User className="h-4 w-4 mr-2" />
            {loginText}
          </Link>
        </Button>
      ) : (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="outline" 
              size="sm"
              className={`flex items-center ${isTemplate ? "template-logout-btn" : ""}`}
            >
              <User className="h-4 w-4 mr-2" />
              {user.email?.split('@')[0]}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>{t('nav.userMenu') || "Navigation"}</DropdownMenuLabel>
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
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              {logoutText}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
};

export default UserMenu;
