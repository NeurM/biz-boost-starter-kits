import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { createTenantWebsitesBulk } from "@/services/tenant/websiteService";
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

  // Updated: Company/email pairs input
  const [pairsInput, setPairsInput] = useState<string>("");
  const [domainPattern, setDomainPattern] = useState<string>("");
  const [logoUrl, setLogoUrl] = useState<string>("");
  const [primaryColor, setPrimaryColor] = useState(selectedTemplate.primaryColor);
  const [secondaryColor, setSecondaryColor] = useState(selectedTemplate.secondaryColor);

  const [isCreating, setIsCreating] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [isSendingPreview, setIsSendingPreview] = useState(false);
  const [emailResults, setEmailResults] = useState<any[]>([]);

  // Keep color pickers in sync with template
  React.useEffect(() => {
    setPrimaryColor(selectedTemplate.primaryColor);
    setSecondaryColor(selectedTemplate.secondaryColor);
  }, [selectedTemplateIdx]);

  // Helper: Parse company-email pairs
  function parsePairs(input: string): { name: string, email: string }[] {
    return input
      .split('\n')
      .map(l => l.trim())
      .filter(Boolean)
      .map(l => {
        const [nameRaw, emailRaw] = l.split('|').map(x => x?.trim());
        return {
          name: nameRaw || "",
          email: (emailRaw && /\S+@\S+\.\S+/.test(emailRaw)) ? emailRaw : "",
        }
      })
      .filter(p => p.name.length > 0 && p.email.length > 0);
  }

  // Email send: one site, one preview per company/email
  const handleSendPreviews = async (websiteResults: any[], pairs: { name: string, email: string }[]) => {
    // Only send for websites that succeeded & have an email
    const previewsToSend = websiteResults
      .filter((r: any) => r.success)
      .map((r: any) => {
        const pair = pairs.find(p => p.name.toLowerCase() === r.companyName.toLowerCase());
        return pair && pair.email
          ? {
              email: pair.email,
              website: {
                name: r.companyName,
                url: r.data?.domain_name || "",
                template: r.data?.template_id || "",
              }
            }
          : null;
      })
      .filter(Boolean) as { email: string, website: any }[];

    if (previewsToSend.length === 0) return;

    setIsSendingPreview(true);
    try {
      // We'll call the edge function for batch send (or one-by-one if needed)
      const functionUrl = `https://jidyjuyniqslfviemrkx.supabase.co/functions/v1/send-website-previews`;
      // Group into { email, websites: [website] }
      const previewsGrouped = previewsToSend.map(p => ({
        emails: [p.email],
        websites: [p.website]
      }));
      // Call edge function for each
      let allEmailResults: any[] = [];
      for (let group of previewsGrouped) {
        const response = await fetch(functionUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(group),
        });
        const resData = await response.json();
        // result: [{email, success, error}]
        if (resData.results) {
          allEmailResults = allEmailResults.concat(resData.results);
        }
        if (resData.error && group.emails[0]) {
          allEmailResults.push({ email: group.emails[0], success: false, error: resData.error });
        }
      }
      setEmailResults(allEmailResults);
      if (allEmailResults.some(r => !r.success)) {
        toast({
          title: "Some Preview Emails Failed",
          description: "Check below for details.",
          variant: "destructive"
        });
      } else {
        toast({ title: "Preview Emails Sent!", description: "Website previews sent to company emails." });
      }
    } catch (err: any) {
      toast({
        title: "Email Error",
        description: err.message || "Failed to send previews.",
        variant: "destructive"
      });
    } finally {
      setIsSendingPreview(false);
    }
  };

  // Bulk create
  const handleBulkCreate = async () => {
    if (!currentTenant) {
      toast({ title: "Tenant Required", description: "Select or create a tenant first.", variant: "destructive" });
      return;
    }
    // Parse company-email pairs
    const pairs = parsePairs(pairsInput);
    if (pairs.length === 0) {
      toast({
        title: "Input Required",
        description: "Enter at least one line like: Acme Inc | alice@acme.com",
        variant: "destructive",
      });
      return;
    }
    const companyNames = pairs.map(p => p.name);
    setIsCreating(true);
    setResults([]);
    setEmailResults([]);
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
      // After creation, send previews only to matching company email
      if (successes > 0) {
        await handleSendPreviews(creationResults, pairs);
      }
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
          <p className="text-sm text-gray-500 mb-2">
            Enter one line per company in the format: <br />
            <span className="text-gray-700 font-mono">Company Name | someone@company.com</span><br />
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
                Companies & Emails
                <span className="text-gray-400">
                  {" "}(one per line: Name | email)
                </span>
              </label>
              <textarea
                className="w-full min-h-[96px] border rounded p-2 text-sm font-mono"
                rows={7}
                value={pairsInput}
                onChange={e => setPairsInput(e.target.value)}
                placeholder={"Acme Inc | alice@acme.com\nBeta LLC | bob@beta.com\nGamma Ltd | gamma@example.com"}
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
                disabled={isCreating || isSendingPreview}
              >Cancel</Button>
              <Button
                type="submit"
                disabled={isCreating || isSendingPreview}
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
            {emailResults.length > 0 && (
              <div className="mt-3 max-h-28 overflow-y-auto">
                <h4 className="font-semibold text-sm mb-1">Email Preview Results:</h4>
                <ul className="space-y-1 text-sm">
                  {emailResults.map((r, i) => (
                    <li key={i} className={r.success ? "text-green-700" : "text-red-600"}>
                      {r.email}: {r.success ? "✓ Sent" : `✗ ${r.error || "Failed"}`}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {isSendingPreview && (
              <div className="text-gray-500 text-xs mt-3">Sending preview emails...</div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
