
import React, { useState } from "react";
import { Button } from "@/components/ui/button";

interface GoogleAnalyticsSettingsProps {
  analyticsId?: string;
  onSave?: (id: string) => Promise<void> | void;
  disabled?: boolean;
  resolved?: {
    gaId?: string;
    sourceTenantName?: string;
    isInherited?: boolean;
  }
}

const GoogleAnalyticsSettings: React.FC<GoogleAnalyticsSettingsProps> = ({
  analyticsId,
  onSave,
  disabled,
  resolved
}) => {
  const [inputId, setInputId] = useState(analyticsId || "");
  const [saving, setSaving] = useState(false);

  // Validate for GA-XXXXXXXXX or G-XXXXXXXXX
  const isValid = inputId.match(/^GA-\w{8,}|^G-\w{8,}/i);

  const handleSave = async () => {
    setSaving(true);
    try {
      if (onSave) await onSave(inputId);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-2 p-4 border rounded-md bg-gray-50">
      <label className="font-medium">Google Analytics Tracking ID</label>
      <input
        type="text"
        value={inputId}
        onChange={e => setInputId(e.target.value)}
        disabled={disabled || saving}
        placeholder="e.g. G-XXXXXXXXX"
        className="border rounded px-2 py-1"
      />
      {analyticsId && (
        <div className="text-xs text-green-700">Current: <span className="font-mono">{analyticsId}</span></div>
      )}
      {!isValid && !!inputId && (
        <div className="text-xs text-red-600">Please enter a valid GA Tracking ID (e.g. G-XXXXXXXXX).</div>
      )}
      {onSave && (
        <Button
          type="button"
          disabled={!isValid || disabled || inputId === analyticsId || saving}
          onClick={handleSave}
        >
          {saving ? "Saving..." : "Save"}
        </Button>
      )}

      {/* Show GA ID resolution/inheritance info */}
      {resolved?.gaId && resolved.isInherited && (
        <div className="text-xs text-blue-700 mt-2">
          Inherited from agency: <span className="font-bold">{resolved.sourceTenantName}</span> ({resolved.gaId})
        </div>
      )}
      {resolved?.gaId && !resolved.isInherited && (
        <div className="text-xs text-stone-700 mt-2">
          This tenant is using its own tracking ID.
        </div>
      )}
      {!resolved?.gaId && (
        <div className="text-xs text-orange-600 mt-2">
          No Tracking ID is currently configured or inherited for this tenant.
        </div>
      )}
    </div>
  );
};

export default GoogleAnalyticsSettings;
