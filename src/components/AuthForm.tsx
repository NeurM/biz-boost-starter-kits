
import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";
import { signIn, signUp } from '@/utils/supabase';

interface AuthFormProps {
  onSuccess?: () => void;
  className?: string;
}

const AuthForm = ({ onSuccess, className = "" }: AuthFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { register: registerLogin, handleSubmit: handleSubmitLogin, formState: { errors: loginErrors } } = useForm();
  const { register: registerSignup, handleSubmit: handleSubmitSignup, formState: { errors: signupErrors } } = useForm();

  const onLogin = async (data: any) => {
    setIsLoading(true);
    try {
      const { data: user, error } = await signIn(data.email, data.password);
      
      if (error) throw error;
      
      toast({
        title: "Login successful!",
        description: "Welcome back!",
      });
      
      if (onSuccess) onSuccess();
    } catch (error: any) {
      console.error(error);
      toast({
        title: "Login failed",
        description: error.message || "Please check your credentials and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onSignup = async (data: any) => {
    if (data.password !== data.confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please ensure both passwords match.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    try {
      const { data: user, error } = await signUp(data.email, data.password);
      
      if (error) throw error;
      
      toast({
        title: "Registration successful!",
        description: "Please check your email to confirm your account.",
      });
      
      if (onSuccess) onSuccess();
    } catch (error: any) {
      console.error(error);
      toast({
        title: "Registration failed",
        description: error.message || "There was an error creating your account.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className={`w-full max-w-md mx-auto ${className}`}>
      <CardHeader>
        <CardTitle className="text-center">Account Access</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="login">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <form onSubmit={handleSubmitLogin(onLogin)} className="space-y-4">
              <div>
                <Input
                  type="email"
                  placeholder="Email"
                  {...registerLogin("email", { 
                    required: "Email is required", 
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address"
                    }
                  })}
                />
                {loginErrors.email && (
                  <p className="text-sm text-red-500 mt-1">{loginErrors.email.message?.toString()}</p>
                )}
              </div>
              
              <div>
                <Input
                  type="password"
                  placeholder="Password"
                  {...registerLogin("password", { required: "Password is required" })}
                />
                {loginErrors.password && (
                  <p className="text-sm text-red-500 mt-1">{loginErrors.password.message?.toString()}</p>
                )}
              </div>
              
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Logging in..." : "Login"}
              </Button>
            </form>
          </TabsContent>
          
          <TabsContent value="register">
            <form onSubmit={handleSubmitSignup(onSignup)} className="space-y-4">
              <div>
                <Input
                  type="email"
                  placeholder="Email"
                  {...registerSignup("email", { 
                    required: "Email is required", 
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address"
                    }
                  })}
                />
                {signupErrors.email && (
                  <p className="text-sm text-red-500 mt-1">{signupErrors.email.message?.toString()}</p>
                )}
              </div>
              
              <div>
                <Input
                  type="password"
                  placeholder="Password"
                  {...registerSignup("password", { required: "Password is required" })}
                />
                {signupErrors.password && (
                  <p className="text-sm text-red-500 mt-1">{signupErrors.password.message?.toString()}</p>
                )}
              </div>
              
              <div>
                <Input
                  type="password"
                  placeholder="Confirm Password"
                  {...registerSignup("confirmPassword", { required: "Please confirm your password" })}
                />
                {signupErrors.confirmPassword && (
                  <p className="text-sm text-red-500 mt-1">{signupErrors.confirmPassword.message?.toString()}</p>
                )}
              </div>
              
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Creating account..." : "Create Account"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-center text-sm text-gray-500">
        Secured with Supabase Authentication
      </CardFooter>
    </Card>
  );
};

export default AuthForm;
