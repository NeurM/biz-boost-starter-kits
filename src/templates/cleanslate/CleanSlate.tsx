
import React from 'react';
import { Button } from "@/components/ui/button";

const CleanSlate = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="text-center max-w-md">
        <h1 className="text-4xl font-bold mb-4">Clean Slate</h1>
        <p className="mb-6">
          This is a minimal template to start building your web application.
        </p>
        <Button>Get Started</Button>
      </div>
    </div>
  );
};

export default CleanSlate;
