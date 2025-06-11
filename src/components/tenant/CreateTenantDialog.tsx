
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useTenant } from '@/context/TenantContext';
import { createTenant, generateTenantSlug, validateTenantSlug } from '@/utils/tenantService';

interface CreateTenantDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CreateTenantDialog: React.FC<CreateTenantDialogProps> = ({
  open,
  onOpenChange,
}) => {
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [domain, setDomain] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();
  const { refreshTenants, switchTenant } = useTenant();

  const handleNameChange = (value: string) => {
    setName(value);
    if (value && !slug) {
      setSlug(generateTenantSlug(value));
    }
  };

  const handleCreateTenant = async () => {
    if (!name.trim()) {
      toast({
        title: "Validation Error",
        description: "Tenant name is required.",
        variant: "destructive"
      });
      return;
    }

    if (!slug.trim()) {
      toast({
        title: "Validation Error", 
        description: "Tenant slug is required.",
        variant: "destructive"
      });
      return;
    }

    setIsCreating(true);

    try {
      // Validate slug availability
      const isSlugAvailable = await validateTenantSlug(slug);
      if (!isSlugAvailable) {
        toast({
          title: "Validation Error",
          description: "This slug is already taken. Please choose a different one.",
          variant: "destructive"
        });
        setIsCreating(false);
        return;
      }

      const tenantData = {
        name: name.trim(),
        slug: slug.trim(),
        domain: domain.trim() || undefined
      };

      const response = await createTenant(tenantData);
      
      if (response.error) {
        throw response.error;
      }

      toast({
        title: "Success!",
        description: "Tenant created successfully.",
      });

      // Refresh tenants and switch to the new one
      await refreshTenants();
      if (response.data) {
        switchTenant(response.data.id);
      }

      // Reset form and close dialog
      setName('');
      setSlug('');
      setDomain('');
      onOpenChange(false);
      
    } catch (error) {
      console.error('Error creating tenant:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create tenant.",
        variant: "destructive"
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Tenant</DialogTitle>
          <DialogDescription>
            Create a new tenant to organize your websites and team members.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Tenant Name</Label>
            <Input
              id="name"
              placeholder="My Company"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="slug">Slug (URL identifier)</Label>
            <Input
              id="slug"
              placeholder="my-company"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
            />
            <p className="text-xs text-gray-500">
              This will be used in URLs and must be unique
            </p>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="domain">Custom Domain (optional)</Label>
            <Input
              id="domain"
              placeholder="mycompany.com"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
            />
          </div>
        </div>
        
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreateTenant} disabled={isCreating}>
            {isCreating ? "Creating..." : "Create Tenant"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
