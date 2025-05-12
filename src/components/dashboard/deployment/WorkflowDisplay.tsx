
import React, { useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Copy, CheckCircle2, FileCode } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { motion, useInView, AnimatePresence } from "framer-motion";
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
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  
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
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ 
        duration: 0.7, 
        ease: [0.22, 1, 0.36, 1],
        staggerChildren: 0.1
      }}
      className="mt-8"
    >
      <Card className="p-5 bg-gradient-to-b from-gray-50/90 to-gray-100/90 dark:from-gray-900/90 dark:to-gray-800/90 border border-blue-100 dark:border-blue-900/70 rounded-lg shadow-lg overflow-hidden backdrop-blur-sm border-[0.5px]">
        <motion.div 
          className="flex justify-between items-center mb-3"
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          <div className="flex items-center space-x-2">
            <motion.div 
              className="p-1.5 rounded-full bg-blue-100 dark:bg-blue-900/30"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <FileCode className="h-4 w-4 text-blue-500" />
            </motion.div>
            <Label className="font-medium text-blue-700 dark:text-blue-300 text-base">GitHub Workflow YAML</Label>
          </div>
          
          <HoverCard>
            <HoverCardTrigger asChild>
              <Button
                size="sm"
                variant="outline"
                onClick={copyToClipboard}
                className={`flex items-center space-x-1.5 transition-all duration-500
                  ${copied 
                    ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-600'
                    : 'hover:border-blue-300 hover:bg-blue-50/50 dark:hover:bg-blue-900/20'
                  }`}
              >
                <motion.div
                  animate={{ 
                    scale: copied ? [1, 1.3, 1] : 1,
                    rotate: copied ? [0, -5, 5, 0] : 0
                  }}
                  transition={{ duration: 0.4 }}
                >
                  {copied ? (
                    <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                </motion.div>
                <AnimatePresence mode="wait">
                  <motion.span
                    key={copied ? 'copied' : 'copy'}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.2 }}
                  >
                    {copied ? "Copied!" : "Copy Code"}
                  </motion.span>
                </AnimatePresence>
              </Button>
            </HoverCardTrigger>
            <HoverCardContent className="w-64 p-2 text-xs backdrop-blur-md bg-white/90 dark:bg-gray-900/90 shadow-xl">
              Copy the GitHub workflow YAML to your clipboard
            </HoverCardContent>
          </HoverCard>
        </motion.div>
        
        <motion.div 
          className="relative overflow-hidden rounded-md"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-gray-900/10 to-transparent z-10"></div>
          <Textarea
            className="font-mono text-xs h-64 bg-gray-900 text-gray-100 dark:bg-gray-800/90 shadow-inner resize-none scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent border-[0.5px] border-gray-700/30"
            value={workflowYaml}
            readOnly
          />
          <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-gray-900/10 to-transparent z-10"></div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mt-5 space-y-3"
        >
          <motion.p 
            className="text-sm font-medium text-muted-foreground mb-2 flex items-center"
            whileHover={{ x: 5 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
          >
            <span className="inline-block w-2 h-2 rounded-full bg-blue-400 mr-2"></span>
            Save this file as <code className="bg-blue-100 dark:bg-blue-900/50 px-1.5 py-0.5 rounded text-blue-800 dark:text-blue-200 font-mono text-xs ml-1">.github/workflows/deploy.yml</code> in your repository.
          </motion.p>
          
          <motion.div 
            className="bg-amber-50/70 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800/50 rounded-md p-4 backdrop-blur-sm"
            whileHover={{ 
              boxShadow: "0 5px 15px rgba(254, 215, 170, 0.2)",
              y: -2
            }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
          >
            <h4 className="text-sm font-medium text-amber-800 dark:text-amber-200 mb-3 flex items-center">
              <span className="inline-block w-2 h-2 rounded-full bg-amber-500 mr-2"></span>
              Deployment Steps:
            </h4>
            <ol className="list-decimal pl-5 space-y-2 text-sm text-amber-700 dark:text-amber-300">
              {[
                "Create a new GitHub repository at the URL specified above",
                "Download the full React code using the \"Download Code\" panel",
                "Push the code to your GitHub repository",
                "Add this workflow file to deploy your site automatically"
              ].map((step, i) => (
                <motion.li 
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
                  transition={{ delay: 0.4 + (i * 0.1), duration: 0.3 }}
                  whileHover={{ x: 2 }}
                >
                  {step}
                </motion.li>
              ))}
            </ol>
          </motion.div>
        </motion.div>
      </Card>
    </motion.div>
  );
};

export default WorkflowDisplay;
