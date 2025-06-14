import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { signIn, signUp, getCurrentUser } from "@/utils/supabase";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

const checkAgencyExists = async (agencyName: string) => {
  // Slugify for uniqueness
  const slug = agencyName.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").trim();
  const { data, error } = await supabase
    .from("tenants")
    .select("*")
    .eq("slug", slug)
    .eq("tenant_type", "agency")
    .maybeSingle();
  if (error) return { exists: false, error };
  if (data) return { exists: true, slug, tenant: data };
  return { exists: false, slug, tenant: null };
};

const createAgencyTenant = async (agencyName: string) => {
  const slug = agencyName.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").trim();
  const { data, error } = await supabase
    .from('tenants')
    .insert({
      name: agencyName,
      slug: slug,
      tenant_type: 'agency'
    })
    .select()
    .single();
  return { data, error, slug };
};

const addUserToTenant = async ({
  tenant_id,
  user_id,
  role,
}: {
  tenant_id: string;
  user_id: string;
  role: Database["public"]["Enums"]["tenant_role"];
}) => {
  const { data, error } = await supabase
    .from('tenant_users')
    .insert({
      tenant_id,
      user_id,
      role, // this is now the enum-typed value
      joined_at: new Date().toISOString(),
    } as Database["public"]["Tables"]["tenant_users"]["Insert"])
    .select()
    .single();
  return { data, error };
};

const AuthPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const [loginForm, setLoginForm] = useState({
    email: '',
    password: ''
  });

  // Registration form with agency options
  const [registerForm, setRegisterForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    agencyChoice: 'create', // 'create' or 'join'
    agencyName: ''
  });
  const [agencyCheckResult, setAgencyCheckResult] = useState<{ exists?: boolean; error?: any; tenant?: any } | null>(null);
  const [agencyChecking, setAgencyChecking] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      const { data } = await getCurrentUser();
      if (data.user) {
        navigate('/');
      }
    };
    checkAuth();
  }, [navigate]);

  // Agency existence checker on agencyName change
  useEffect(() => {
    if (!registerForm.agencyName) {
      setAgencyCheckResult(null);
      return;
    }
    let timer = setTimeout(async () => {
      setAgencyChecking(true);
      const r = await checkAgencyExists(registerForm.agencyName);
      setAgencyCheckResult(r);
      setAgencyChecking(false);
    }, 700);
    return () => clearTimeout(timer);
    // eslint-disable-next-line
  }, [registerForm.agencyName]);

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
        navigate('/');
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

    // Validate agency name
    if (!registerForm.agencyName.trim()) {
      toast({
        title: "Missing Agency Name",
        description: "Please provide an agency name.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      // 1. Sign up user
      const { data: signUpData, error: signUpError } = await signUp(registerForm.email, registerForm.password);
      if (signUpError) throw signUpError;

      // If new user created and needs to confirm email
      if (!signUpData?.user?.id) {
        toast({
          title: "Registration Successful",
          description: "Check your email for a confirmation link to complete your registration."
        });
        setIsLoading(false);
        return;
      }

      let tenantId: string | undefined;

      if (registerForm.agencyChoice === "create") {
        let agencyTenantId: string | undefined;
        if (agencyCheckResult?.exists && agencyCheckResult?.tenant) {
          agencyTenantId = agencyCheckResult.tenant.id;
          toast({
            title: "Agency Already Exists – Joining as Owner",
            description: "This agency already exists. You will be added as an owner."
          });
        } else {
          const { data: newTenant, error: createError } = await createAgencyTenant(registerForm.agencyName);
          if (createError) throw createError;
          agencyTenantId = newTenant.id;
          toast({
            title: "Agency Created",
            description: `New agency '${registerForm.agencyName}' created.`
          });
        }
        tenantId = agencyTenantId;
      } else {
        // 2b. Join existing agency
        if (!agencyCheckResult?.exists || !agencyCheckResult?.tenant) {
          toast({
            title: "Agency Not Found",
            description: "An agency with that name was not found. Please try another or create a new one.",
            variant: "destructive"
          });
          setIsLoading(false);
          return;
        }
        tenantId = agencyCheckResult.tenant.id;
      }

      // 3. Add user to tenant_users as owner
      if (tenantId) {
        const addRes = await addUserToTenant({
          tenant_id: tenantId,
          user_id: signUpData.user.id,
          role: "owner" as Database["public"]["Enums"]["tenant_role"],
        });
        if (addRes.error) {
          toast({
            title: "Could not assign agency ownership",
            description: addRes.error.message || "Try to contact support.",
            variant: "destructive",
          });
        }
      }

      toast({
        title: "Registration Successful!",
        description: !signUpData.session && signUpData.user
          ? "Check your email for a confirmation link to complete your registration."
          : "Welcome! You are now an agency owner."
      });

      if (signUpData.session) {
        navigate('/');
      }
    } catch (error: any) {
      console.error("Registration error:", error);
      toast({
        title: "Registration Failed",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">Welcome</CardTitle>
          <CardDescription>Sign in or create an account to save your website configurations</CardDescription>
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
                    onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password">Password</Label>
                  <Input
                    id="login-password"
                    type="password"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
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
                    onChange={(e) =>
                      setRegisterForm((f) => ({ ...f, email: e.target.value }))
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-password">Password</Label>
                  <Input
                    id="register-password"
                    type="password"
                    value={registerForm.password}
                    onChange={(e) =>
                      setRegisterForm((f) => ({ ...f, password: e.target.value }))
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-confirm-password">Confirm Password</Label>
                  <Input
                    id="register-confirm-password"
                    type="password"
                    value={registerForm.confirmPassword}
                    onChange={(e) =>
                      setRegisterForm((f) => ({
                        ...f,
                        confirmPassword: e.target.value,
                      }))
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Agency</Label>
                  <div className="flex gap-3 mb-1">
                    <label className="flex items-center gap-1 cursor-pointer">
                      <input
                        type="radio"
                        name="agencyChoice"
                        value="create"
                        checked={registerForm.agencyChoice === "create"}
                        onChange={() =>
                          setRegisterForm((f) => ({ ...f, agencyChoice: "create" }))
                        }
                      />
                      <span>Create New Agency</span>
                    </label>
                    <label className="flex items-center gap-1 cursor-pointer">
                      <input
                        type="radio"
                        name="agencyChoice"
                        value="join"
                        checked={registerForm.agencyChoice === "join"}
                        onChange={() =>
                          setRegisterForm((f) => ({ ...f, agencyChoice: "join" }))
                        }
                      />
                      <span>Join Existing Agency</span>
                    </label>
                  </div>
                  <Input
                    id="agency-name"
                    type="text"
                    placeholder="Agency Name"
                    value={registerForm.agencyName}
                    autoComplete="off"
                    onChange={(e) =>
                      setRegisterForm((f) => ({
                        ...f,
                        agencyName: e.target.value,
                      }))
                    }
                    required
                    className={registerForm.agencyChoice === "create"
                      ? "border-green-500"
                      : "border-blue-500"}
                  />
                  {agencyChecking && (
                    <span className="text-xs text-gray-500">Checking agency availability...</span>
                  )}
                  {registerForm.agencyChoice === "create" && agencyCheckResult && agencyCheckResult.exists && (
                    <span className="text-xs text-yellow-600">
                      This agency already exists. You'll join as owner.
                    </span>
                  )}
                  {registerForm.agencyChoice === "create" && agencyCheckResult && !agencyCheckResult.exists && (
                    <span className="text-xs text-green-600">
                      Agency name available.
                    </span>
                  )}
                  {registerForm.agencyChoice === "join" && agencyCheckResult && !agencyCheckResult.exists && (
                    <span className="text-xs text-red-600">
                      No agency found with that name!
                    </span>
                  )}
                  {registerForm.agencyChoice === "join" && agencyCheckResult && agencyCheckResult.exists && (
                    <span className="text-xs text-blue-600">
                      Agency found. You will be added as an owner.
                    </span>
                  )}
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Creating account..." : "Create Account"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <div className="mt-6 text-center">
            <Button variant="outline" onClick={() => navigate('/')} className="w-full">
              Back to Templates
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthPage;
