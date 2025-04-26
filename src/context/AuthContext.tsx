
import React, { createContext, useState, useContext, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { getCurrentUser, signOut as supabaseSignOut } from '@/utils/supabase';
import { toast } from '@/hooks/use-toast';

interface AuthContextProps {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps>({
  user: null,
  session: null,
  isLoading: true,
  signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      try {
        setIsLoading(true);
        const { data, error } = await getCurrentUser();
        
        if (data?.user) {
          setUser(data.user);
          // Fix: Only access session if available in the return data
          if ('session' in data) {
            setSession(data.session as Session);
          } else {
            setSession(null);
          }
        } else {
          setUser(null);
          setSession(null);
        }
      } catch (error) {
        console.error('Error loading user:', error);
        setUser(null);
        setSession(null);
      } finally {
        setIsLoading(false);
      }
    }
    
    loadUser();
  }, []);

  const handleSignOut = async () => {
    try {
      await supabaseSignOut();
      setUser(null);
      setSession(null);
      toast({
        title: "Signed out",
        description: "You have been successfully signed out.",
      });
      return Promise.resolve();
    } catch (error: any) {
      console.error('Error signing out:', error);
      toast({
        title: "Error signing out",
        description: error.message || "An unknown error occurred",
        variant: "destructive",
      });
      return Promise.reject(error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isLoading,
        signOut: handleSignOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
