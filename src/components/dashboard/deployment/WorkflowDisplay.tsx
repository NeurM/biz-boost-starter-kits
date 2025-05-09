
import React from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface WorkflowDisplayProps {
  workflowYaml: string | null;
  showYaml: boolean;
}

const WorkflowDisplay: React.FC<WorkflowDisplayProps> = ({
  workflowYaml,
  showYaml
}) => {
  const { toast } = useToast();
  
  const copyToClipboard = () => {
    if (!workflowYaml) return;
    
    navigator.clipboard.writeText(workflowYaml);
    toast({
      title: "Copied",
      description: "Workflow YAML copied to clipboard"
    });
  };
  
  if (!showYaml || !workflowYaml) {
    return null;
  }
  
  return (
    <div className="mt-4 space-y-2">
      <div className="flex justify-between items-center">
        <Label>GitHub Workflow YAML</Label>
        <Button
          size="sm"
          variant="outline"
          onClick={copyToClipboard}
        >
          Copy
        </Button>
      </div>
      <Textarea
        className="font-mono text-xs h-64"
        value={workflowYaml}
        readOnly
      />
      <div className="space-y-2 text-xs text-muted-foreground">
        <p>
          Save this file as <code className="bg-muted px-1 py-0.5 rounded">.github/workflows/deploy.yml</code> in your repository.
        </p>
        <ol className="list-decimal pl-5 space-y-1">
          <li>Create a new GitHub repository at the URL specified above</li>
          <li>Download the full React code using the "Download Code" panel</li>
          <li>Push the code to your GitHub repository</li>
          <li>Add this workflow file to deploy your site automatically</li>
        </ol>
      </div>
    </div>
  );
};

export default WorkflowDisplay;
