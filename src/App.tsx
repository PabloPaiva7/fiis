import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Lazy loading para melhor performance
const GlobalAssets = lazy(() => import("./pages/GlobalAssets"));
const Index = lazy(() => import("./pages/Index"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Suspense 
          fallback={
            <div className="min-h-screen bg-gradient-bg flex items-center justify-center">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
            </div>
          }
        >
          <Routes>
            {/* Redirecionar para a nova página global */}
            <Route path="/" element={<Navigate to="/global" replace />} />
            
            {/* Nova página principal com todos os ativos */}
            <Route path="/global" element={<GlobalAssets />} />
            
            {/* Manter página legacy para compatibilidade */}
            <Route path="/legacy" element={<Index />} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
