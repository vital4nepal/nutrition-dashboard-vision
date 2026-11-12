import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Layout/Navbar";
import Index from "./pages/Index";
import Output from "./pages/Output";
import Impact from "./pages/Impact";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import Chat from "./pages/Chat";
import About from "./pages/About";
import DataImport from "./pages/DataImport";
import TechnicalSpecs from "./pages/TechnicalSpecs";
import N4GDashboard from "./pages/N4GDashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/output" element={<Output />} />
          <Route path="/impact" element={<Impact />} />
          <Route path="/about" element={<About />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/data-import" element={<DataImport />} />
          <Route path="/technical-specs" element={<TechnicalSpecs />} />
          <Route path="/n4g-dashboard" element={<N4GDashboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
