
import React from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Copy, CheckCircle2, FileCode } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="mt-8"
    >
      <Card className="p-5 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 border border-blue-100 dark:border-blue-900 rounded-lg shadow-md overflow-hidden">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-full bg-blue-100 dark:bg-blue-900/30">
              <FileCode className="h-4 w-4 text-blue-500" />
            </div>
            <Label className="font-medium text-blue-700 dark:text-blue-300 text-base">GitHub Workflow YAML</Label>
          </div>
          
          <HoverCard>
            <HoverCardTrigger asChild>
              <Button
                size="sm"
                variant="outline"
                onClick={copyToClipboard}
                className={`flex items-center space-x-1.5 transition-all duration-300 ${copied ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' : 'hover:border-blue-300'}`}
              >
                <motion.div
                  animate={{ scale: copied ? [1, 1.2, 1] : 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {copied ? (
                    <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                </motion.div>
                <span>{copied ? "Copied!" : "Copy Code"}</span>
              </Button>
            </HoverCardTrigger>
            <HoverCardContent className="w-64 p-2 text-xs">
              Copy the GitHub workflow YAML to your clipboard
            </HoverCardContent>
          </HoverCard>
        </div>
        
        <div className="relative overflow-hidden rounded-md">
          <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-gray-900/10 to-transparent z-10"></div>
          <Textarea
            className="font-mono text-xs h-64 bg-gray-900 text-gray-100 dark:bg-gray-800 shadow-inner resize-none scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent"
            value={workflowYaml}
            readOnly
          />
          <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-gray-900/10 to-transparent z-10"></div>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="mt-5 space-y-3"
        >
          <p className="text-sm font-medium text-muted-foreground mb-2 flex items-center">
            <span className="inline-block w-2 h-2 rounded-full bg-blue-400 mr-2"></span>
            Save this file as <code className="bg-blue-100 dark:bg-blue-900/50 px-1.5 py-0.5 rounded text-blue-800 dark:text-blue-200 font-mono text-xs ml-1">.github/workflows/deploy.yml</code> in your repository.
          </p>
          
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800 rounded-md p-4 backdrop-blur-sm">
            <h4 className="text-sm font-medium text-amber-800 dark:text-amber-200 mb-3 flex items-center">
              <span className="inline-block w-2 h-2 rounded-full bg-amber-500 mr-2"></span>
              Deployment Steps:
            </h4>
            <ol className="list-decimal pl-5 space-y-2 text-sm text-amber-700 dark:text-amber-300">
              <li>Create a new GitHub repository at the URL specified above</li>
              <li>Download the full React code using the "Download Code" panel</li>
              <li>Push the code to your GitHub repository</li>
              <li>Add this workflow file to deploy your site automatically</li>
            </ol>
          </div>
        </motion.div>
      </Card>
    </motion.div>
  );
};

export default WorkflowDisplay;
