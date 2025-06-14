
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { createTenantWebsitesBulk } from "@/utils/tenantService";
import { useTenant } from "@/context/TenantContext";

interface BulkWebsiteCreatorProps {
  template: any;
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void; // callback for parent to refresh
  primaryColor: string;
  secondaryColor: string;
}

export const BulkWebsiteCreator: React.FC<BulkWebsiteCreatorProps> = ({
  template,
  open,
  onClose,
  onSuccess,
  primaryColor,
  secondaryColor,
}) => {
  const { toast } = useToast();
  const { currentTenant } = useTenant();

  const [namesInput, setNamesInput] = useState<string>("");
  const [domainPattern, setDomainPattern] = useState<string>("");
  const [logoUrl, setLogoUrl] = useState<string>("");
  const [isCreating, setIsCreating] = useState(false);
  const [results, setResults] = useState<any[]>([]);

  const handleBulkCreate = async () => {
    if (!currentTenant) {
      toast({
        title: "Tenant Required",
        description: "Select or create a tenant first.",
        variant: "destructive",
      });
      return;
    }
    const companyNames = namesInput
      .split("\n")
      .map((n) => n.trim())
      .filter(Boolean);
    if (companyNames.length === 0) {
      toast({
        title: "Input Required",
        description: "Paste at least one company name.",
        variant: "destructive",
      });
      return;
    }

    setIsCreating(true);
    setResults([]);

    // Create websites in bulk
    try {
      const sharedSettings = {
        template_id: template.path,
        logo: logoUrl.trim() || undefined,
        color_scheme: primaryColor,
        secondary_color_scheme: secondaryColor,
        domainPattern: domainPattern.trim(),
      };
      const creationResults = await createTenantWebsitesBulk({
        tenantId: currentTenant.id,
        companyNames,
        sharedSettings,
      });
      setResults(creationResults);

      const successes = creationResults.filter((r: any) => r.success).length;
      const failures = creationResults.length - successes;
      toast({
        title: `Bulk Completed: ${successes} success, ${failures} failed`,
        description: "See the results below.",
        variant: failures > 0 ? "destructive" : "default"
      });
      if (onSuccess) onSuccess();
    } catch (err: any) {
      toast({
        title: "Bulk Creation Failed",
        description: err.message || "Unexpected error.",
        variant: "destructive"
      });
    } finally {
      setIsCreating(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <Card className="w-full max-w-lg">
        <CardContent className="pt-6">
          <h2 className="text-xl font-semibold mb-2">Bulk Create Websites</h2>
          <p className="text-sm text-gray-500 mb-4">
            Enter one company name per line. Websites will be created for all.
          </p>
          <form
            onSubmit={e => {
              e.preventDefault();
              handleBulkCreate();
            }}
            className="space-y-3"
          >
            <div>
              <label className="text-sm font-semibold mb-1 block">
                Company Names <span className="text-gray-400">(one per line)</span>
              </label>
              <textarea
                className="w-full min-h-[80px] border rounded p-2 text-sm"
                rows={6}
                value={namesInput}
                onChange={e => setNamesInput(e.target.value)}
                placeholder="Acme Inc&#10;BetaCorp LLC&#10;Gamma Ltd"
              />
            </div>
            <div>
              <label className="text-sm font-semibold mb-1 block">
                Domain Pattern <span className="text-gray-400">(optional, e.g. {`{slug}`}.yourdomain.com)</span>
              </label>
              <Input
                value={domainPattern}
                onChange={e => setDomainPattern(e.target.value)}
                placeholder="{slug}.yourdomain.com"
              />
            </div>
            <div>
              <label className="text-sm font-semibold mb-1 block">Logo URL (optional)</label>
              <Input
                value={logoUrl}
                onChange={e => setLogoUrl(e.target.value)}
                placeholder="https://example.com/logo.png"
              />
            </div>
            <div className="flex gap-2 justify-end items-center">
              <Button
                type="button"
                variant="ghost"
                onClick={onClose}
                disabled={isCreating}
              >Cancel</Button>
              <Button
                type="submit"
                disabled={isCreating}
              >{isCreating ? "Creating..." : "Create Websites"}</Button>
            </div>
          </form>
          <div className="mt-4">
            {results.length > 0 && (
              <div className="max-h-48 overflow-y-auto">
                <h4 className="font-semibold text-sm mb-1">Results:</h4>
                <ul className="space-y-1 text-sm">
                  {results.map((r, i) => (
                    <li key={i} className={r.success ? "text-green-700" : "text-red-600"}>
                      {r.companyName}: {r.success ? "✓ Created" : `✗ ${r.error || "Failed"}`}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
