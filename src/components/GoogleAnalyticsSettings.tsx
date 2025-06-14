
import React, { useState } from "react";
import { Button } from "@/components/ui/button";

interface GoogleAnalyticsSettingsProps {
  analyticsId?: string;
  onSave?: (id: string) => void;
  disabled?: boolean;
}

const GoogleAnalyticsSettings: React.FC<GoogleAnalyticsSettingsProps> = ({
  analyticsId,
  onSave,
  disabled
}) => {
  const [inputId, setInputId] = useState(analyticsId || "");

  // Validate for GA-XXXXXXXXX or G-XXXXXXXXX
  const isValid = inputId.match(/^GA-\w{8,}|^G-\w{8,}/i);

  return (
    <div className="flex flex-col gap-2 p-4 border rounded-md bg-gray-50">
      <label className="font-medium">Google Analytics Tracking ID</label>
      <input
        type="text"
        value={inputId}
        onChange={e => setInputId(e.target.value)}
        disabled={disabled}
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
          disabled={!isValid || disabled || inputId === analyticsId}
          onClick={() => onSave(inputId)}
        >
          Save
        </Button>
      )}
    </div>
  );
};

export default GoogleAnalyticsSettings;
