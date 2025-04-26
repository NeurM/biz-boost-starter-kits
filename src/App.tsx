
import { useRoutes } from "react-router-dom";
import { AppProviders } from "./components/AppProviders";
import { routes } from "./routes";
import TemplatesNavigation from "./components/TemplatesNavigation";
import { useTransition } from "react";
import GeminiPersistentChat from "./components/chatbot/GeminiPersistentChat";

// Router component to separate the routes logic
const Router = () => {
  // Using React's useTransition to prevent suspense during route changes
  const [isPending, startTransition] = useTransition();
  
  // Wrap routes in startTransition to prevent UI replacement with loading indicator
  const routeElements = useRoutes(routes);
  
  return (
    <>
      {isPending ? (
        <div className="w-full h-screen flex items-center justify-center">Loading...</div>
      ) : (
        routeElements
      )}
    </>
  );
};

function App() {
  return (
    <AppProviders>
      <div className="flex flex-col min-h-screen">
        <div className="flex justify-between items-center">
          <TemplatesNavigation />
        </div>
        <main className="flex-1">
          <Router />
        </main>
        <GeminiPersistentChat />
      </div>
    </AppProviders>
  );
}

export default App;
