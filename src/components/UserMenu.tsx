
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, LogOut } from 'lucide-react';
import { signOut, getCurrentUser } from '@/utils/supabase';
import { useToast } from '@/hooks/use-toast';

const UserMenu = ({ isTemplate = false, templatePath = '' }) => {
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const location = useLocation();
  
  // Check if we're on a template page
  const isTemplatePage = location.pathname.startsWith("/service") || 
                         location.pathname.startsWith("/tradecraft") || 
                         location.pathname.startsWith("/retail") || 
                         location.pathname.startsWith("/expert") || 
                         location.pathname.startsWith("/cleanslate");
  
  // Check if we're on the main home page
  const isMainHomePage = location.pathname === "/";
  
  // If this is the main UserMenu (not template-specific) and we're on a template page, don't show it
  if (!isTemplate && isTemplatePage && !isMainHomePage) {
    return null;
  }
  
  // If this is a template-specific UserMenu but we're not on the corresponding template page, don't show it
  if (isTemplate && templatePath && !location.pathname.startsWith(`/${templatePath}`)) {
    return null;
  }
  
  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data } = await getCurrentUser();
        setUser(data.user);
      } catch (error) {
        console.error('Error checking user:', error);
        setUser(null);
      }
    };
    
    checkUser();
  }, [location.pathname]);
  
  const handleLogout = async () => {
    try {
      const { error } = await signOut();
      if (error) throw error;
      
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account.",
      });
      
      setUser(null);
      
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
        title: "Logout Failed",
        description: error.message || "There was a problem logging out",
        variant: "destructive"
      });
    }
  };
  
  // Determine auth link based on whether this is a template or main menu
  const authLink = isTemplate ? `/${templatePath}/auth` : "/auth";
  
  if (!user) {
    return (
      <Button variant="outline" asChild size="sm" className="template-login-btn">
        <Link to={authLink}>
          <User className="h-4 w-4 mr-2" />
          Login
        </Link>
      </Button>
    );
  }
  
  return (
    <Button 
      variant="outline" 
      size="sm"
      onClick={handleLogout}
      className="flex items-center template-logout-btn"
    >
      <LogOut className="h-4 w-4 mr-2" />
      Logout
    </Button>
  );
};

export default UserMenu;
