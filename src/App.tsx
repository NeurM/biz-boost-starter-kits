
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
        <TemplatesNavigation />
        <Router />
      </AppProviders>
    </BrowserRouter>
  );
}

export default App;
