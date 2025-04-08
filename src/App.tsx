
import { BrowserRouter, useRoutes } from "react-router-dom";
import AppProviders from "./components/AppProviders";
import { routes } from "./routes";

// Router component to separate the routes logic
const Router = () => {
  return useRoutes(routes);
};

function App() {
  return (
    <BrowserRouter>
      <AppProviders>
        <Router />
      </AppProviders>
    </BrowserRouter>
  );
}

export default App;
