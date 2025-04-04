
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/context/ThemeContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { InternetProvider } from "@/context/InternetContext";

import AppRoutes from "./routes";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <LanguageProvider>
        <InternetProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner position="bottom-center" />
            <AppRoutes />
          </TooltipProvider>
        </InternetProvider>
      </LanguageProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
