
import { BrowserRouter, useRoutes } from "react-router-dom";
import AppProviders from "./components/AppProviders";
import { routes } from "./routes";
import TemplatesNavigation from "./components/TemplatesNavigation";

// Router component to separate the routes logic
const Router = () => {
  return useRoutes(routes);
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
