import React from "react";
import { Routes, Route } from "react-router-dom";
import AboutPage from "./components/about/AboutPage";
// Import other components as needed

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/about" element={<AboutPage />} />
      {/* Add other routes as needed */}
      <Route path="*" element={<AboutPage />} />
    </Routes>
  );
};

export default App;
