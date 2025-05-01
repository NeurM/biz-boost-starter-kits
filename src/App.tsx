
import React, { useTransition } from "react";
import GeminiChatAssistant from "./components/GeminiChatAssistant";
import AnalyticsTracker from "./components/AnalyticsTracker";

function App() {
  // Using React's useTransition to prevent suspense during route changes
  const [isPending, startTransition] = useTransition();
  
  return (
    <div className="flex flex-col min-h-screen">
      <AnalyticsTracker>
        <main className="flex-1">
          {isPending ? (
            <div className="w-full h-screen flex items-center justify-center">Loading...</div>
          ) : null}
        </main>
        {/* Render the chat component with proper error boundaries */}
        <div className="fixed bottom-4 right-4 z-40">
          <GeminiChatAssistant />
        </div>
      </AnalyticsTracker>
    </div>
  );
}

export default App;
