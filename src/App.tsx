
import React, { useTransition } from "react";
import GeminiPersistentChat from "./components/chatbot/GeminiPersistentChat";
import AnalyticsTracker from "./components/AnalyticsTracker";

function App() {
  // Using React's useTransition to prevent suspense during route changes
  const [isPending, startTransition] = useTransition();
  
  return (
    <div className="flex flex-col min-h-screen">
      <AnalyticsTracker>
        <main className="flex-1">
          {/* The router has been moved to main.tsx, so we don't need to include it here */}
          {isPending ? (
            <div className="w-full h-screen flex items-center justify-center">Loading...</div>
          ) : null}
        </main>
        {/* Always render the chat component */}
        <div className="fixed bottom-4 right-4 z-50">
          <GeminiPersistentChat />
        </div>
      </AnalyticsTracker>
    </div>
  );
}

export default App;
