
import React, { useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogHeader, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { generateTenantSlug, validateTenantSlug } from "@/services/tenant/tenantUtils";
import { createTenant } from "@/services/tenant/tenantService";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface CreateTenantDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CreateTenantDialog: React.FC<CreateTenantDialogProps> = ({ open, onOpenChange }) => {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [tenantType, setTenantType] = useState<"agency" | "client">("client");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setName(newName);
    const newSlug = generateTenantSlug(newName);
    setSlug(newSlug);
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSlug(e.target.value);
  };

  const handleTypeChange = (value: string) => {
    if (value === "agency" || value === "client") {
      setTenantType(value);
    }
  };

  const handleCreateTenant = async () => {
    setIsLoading(true);
    try {
      const isValidSlug = await validateTenantSlug(slug);
      if (!isValidSlug) {
        toast({
          title: "Invalid Slug",
          description: "This slug is already taken. Please choose a different one.",
          variant: "destructive",
        });
        return;
      }

      const response = await createTenant({
        name,
        slug,
        domain: undefined,
        tenant_type: tenantType,
      });

      if (response.error) {
        throw response.error;
      }

      toast({
        title: "Tenant Created",
        description: "Your new tenant has been successfully created.",
      });
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create tenant.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Tenant</DialogTitle>
          <DialogDescription>
            Create a new tenant to manage your websites and users.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="name" className="text-right text-sm font-medium leading-none text-gray-800">
              Name
            </label>
            <div className="col-span-3">
              <Input
                id="name"
                value={name}
                onChange={handleNameChange}
                className="col-span-3 h-10"
              />
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="slug" className="text-right text-sm font-medium leading-none text-gray-800">
              Slug
            </label>
            <div className="col-span-3">
              <Input
                id="slug"
                value={slug}
                onChange={handleSlugChange}
                className="col-span-3 h-10"
              />
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label className="text-right text-sm font-medium leading-none text-gray-800">
              Type
            </label>
            <div className="col-span-3 flex flex-col gap-2">
              <RadioGroup value={tenantType} onValueChange={handleTypeChange} className="flex space-x-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="agency" id="agency-type" />
                  <label htmlFor="agency-type" className="text-sm font-medium">Agency</label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="client" id="client-type" />
                  <label htmlFor="client-type" className="text-sm font-medium">Client</label>
                </div>
              </RadioGroup>
              <p className="text-xs text-muted-foreground mt-1">
                <span className="block"><b>Agency:</b> Can manage other clients and perform bulk website actions.</span>
                <span className="block"><b>Client:</b> Standard tenant, managed by an agency.</span>
              </p>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="submit" onClick={handleCreateTenant} disabled={isLoading}>
            {isLoading ? "Creating..." : "Create Tenant"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
