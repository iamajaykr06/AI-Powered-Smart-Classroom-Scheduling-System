import { ThemeProvider } from "./components/ThemeProvider"
import { Toaster } from "./components/ui/toaster"
import ErrorBoundary from "./components/ErrorBoundary"
import { Outlet } from "react-router-dom"


function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <div className="min-h-screen bg-background text-foreground">
          <Outlet />
          <Toaster />
        </div>
      </ThemeProvider>
    </ErrorBoundary>
  )
}

export default App
