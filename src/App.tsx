import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import HowItWorks from './pages/HowItWorks';

const App: React.FC = () => (
  <BrowserRouter basename={import.meta.env.BASE_URL}>
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/how-it-works" element={<HowItWorks />} />
      {/* Catch all other routes and redirect to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </BrowserRouter>
);

export default App;
