
import { BrowserRouter, useRoutes } from "react-router-dom";
import AppProviders from "./components/AppProviders";
import { routes } from "./routes";
import TemplatesNavigation from "./components/TemplatesNavigation";
import { useTransition } from "react";

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
    <BrowserRouter>
      <AppProviders>
        <div className="flex flex-col min-h-screen">
          <TemplatesNavigation />
          <main className="flex-1">
            <Router />
          </main>
        </div>
      </AppProviders>
    </BrowserRouter>
  );
}

export default App;
