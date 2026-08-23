import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/files" element={<Dashboard />} />
      <Route path="/upload" element={<Dashboard />} />
      <Route path="/nodes" element={<Dashboard />} />
      <Route path="/replication" element={<Dashboard />} />
    </Routes>
  );
}

export default App;