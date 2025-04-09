
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
  const isTemplatePage = location.pathname !== "/" && 
                         location.pathname !== "/auth" && 
                         location.pathname !== "/saved-websites";
  
  // Check if we're on the Service Pro template
  const isServiceTemplate = location.pathname.startsWith("/service");
  
  useEffect(() => {
    // Only check for user if not on a template page except Service Pro
    // or if we're on the saved websites page
    if ((!isTemplatePage || isServiceTemplate || location.pathname === "/saved-websites")) {
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
    } else {
      // For other template pages, don't use the authenticated user
      setUser(null);
    }
  }, [location.pathname, isTemplatePage, isServiceTemplate]);
  
  const handleLogout = async () => {
    try {
      const { error } = await signOut();
      if (error) throw error;
      
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account.",
      });
      
      setUser(null);
      navigate('/');
    } catch (error: any) {
      console.error('Logout error:', error);
      toast({
        title: "Logout Failed",
        description: error.message || "There was a problem logging out",
        variant: "destructive"
      });
    }
  };
  
  // If on a template page (except Service Pro), don't show UserMenu
  if (isTemplatePage && !isServiceTemplate) {
    return null;
  }
  
  // For non-template pages or Service Pro, show login or user menu
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
  
  // For home page, show a simpler logout button instead of dropdown
  if (location.pathname === "/" || isServiceTemplate) {
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
  }
  
  // For other pages like saved-websites, show the dropdown
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <User className="h-4 w-4 mr-2" />
          {user.email ? user.email.split('@')[0] : 'Account'}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
