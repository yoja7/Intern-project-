import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import { initializeData } from "./utils/localStorage";

// Seed localStorage with default data on first load
initializeData();

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
