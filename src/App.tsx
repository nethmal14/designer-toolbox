import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Layout } from "@/components/Layout";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Palettes from "@/pages/palettes";
import Gradients from "@/pages/gradients";
import FrostedGlass from "@/pages/frosted-glass";
import Backgrounds from "@/pages/backgrounds";
import Shadows from "@/pages/shadows";
import Typography from "@/pages/typography";
import BorderRadius from "@/pages/border-radius";
import Animations from "@/pages/animations";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/palettes" component={Palettes} />
      <Route path="/gradients" component={Gradients} />
      <Route path="/frosted-glass" component={FrostedGlass} />
      <Route path="/backgrounds" component={Backgrounds} />
      <Route path="/shadows" component={Shadows} />
      <Route path="/typography" component={Typography} />
      <Route path="/border-radius" component={BorderRadius} />
      <Route path="/animations" component={Animations} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="designer-toolbox-theme">
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Layout>
              <Router />
            </Layout>
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
