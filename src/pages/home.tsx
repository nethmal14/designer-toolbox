import { motion } from "framer-motion";
import { Link } from "wouter";
import { Palette, Layers, BoxSelect, Image as ImageIcon, SquareDashed, Type, Droplet, ArrowRight, Zap } from "lucide-react";

const tools = [
  { title: "Color Palettes", description: "Generate and save harmonious color schemes.", icon: Palette, href: "/palettes", color: "text-blue-400", bg: "bg-blue-500/10" },
  { title: "Gradients", description: "Linear, radial, conic, animated, and mesh.", icon: Layers, href: "/gradients", color: "text-purple-400", bg: "bg-purple-500/10" },
  { title: "Frosted Glass", description: "Glassmorphism with live CSS output.", icon: BoxSelect, href: "/frosted-glass", color: "text-cyan-400", bg: "bg-cyan-500/10" },
  { title: "Backgrounds", description: "CSS patterns, textures, and WebGL shaders.", icon: ImageIcon, href: "/backgrounds", color: "text-emerald-400", bg: "bg-emerald-500/10" },
  { title: "Box Shadow", description: "Multi-layer shadow builder with presets.", icon: SquareDashed, href: "/shadows", color: "text-orange-400", bg: "bg-orange-500/10" },
  { title: "Type Scale", description: "Typographic scale with 40+ Google Fonts.", icon: Type, href: "/typography", color: "text-rose-400", bg: "bg-rose-500/10" },
  { title: "Border Radius", description: "Corner control and organic blob shapes.", icon: Droplet, href: "/border-radius", color: "text-indigo-400", bg: "bg-indigo-500/10" },
  { title: "CSS Animations", description: "Keyframe builder with easing and presets.", icon: Zap, href: "/animations", color: "text-yellow-400", bg: "bg-yellow-500/10" },
];

export default function Home() {
  return (
    <div className="container mx-auto max-w-screen-xl px-4 md:px-8 py-12 md:py-20">
      <div className="flex flex-col items-center text-center space-y-3 mb-12">
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-6xl font-bold tracking-tight"
        >
          Your precision <span className="text-primary">workbench</span>.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="text-muted-foreground max-w-md"
        >
          A one-stop CSS toolkit for developers and designers.
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.14 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3"
      >
        {tools.map((tool, i) => (
          <Link key={tool.href} href={tool.href}>
            <div
              className="group flex items-center gap-3 px-4 py-3.5 rounded-xl border border-border hover:border-primary/50 bg-card hover:bg-card/80 transition-all cursor-pointer"
              data-testid={`tool-card-${tool.href.replace("/", "")}`}
            >
              <div className={`w-9 h-9 rounded-lg ${tool.bg} flex items-center justify-center shrink-0`}>
                <tool.icon className={`w-4.5 h-4.5 ${tool.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground leading-tight">{tool.title}</p>
                <p className="text-xs text-muted-foreground leading-tight mt-0.5 truncate">{tool.description}</p>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-muted-foreground/40 group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0" />
            </div>
          </Link>
        ))}
      </motion.div>
    </div>
  );
}
