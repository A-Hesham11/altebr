import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { Suspense } from "react"
import ReactDOM from "react-dom/client"
import { HelmetProvider } from "react-helmet-async"
import { ProSidebarProvider } from "react-pro-sidebar"
import { BrowserRouter } from "react-router-dom"
import App from "./App"
import { Loading } from "./components/organisms/Loading"
import { AuthCtxProvider } from "./context/auth-and-perm/auth"
import { NumberFormatterProvider } from "./context/settings/number-formatter"
import "./index.css"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { refetchOnWindowFocus: false },
  },
})
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthCtxProvider>
        <NumberFormatterProvider>
          <HelmetProvider>
            <ProSidebarProvider>
              <Suspense fallback={<Loading mainTitle="جاري التحميل" />}>
                <App />
              </Suspense>
            </ProSidebarProvider>
          </HelmetProvider>
        </NumberFormatterProvider>
      </AuthCtxProvider>
    </BrowserRouter>
  </QueryClientProvider>
)
