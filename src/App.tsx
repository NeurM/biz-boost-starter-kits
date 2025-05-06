
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
      
      {/* Comprehensive removal of Lovable badges */}
      <style dangerouslySetInnerHTML={{ __html: `
        /* Hide all Lovable branding elements */
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
        .lovable-branding,
        div[role="complementary"][class*="lg:block"],
        div[style*="z-index: 100"][class*="fixed"][class*="bottom-"],
        /* Target any fixed positioned elements in bottom corners */
        div[class*="fixed"][class*="bottom-0"][class*="right-0"],
        div[class*="fixed"][class*="bottom-0"][class*="left-0"],
        div[class*="fixed"][class*="bottom-1"][class*="right-1"],
        div[class*="fixed"][class*="bottom-1"][class*="left-1"],
        div[class*="fixed"][class*="bottom-2"][class*="right-2"],
        div[class*="fixed"][class*="bottom-2"][class*="left-2"],
        div[class*="fixed"][class*="bottom-3"][class*="right-3"],
        div[class*="fixed"][class*="bottom-3"][class*="left-3"],
        div[class*="fixed"][class*="bottom-4"][class*="right-4"]:not(:has(> div > button)),
        div[class*="fixed"][class*="bottom-4"][class*="left-4"],
        a[title*="lovable"],
        a[title*="Lovable"],
        a[title*="LOVABLE"] {
          display: none !important;
          visibility: hidden !important;
          opacity: 0 !important;
          pointer-events: none !important;
          width: 0 !important;
          height: 0 !important;
          position: absolute !important;
          z-index: -9999 !important;
          transform: scale(0) !important;
          max-width: 0 !important;
          max-height: 0 !important;
          overflow: hidden !important;
          border: none !important;
          background: none !important;
        }
      ` }} />
    </div>
  );
}

export default App;
