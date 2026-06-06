/**
 * App — Root component with routing
 * Design: Void Terminal — Cyberpunk Glassmorphism
 *
 * Routes:
 *   /                    → Home (public counter display)
 *   /Holaquetalsoypepi5  → Admin (hidden control panel)
 */

import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { DebugConsole } from '@/components/DebugConsole';
import NotFound from '@/pages/NotFound';
import { Route, Switch } from 'wouter';
import ErrorBoundary from './components/ErrorBoundary';
import { ThemeProvider } from './contexts/ThemeContext';
import Admin from './pages/Admin';
import Home from './pages/Home';
function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/Holaquetalsoypepi5" component={Admin} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster
            theme="dark"
            toastOptions={{
              style: {
                background: 'rgba(10, 15, 30, 0.9)',
                border: '1px solid rgba(6,182,212,0.2)',
                color: 'rgba(6,182,212,0.9)',
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '0.75rem',
              },
            }}
          />
          <Router />
          <DebugConsole />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
