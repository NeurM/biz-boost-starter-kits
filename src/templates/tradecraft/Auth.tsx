
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { signIn, signUp, getCurrentUser } from "@/utils/supabase";

const TradecraftAuth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  const navItems = [
    { name: "Home", path: "/tradecraft" },
    { name: "About", path: "/tradecraft/about" },
    { name: "Services", path: "/tradecraft/services" },
    { name: "Blog", path: "/tradecraft/blog" },
    { name: "Contact", path: "/tradecraft/contact" },
  ];
  
  const contactInfo = {
    address: "123 Trade Street, Tradeville, TV 12345",
    phone: "(555) 456-7890",
    email: "info@tradecraft.com",
  };

  const [loginForm, setLoginForm] = useState({
    email: '',
    password: ''
  });
  
  const [registerForm, setRegisterForm] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      const { data } = await getCurrentUser();
      if (data.user) {
        navigate('/tradecraft');
      }
    };
    
    checkAuth();
  }, [navigate]);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const { data, error } = await signIn(loginForm.email, loginForm.password);
      
      if (error) {
        toast({
          title: "Login Failed",
          description: error.message,
          variant: "destructive"
        });
      } else if (data) {
        toast({
          title: "Login Successful",
          description: "Welcome back!"
        });
        navigate('/tradecraft');
      }
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Login Failed",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (registerForm.password !== registerForm.confirmPassword) {
      toast({
        title: "Registration Failed",
        description: "Passwords do not match",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { data, error } = await signUp(registerForm.email, registerForm.password);
      
      if (error) {
        toast({
          title: "Registration Failed",
          description: error.message,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Registration Successful",
          description: "Check your email for a confirmation link to complete your registration."
        });
        
        // In development, users might want to proceed without email confirmation
        if (data?.user && !data.session) {
          toast({
            title: "Note",
            description: "For development, you might want to disable email confirmation in the Supabase dashboard."
          });
        }
        
        if (data?.session) {
          navigate('/tradecraft');
        }
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast({
        title: "Registration Failed",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar 
        logo="Trade<span class='text-blue-600'>Craft</span>" 
        basePath="tradecraft"
        navItems={navItems}
      />
      
      <div className="flex-grow">
        <div className="container mx-auto px-6 py-16">
          <h1 className="text-3xl font-bold text-center mb-10">Account Access</h1>
          
          <div className="max-w-md mx-auto">
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold">Welcome</CardTitle>
                <CardDescription>Sign in or create an account to access TradeCraft services</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="login" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-8">
                    <TabsTrigger value="login">Login</TabsTrigger>
                    <TabsTrigger value="register">Register</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="login">
                    <form onSubmit={handleLoginSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="login-email">Email</Label>
                        <Input 
                          id="login-email" 
                          type="email" 
                          placeholder="your@email.com" 
                          value={loginForm.email}
                          onChange={(e) => setLoginForm({...loginForm, email: e.target.value})}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="login-password">Password</Label>
                        <Input 
                          id="login-password" 
                          type="password" 
                          value={loginForm.password}
                          onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                          required
                        />
                      </div>
                      <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
                        {isLoading ? "Signing in..." : "Sign In"}
                      </Button>
                    </form>
                  </TabsContent>
                  
                  <TabsContent value="register">
                    <form onSubmit={handleRegisterSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="register-email">Email</Label>
                        <Input 
                          id="register-email" 
                          type="email" 
                          placeholder="your@email.com" 
                          value={registerForm.email}
                          onChange={(e) => setRegisterForm({...registerForm, email: e.target.value})}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="register-password">Password</Label>
                        <Input 
                          id="register-password" 
                          type="password" 
                          value={registerForm.password}
                          onChange={(e) => setRegisterForm({...registerForm, password: e.target.value})}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="register-confirm-password">Confirm Password</Label>
                        <Input 
                          id="register-confirm-password" 
                          type="password" 
                          value={registerForm.confirmPassword}
                          onChange={(e) => setRegisterForm({...registerForm, confirmPassword: e.target.value})}
                          required
                        />
                      </div>
                      <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
                        {isLoading ? "Creating account..." : "Create Account"}
                      </Button>
                    </form>
                  </TabsContent>
                </Tabs>
                
                <div className="mt-6 text-center">
                  <Button variant="outline" onClick={() => navigate('/tradecraft')} className="w-full">
                    Back to TradeCraft
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      <Footer 
        logo="TradeCraft"
        description="Your trusted partner for professional trade services."
        basePath="tradecraft"
        navItems={navItems}
        contactInfo={contactInfo}
      />
    </div>
  );
};

export default TradecraftAuth;
