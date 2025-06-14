import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { createTenantWebsitesBulk } from "@/utils/tenantService";
import { useTenant } from "@/context/TenantContext";

// Small template card for selector
const TemplateOption = ({ template, selected, onSelect }: { template: any; selected: boolean; onSelect: () => void }) => (
  <button
    type="button"
    className={`flex flex-col items-center justify-center p-2 border rounded-md w-32 h-24 cursor-pointer transition-all ${selected ? "ring-2 ring-primary bg-primary/10" : "border-gray-200 hover:ring-2 hover:ring-primary"}`}
    onClick={onSelect}
    aria-pressed={selected}
  >
    <div className={`w-full h-7 mb-2 rounded ${template.bg}`} />
    <div className={`font-semibold text-xs ${selected ? "text-primary" : "text-gray-700"}`}>{template.name}</div>
    <div className="text-[10px] text-gray-400 text-center">{template.desc}</div>
  </button>
);

interface BulkWebsiteCreatorProps {
  templates: any[]; // pass templates array
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const BulkWebsiteCreator: React.FC<BulkWebsiteCreatorProps> = ({
  templates,
  open,
  onClose,
  onSuccess,
}) => {
  const { toast } = useToast();
  const { currentTenant } = useTenant();

  // Default to first template
  const [selectedTemplateIdx, setSelectedTemplateIdx] = useState(0);
  const selectedTemplate = templates[selectedTemplateIdx];

  const [namesInput, setNamesInput] = useState<string>("");
  const [domainPattern, setDomainPattern] = useState<string>("");
  const [logoUrl, setLogoUrl] = useState<string>("");
  const [primaryColor, setPrimaryColor] = useState(selectedTemplate.primaryColor);
  const [secondaryColor, setSecondaryColor] = useState(selectedTemplate.secondaryColor);

  const [isCreating, setIsCreating] = useState(false);
  const [results, setResults] = useState<any[]>([]);

  // Keep color pickers in sync with template
  React.useEffect(() => {
    setPrimaryColor(selectedTemplate.primaryColor);
    setSecondaryColor(selectedTemplate.secondaryColor);
  }, [selectedTemplateIdx]);

  const handleBulkCreate = async () => {
    if (!currentTenant) {
      toast({ title: "Tenant Required", description: "Select or create a tenant first.", variant: "destructive" });
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

    try {
      const sharedSettings = {
        template_id: selectedTemplate.path,
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

  // Simplified Tailwind palette for color pickers
  const colorOptions = [
    "#ef4444", "#f97316", "#f59e0b", "#eab308", "#84cc16", "#22c55e",
    "#10b981", "#14b8a6", "#06b6d4", "#0ea5e9", "#3b82f6", "#6366f1",
    "#8b5cf6", "#a855f7", "#d946ef", "#ec4899", "#f43f5e", "#64748b",
    "#6b7280", "#374151", "#111827", "#000000"
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <Card className="w-full max-w-xl">
        <CardContent className="pt-6">
          <h2 className="text-xl font-semibold mb-2">Bulk Create Websites</h2>
          <p className="text-sm text-gray-500 mb-4">
            Enter one company name per line. <br />
            <span className="text-gray-700">All settings below will be applied to each site.</span>
          </p>
          <form
            onSubmit={e => {
              e.preventDefault();
              handleBulkCreate();
            }}
            className="space-y-3"
          >
            <div>
              <label className="block text-sm font-semibold mb-2">Select Template</label>
              <div className="flex flex-row gap-3 overflow-x-auto pb-2">
                {templates.map((template, idx) => (
                  <TemplateOption
                    key={template.path}
                    template={template}
                    selected={idx === selectedTemplateIdx}
                    onSelect={() => setSelectedTemplateIdx(idx)}
                  />
                ))}
              </div>
            </div>
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
            <div className="flex gap-2">
              <div>
                <label className="block text-xs font-semibold mb-1">Primary Color</label>
                <div className="flex flex-row flex-wrap gap-1">
                  {colorOptions.map((color) => (
                    <button
                      key={color}
                      type="button"
                      className={`w-5 h-5 rounded-full border-2 transition-colors ${primaryColor === color ? "ring-2 ring-primary border-primary" : "border-gray-200"} `}
                      style={{ backgroundColor: color }}
                      onClick={() => setPrimaryColor(color)}
                    />
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Secondary Color</label>
                <div className="flex flex-row flex-wrap gap-1">
                  {colorOptions.map((color) => (
                    <button
                      key={color}
                      type="button"
                      className={`w-5 h-5 rounded-full border-2 transition-colors ${secondaryColor === color ? "ring-2 ring-primary border-primary" : "border-gray-200"} `}
                      style={{ backgroundColor: color }}
                      onClick={() => setSecondaryColor(color)}
                    />
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-2 justify-end items-center pt-2">
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
