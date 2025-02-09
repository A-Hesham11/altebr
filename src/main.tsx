import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Suspense } from "react";
import ReactDOM from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import { ProSidebarProvider } from "react-pro-sidebar";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { Loading } from "./components/organisms/Loading";
import { AuthCtxProvider } from "./context/auth-and-perm/auth";
import { NumberFormatterProvider } from "./context/settings/number-formatter";
import "./index.css";
import { PermissionProvider } from "react-permission-role";
import { GlobalDataProvider } from "./context/settings/GlobalData";

// cloc --by-file --include-lang=JavaScript,TypeScript,jsx,tsx .

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { refetchOnWindowFocus: false },
  },
});

const permissions = [
  { action: "read", resource: "exam" },
  { action: "create", resource: "exam" },
];

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthCtxProvider>
        <NumberFormatterProvider>
          <GlobalDataProvider>
            <HelmetProvider>
              <ProSidebarProvider>
                <Suspense fallback={<Loading mainTitle="جاري التحميل" />}>
                  <PermissionProvider>
                    <App />
                  </PermissionProvider>
                </Suspense>
              </ProSidebarProvider>
            </HelmetProvider>
          </GlobalDataProvider>
        </NumberFormatterProvider>
      </AuthCtxProvider>
    </BrowserRouter>
  </QueryClientProvider>
);
