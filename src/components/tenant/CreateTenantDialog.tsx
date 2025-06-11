
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { createTenant, generateTenantSlug, validateTenantSlug } from '@/utils/tenantService';
import { useTenant } from '@/context/TenantContext';

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Tenant name must be at least 2 characters.",
  }).max(50, {
    message: "Tenant name must not exceed 50 characters.",
  }),
  slug: z.string().min(2, {
    message: "Slug must be at least 2 characters.",
  }).max(30, {
    message: "Slug must not exceed 30 characters.",
  }).regex(/^[a-z0-9-]+$/, {
    message: "Slug can only contain lowercase letters, numbers, and hyphens.",
  }),
  domain: z.string().optional(),
});

interface CreateTenantDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CreateTenantDialog: React.FC<CreateTenantDialogProps> = ({
  open,
  onOpenChange,
}) => {
  const { toast } = useToast();
  const { refreshTenants, switchTenant } = useTenant();
  const [isLoading, setIsLoading] = useState(false);
  const [slugValidation, setSlugValidation] = useState<{
    isValid: boolean;
    message: string;
  } | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      slug: "",
      domain: "",
    },
  });

  const watchedName = form.watch("name");
  const watchedSlug = form.watch("slug");

  // Auto-generate slug from name
  React.useEffect(() => {
    if (watchedName && !form.formState.dirtyFields.slug) {
      const generatedSlug = generateTenantSlug(watchedName);
      form.setValue("slug", generatedSlug);
    }
  }, [watchedName, form]);

  // Validate slug availability
  React.useEffect(() => {
    const validateSlug = async () => {
      if (watchedSlug && watchedSlug.length >= 2) {
        try {
          const isValid = await validateTenantSlug(watchedSlug);
          setSlugValidation({
            isValid,
            message: isValid ? "Slug is available" : "Slug is already taken",
          });
        } catch (error) {
          setSlugValidation({
            isValid: false,
            message: "Error validating slug",
          });
        }
      } else {
        setSlugValidation(null);
      }
    };

    const debounceTimer = setTimeout(validateSlug, 500);
    return () => clearTimeout(debounceTimer);
  }, [watchedSlug]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);

    try {
      // Final slug validation
      const isSlugValid = await validateTenantSlug(values.slug);
      if (!isSlugValid) {
        toast({
          title: "Error",
          description: "Slug is already taken. Please choose a different one.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      const response = await createTenant({
        name: values.name,
        slug: values.slug,
        domain: values.domain || undefined,
      });

      if (response.error) {
        throw response.error;
      }

      toast({
        title: "Success",
        description: "Tenant created successfully!",
      });

      // Refresh tenants and switch to the new one
      await refreshTenants();
      if (response.data) {
        switchTenant(response.data.id);
      }

      // Reset form and close dialog
      form.reset();
      onOpenChange(false);

    } catch (error) {
      console.error('Error creating tenant:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create tenant.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Tenant</DialogTitle>
          <DialogDescription>
            Create a new tenant to organize your websites and team members.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tenant Name</FormLabel>
                  <FormControl>
                    <Input placeholder="My Company" {...field} />
                  </FormControl>
                  <FormDescription>
                    The display name for your tenant.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slug</FormLabel>
                  <FormControl>
                    <Input placeholder="my-company" {...field} />
                  </FormControl>
                  <FormDescription>
                    Used in URLs and must be unique. Only lowercase letters, numbers, and hyphens.
                  </FormDescription>
                  {slugValidation && (
                    <p className={`text-sm ${slugValidation.isValid ? 'text-green-600' : 'text-red-600'}`}>
                      {slugValidation.message}
                    </p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="domain"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Custom Domain (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="example.com" {...field} />
                  </FormControl>
                  <FormDescription>
                    Custom domain for your tenant (optional).
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isLoading || (slugValidation && !slugValidation.isValid)}
              >
                {isLoading ? "Creating..." : "Create Tenant"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
