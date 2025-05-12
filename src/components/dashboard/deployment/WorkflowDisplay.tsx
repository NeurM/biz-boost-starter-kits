
import React from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Copy, CheckCircle2, FileCode } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";

interface WorkflowDisplayProps {
  workflowYaml: string | null;
  showYaml: boolean;
}

const WorkflowDisplay: React.FC<WorkflowDisplayProps> = ({
  workflowYaml,
  showYaml
}) => {
  const { toast } = useToast();
  const [copied, setCopied] = React.useState(false);
  
  const copyToClipboard = () => {
    if (!workflowYaml) return;
    
    navigator.clipboard.writeText(workflowYaml);
    setCopied(true);
    
    toast({
      title: "Copied",
      description: "Workflow YAML copied to clipboard"
    });
    
    setTimeout(() => setCopied(false), 2000);
  };
  
  if (!showYaml || !workflowYaml) {
    return null;
  }
  
  return (
    <Card className="mt-6 p-4 bg-gray-50 dark:bg-gray-900 border border-blue-100 dark:border-blue-900 rounded-lg">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center space-x-2">
          <FileCode className="h-4 w-4 text-blue-500" />
          <Label className="font-medium text-blue-700 dark:text-blue-300">GitHub Workflow YAML</Label>
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={copyToClipboard}
          className="flex items-center space-x-1"
        >
          {copied ? (
            <>
              <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
              <span>Copied</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              <span>Copy</span>
            </>
          )}
        </Button>
      </div>
      <Textarea
        className="font-mono text-xs h-64 bg-gray-900 text-gray-100 dark:bg-gray-800"
        value={workflowYaml}
        readOnly
      />
      <div className="mt-4 space-y-2">
        <p className="text-sm font-medium text-muted-foreground mb-2">
          Save this file as <code className="bg-blue-100 dark:bg-blue-900/50 px-1.5 py-0.5 rounded text-blue-800 dark:text-blue-200 font-mono text-xs">.github/workflows/deploy.yml</code> in your repository.
        </p>
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800 rounded-md p-3">
          <h4 className="text-sm font-medium text-amber-800 dark:text-amber-200 mb-2">Deployment Steps:</h4>
          <ol className="list-decimal pl-5 space-y-1 text-xs text-amber-700 dark:text-amber-300">
            <li>Create a new GitHub repository at the URL specified above</li>
            <li>Download the full React code using the "Download Code" panel</li>
            <li>Push the code to your GitHub repository</li>
            <li>Add this workflow file to deploy your site automatically</li>
          </ol>
        </div>
      </div>
    </Card>
  );
};

export default WorkflowDisplay;
