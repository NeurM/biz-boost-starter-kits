
import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, LogOut } from 'lucide-react';
import { signOut } from '@/utils/supabase';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/hooks/use-toast';

interface UserMenuProps {
  isTemplate?: boolean;
  templatePath?: string;
}

const UserMenu = ({ isTemplate = false, templatePath = '' }: UserMenuProps) => {
  const { user, signOut: handleAuthSignOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check if we're on a template page
  const isTemplatePage = location.pathname.startsWith("/service") || 
                         location.pathname.startsWith("/tradecraft") || 
                         location.pathname.startsWith("/retail") || 
                         location.pathname.startsWith("/expert") || 
                         location.pathname.startsWith("/cleanslate");
  
  // Don't show the user menu on the main menu bar when viewing a template
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
        title: "Logged out successfully",
        description: "You have been logged out of your account.",
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
        title: "Logout Failed",
        description: error.message || "There was a problem logging out",
        variant: "destructive"
      });
    }
  };
  
  // Determine auth link based on whether this is a template or main menu
  const authLink = isTemplate ? `/${templatePath}/auth` : "/auth";
  
  return (
    <div className="z-50">
      {!user ? (
        <Button variant="outline" asChild size="sm" className={isTemplate ? "template-login-btn" : ""}>
          <Link to={authLink}>
            <User className="h-4 w-4 mr-2" />
            Login
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
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
};

export default UserMenu;
