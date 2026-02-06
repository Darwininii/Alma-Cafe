import React from "react";
import { HelmetProvider } from "react-helmet-async";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "./Components/shared/ThemeProvider";
import { Loader } from "./Components/shared/Loader";
import { ToastController } from "./Components/shared/ToastController";
import { ThemeListener } from "./Components/shared/ThemeListener";

const queryClient = new QueryClient();
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <ThemeProvider>
          <ThemeListener />
          <RouterProvider router={router} />
          <ToastController />
          <Toaster 
            position="bottom-center"
            toastOptions={{
              className: '!bg-white/80 !dark:bg-zinc-900/80 !backdrop-blur-md !border !border-zinc-200 !dark:border-white/10 !shadow-2xl !rounded-full !text-zinc-800 !dark:text-zinc-100 !font-medium !text-sm',
              duration: 4000,
              style: {
                padding: '10px 20px',
              },
              success: {
                iconTheme: {
                  primary: '#10b981',
                  secondary: 'white',
                },
              },
              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: 'white',
                },
              },
              loading: {
                icon: <Loader size={24} className="flex items-center justify-center p-0.5" />,
              },
            }}
          />
        </ThemeProvider>
      </HelmetProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
