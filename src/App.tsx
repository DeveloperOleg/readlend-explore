
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/context/ThemeContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { InternetProvider } from "@/context/InternetContext";
import { AuthProvider } from "@/context/AuthContext";
import { RouterProvider } from "react-router-dom";
import routes from "./routes";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <LanguageProvider>
        <InternetProvider>
          <AuthProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner position="bottom-center" />
              <RouterProvider router={routes} />
            </TooltipProvider>
          </AuthProvider>
        </InternetProvider>
      </LanguageProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
