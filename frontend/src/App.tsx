import { Outlet } from "react-router-dom";
import "./App.css";

function App() {
  return (
      <div className="min-h-screen w-full">
        <Outlet />
      </div>
  );
}

export default App;
