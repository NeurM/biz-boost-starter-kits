
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
      
      {/* Complete and comprehensive removal of Lovable badges */}
      <style dangerouslySetInnerHTML={{ __html: `
        .lovable-badge, 
        [class*="lovable"],
        [id*="lovable"],
        [data-lovable],
        a[href*="lovable"],
        div[class*="lovable"],
        span[class*="lovable"],
        iframe[src*="lovable"],
        .lovable-root,
        #lovable-badge,
        .lovable-attribution,
        [data-powered-by="lovable"],
        #lovable-powered-by,
        .lovable-powered-by,
        .lovable-watermark,
        .lovable-branding {
          display: none !important;
          visibility: hidden !important;
          opacity: 0 !important;
          pointer-events: none !important;
          width: 0 !important;
          height: 0 !important;
          position: absolute !important;
          z-index: -9999 !important;
          transform: scale(0) !important;
        }
      ` }} />
    </div>
  );
}

export default App;
