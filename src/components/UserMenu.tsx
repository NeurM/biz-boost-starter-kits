
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

const UserMenu = () => {
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
  
  // Check if we're on a template that has its own auth-related UI
  const isTemplateWithSpecialUI = isTemplatePage;
  
  // If on a template page with its own auth UI, don't show this UserMenu
  if (isTemplateWithSpecialUI && !isMainHomePage) {
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
  
  // For non-template pages or main home page, show login or user menu
  if (!user) {
    return (
      <Button variant="outline" asChild size="sm">
        <Link to="/auth">
          <User className="h-4 w-4 mr-2" />
          Login
        </Link>
      </Button>
    );
  }
  
  // For all pages when logged in, show a simple logout button
  return (
    <Button 
      variant="outline" 
      size="sm"
      onClick={handleLogout}
      className="flex items-center"
    >
      <LogOut className="h-4 w-4 mr-2" />
      Logout
    </Button>
  );
};

export default UserMenu;
