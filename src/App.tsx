
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

const App = () => {
  console.log('App component: Starting render');
  
  try {
    console.log('App component: Setting up providers');
    
    return (
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <LanguageProvider>
            <InternetProvider>
              <AuthProvider>
                <TooltipProvider>
                  <Toaster />
                  <Sonner position="bottom-center" />
                  <div className="min-h-screen">
                    <RouterProvider router={routes} />
                  </div>
                </TooltipProvider>
              </AuthProvider>
            </InternetProvider>
          </LanguageProvider>
        </ThemeProvider>
      </QueryClientProvider>
    );
  } catch (error) {
    console.error('App component: Critical error', error);
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50">
        <div className="text-center p-8">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Application Error</h1>
          <p className="text-gray-600 mb-4">
            {error instanceof Error ? error.message : 'Unknown application error'}
          </p>
          <button 
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            onClick={() => window.location.reload()}
          >
            Reload Application
          </button>
        </div>
      </div>
    );
  }
};

export default App;
