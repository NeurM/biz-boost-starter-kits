
// Re-export the toast function from the hooks directory
import { toast } from "@/hooks/use-toast";

// Export enhanced toast functions with default styles
export { toast };

// Add optimized exports
export const successToast = (title: string, description?: string) => {
  return toast({
    title,
    description,
    variant: "default",
  });
};

export const errorToast = (title: string, description?: string) => {
  return toast({
    title,
    description,
    variant: "destructive",
  });
};

export const infoToast = (title: string, description?: string) => {
  return toast({
    title,
    description,
  });
};

// Add a loading toast that can be updated
export const loadingToast = (id: string, title: string, description?: string) => {
  return toast({
    id,
    title,
    description,
    duration: Infinity,
  });
};

// Update a loading toast to success or error
export const updateToast = (id: string, title: string, description?: string, variant: "default" | "destructive" = "default") => {
  return toast({
    id,
    title,
    description,
    variant,
  });
};
