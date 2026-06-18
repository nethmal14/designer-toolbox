import { Link, useLocation } from "wouter";
import { Palette, Sparkles, Layers, Image as ImageIcon, BoxSelect, Type, SquareDashed, Sun, Moon, Zap } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { Button } from "./ui/button";

const navItems = [
  { href: "/", label: "Home", icon: Sparkles },
  { href: "/palettes", label: "Palettes", icon: Palette },
  { href: "/gradients", label: "Gradients", icon: Layers },
  { href: "/frosted-glass", label: "Glass", icon: BoxSelect },
  { href: "/backgrounds", label: "Backgrounds", icon: ImageIcon },
  { href: "/shadows", label: "Shadows", icon: SquareDashed },
  { href: "/typography", label: "Typography", icon: Type },
  { href: "/border-radius", label: "Radius", icon: BoxSelect },
  { href: "/animations", label: "Animations", icon: Zap },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { theme, setTheme } = useTheme();

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 max-w-screen-2xl items-center justify-between px-4 md:px-8">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center space-x-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <span className="font-bold inline-block">DesignerToolbox</span>
            </Link>
            <nav className="hidden md:flex items-center gap-1">
              {navItems.slice(1).map((item) => {
                const isActive = location === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors hover:text-primary ${
                      isActive ? "bg-secondary text-primary" : "text-muted-foreground"
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            >
              <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}
