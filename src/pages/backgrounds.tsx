import { useState } from "react";
import { Copy, Check, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { ShaderCanvas, SHADER_PRESETS } from "@/components/ShaderCanvas";

type BgType =
  | "solid" | "linear" | "radial" | "dots" | "grid"
  | "diagonal" | "zigzag" | "hexagon" | "noise" | "bokeh"
  | "starfield" | "shader";

interface Config {
  color1: string;
  color2: string;
  angle: number;
  size: number;
  density: number;
  opacity: number;
  shaderIndex: number;
}

const DEFAULT_CFG: Config = { color1: "#0a0a0a", color2: "#6366f1", angle: 135, size: 40, density: 2, opacity: 0.4, shaderIndex: 0 };

const PRESETS: { name: string; type: BgType; cfg: Partial<Config>; category: string }[] = [
  { name: "Midnight Grid", type: "grid", cfg: { color1: "#0a0a0a", color2: "#6366f1", size: 40 }, category: "Grid" },
  { name: "Blueprint", type: "grid", cfg: { color1: "#0d1b2a", color2: "#1e3a5f", size: 30 }, category: "Grid" },
  { name: "Paper Grid", type: "grid", cfg: { color1: "#fafafa", color2: "#e5e7eb", size: 20 }, category: "Grid" },
  { name: "Dark Grid", type: "grid", cfg: { color1: "#0a0a0a", color2: "#222222", size: 24 }, category: "Grid" },
  { name: "Neon Dots", type: "dots", cfg: { color1: "#0a0a0a", color2: "#ec4899", size: 24, density: 2 }, category: "Dots" },
  { name: "Warm Dots", type: "dots", cfg: { color1: "#fefce8", color2: "#f59e0b", size: 16, density: 3 }, category: "Dots" },
  { name: "Indigo Dots", type: "dots", cfg: { color1: "#0a0a0a", color2: "#6366f1", size: 20, density: 2 }, category: "Dots" },
  { name: "Confetti", type: "dots", cfg: { color1: "#f0fdf4", color2: "#22c55e", size: 12, density: 2 }, category: "Dots" },
  { name: "Aurora Gradient", type: "linear", cfg: { color1: "#43e97b", color2: "#38f9d7", angle: 135 }, category: "Gradient" },
  { name: "Sunset", type: "linear", cfg: { color1: "#f83600", color2: "#f9d423", angle: 160 }, category: "Gradient" },
  { name: "Electric", type: "linear", cfg: { color1: "#6366f1", color2: "#06b6d4", angle: 45 }, category: "Gradient" },
  { name: "Rose Gold", type: "linear", cfg: { color1: "#f8b4b4", color2: "#c2185b", angle: 135 }, category: "Gradient" },
  { name: "Deep Space", type: "radial", cfg: { color1: "#0f2027", color2: "#2c5364" }, category: "Radial" },
  { name: "Rose Radial", type: "radial", cfg: { color1: "#f8b4b4", color2: "#8b1a4a" }, category: "Radial" },
  { name: "Violet Core", type: "radial", cfg: { color1: "#6d28d9", color2: "#0a0a0a" }, category: "Radial" },
  { name: "Lime Burst", type: "radial", cfg: { color1: "#84cc16", color2: "#1a2e05" }, category: "Radial" },
  { name: "Diagonal Stripe", type: "diagonal", cfg: { color1: "#18181b", color2: "#6366f1", size: 20 }, category: "Pattern" },
  { name: "Zigzag", type: "zigzag", cfg: { color1: "#fdf4ff", color2: "#d946ef", size: 20 }, category: "Pattern" },
  { name: "Hex Pattern", type: "hexagon", cfg: { color1: "#18181b", color2: "#3f3f46", size: 40 }, category: "Pattern" },
  { name: "Star Night", type: "starfield", cfg: { color1: "#050510", color2: "#ffffff" }, category: "Texture" },
  { name: "Bokeh Lights", type: "bokeh", cfg: { color1: "#0a0020", color2: "#7c3aed" }, category: "Texture" },
  { name: "Noise Overlay", type: "noise", cfg: { color1: "#111827", color2: "#374151", opacity: 0.4 }, category: "Texture" },
  { name: "Plasma Shader", type: "shader", cfg: { shaderIndex: 0 }, category: "WebGL" },
  { name: "Aurora Shader", type: "shader", cfg: { shaderIndex: 1 }, category: "WebGL" },
  { name: "Ocean Shader", type: "shader", cfg: { shaderIndex: 2 }, category: "WebGL" },
  { name: "Voronoi Shader", type: "shader", cfg: { shaderIndex: 3 }, category: "WebGL" },
  { name: "Lava Lamp", type: "shader", cfg: { shaderIndex: 4 }, category: "WebGL" },
  { name: "Electric Shader", type: "shader", cfg: { shaderIndex: 5 }, category: "WebGL" },
  { name: "Matrix", type: "shader", cfg: { shaderIndex: 6 }, category: "WebGL" },
  { name: "Nebula", type: "shader", cfg: { shaderIndex: 7 }, category: "WebGL" },
];

const CATEGORIES = ["All", ...Array.from(new Set(PRESETS.map(p => p.category)))];

function generateCSS(type: BgType, cfg: Config): string {
  const { color1, color2, angle, size, density, opacity, shaderIndex } = cfg;
  switch (type) {
    case "solid": return `background-color: ${color1};`;
    case "linear": return `background: linear-gradient(${angle}deg, ${color1}, ${color2});`;
    case "radial": return `background: radial-gradient(circle at center, ${color1}, ${color2});`;
    case "dots": return `background-color: ${color1};\nbackground-image: radial-gradient(${color2} ${density}px, transparent ${density}px);\nbackground-size: ${size}px ${size}px;`;
    case "grid": return `background-color: ${color1};\nbackground-image: linear-gradient(${color2} 1px, transparent 1px), linear-gradient(to right, ${color2} 1px, transparent 1px);\nbackground-size: ${size}px ${size}px;`;
    case "diagonal": return `background-color: ${color1};\nbackground-image: repeating-linear-gradient(45deg, ${color2}, ${color2} 1px, transparent 0, transparent 50%);\nbackground-size: ${size}px ${size}px;`;
    case "zigzag": return `background-color: ${color1};\nbackground-image: linear-gradient(135deg, ${color2} 25%, transparent 25%) -${size / 2}px 0, linear-gradient(225deg, ${color2} 25%, transparent 25%) -${size / 2}px 0, linear-gradient(315deg, ${color2} 25%, transparent 25%), linear-gradient(45deg, ${color2} 25%, transparent 25%);\nbackground-size: ${size}px ${size}px;`;
    case "hexagon": return `background-color: ${color1};\nbackground-image: radial-gradient(circle farthest-side at 0% 50%, ${color1} 23.5%, rgba(240,166,17,0) 0)21px 30px, radial-gradient(circle farthest-side at 0% 50%, ${color2} 24%, rgba(240,166,17,0) 0)19px 30px;\nbackground-size: ${size}px ${size * 1.5}px;`;
    case "noise": return `background-color: ${color1};\nbackground-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='${opacity}'/%3E%3C/svg%3E");\nbackground-repeat: repeat;\nbackground-size: 200px 200px;`;
    case "bokeh": return `background: ${color1};\nbackground-image:\n  radial-gradient(circle at 20% 30%, ${color2}40 0%, transparent 30%),\n  radial-gradient(circle at 80% 10%, ${color2}30 0%, transparent 25%),\n  radial-gradient(circle at 50% 80%, ${color2}50 0%, transparent 35%),\n  radial-gradient(circle at 70% 60%, ${color2}20 0%, transparent 20%);`;
    case "starfield": return `background: ${color1};\nbackground-image:\n  radial-gradient(1px 1px at 10% 15%, ${color2} 0%, transparent 100%),\n  radial-gradient(1px 1px at 40% 60%, ${color2} 0%, transparent 100%),\n  radial-gradient(2px 2px at 70% 25%, ${color2} 0%, transparent 100%),\n  radial-gradient(1px 1px at 85% 75%, ${color2} 0%, transparent 100%);`;
    case "shader": return `/* WebGL Shader: ${SHADER_PRESETS[shaderIndex]?.name ?? "Custom"} */\n/* Copy the GLSL fragment shader from the source and render it with WebGL or Three.js */`;
    default: return `background: ${color1};`;
  }
}

function generatePreviewStyle(type: BgType, cfg: Config): React.CSSProperties {
  const { color1, color2, angle, size, density } = cfg;
  switch (type) {
    case "solid": return { backgroundColor: color1 };
    case "linear": return { background: `linear-gradient(${angle}deg, ${color1}, ${color2})` };
    case "radial": return { background: `radial-gradient(circle at center, ${color1}, ${color2})` };
    case "dots": return { backgroundColor: color1, backgroundImage: `radial-gradient(${color2} ${density}px, transparent ${density}px)`, backgroundSize: `${size}px ${size}px` };
    case "grid": return { backgroundColor: color1, backgroundImage: `linear-gradient(${color2} 1px, transparent 1px), linear-gradient(to right, ${color2} 1px, transparent 1px)`, backgroundSize: `${size}px ${size}px` };
    case "diagonal": return { backgroundColor: color1, backgroundImage: `repeating-linear-gradient(45deg, ${color2}, ${color2} 1px, transparent 0, transparent 50%)`, backgroundSize: `${size}px ${size}px` };
    case "zigzag": return { backgroundColor: color1, backgroundImage: `linear-gradient(135deg, ${color2} 25%, transparent 25%) -${size / 2}px 0, linear-gradient(225deg, ${color2} 25%, transparent 25%) -${size / 2}px 0, linear-gradient(315deg, ${color2} 25%, transparent 25%), linear-gradient(45deg, ${color2} 25%, transparent 25%)`, backgroundSize: `${size}px ${size}px` };
    case "hexagon": return { backgroundColor: color1, backgroundImage: `radial-gradient(circle farthest-side at 0% 50%, ${color1} 23.5%, rgba(240,166,17,0) 0) ${size * 0.525}px ${size * 0.75}px, radial-gradient(circle farthest-side at 0% 50%, ${color2} 24%, rgba(240,166,17,0) 0) ${size * 0.475}px ${size * 0.75}px`, backgroundSize: `${size}px ${size * 1.5}px` };
    case "bokeh": return { background: color1, backgroundImage: `radial-gradient(circle at 20% 30%, ${color2}60 0%, transparent 30%), radial-gradient(circle at 80% 10%, ${color2}40 0%, transparent 25%), radial-gradient(circle at 50% 80%, ${color2}70 0%, transparent 35%), radial-gradient(circle at 70% 60%, ${color2}30 0%, transparent 20%)` };
    case "starfield": return { background: color1, backgroundImage: `radial-gradient(1px 1px at 10% 15%, ${color2} 0%, transparent 100%), radial-gradient(1px 1px at 40% 60%, ${color2} 0%, transparent 100%), radial-gradient(2px 2px at 70% 25%, ${color2} 0%, transparent 100%), radial-gradient(1px 1px at 85% 75%, ${color2} 0%, transparent 100%)` };
    case "noise": return { backgroundColor: color1 };
    case "shader": return { backgroundColor: "#050505" };
    default: return { backgroundColor: color1 };
  }
}

const TYPE_OPTIONS: { label: string; value: BgType }[] = [
  { label: "Solid Color", value: "solid" },
  { label: "Linear Gradient", value: "linear" },
  { label: "Radial Gradient", value: "radial" },
  { label: "Dots", value: "dots" },
  { label: "Grid", value: "grid" },
  { label: "Diagonal Stripes", value: "diagonal" },
  { label: "Zigzag", value: "zigzag" },
  { label: "Hexagonal", value: "hexagon" },
  { label: "Noise / Grain", value: "noise" },
  { label: "Bokeh", value: "bokeh" },
  { label: "Starfield", value: "starfield" },
  { label: "WebGL Shader", value: "shader" },
];

export default function Backgrounds() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("generator");
  const [filterCat, setFilterCat] = useState("All");
  const [type, setType] = useState<BgType>("grid");
  const [cfg, setCfg] = useState<Config>(DEFAULT_CFG);
  const [copied, setCopied] = useState(false);

  const update = (patch: Partial<Config>) => setCfg(prev => ({ ...prev, ...patch }));
  const cssOutput = generateCSS(type, cfg);
  const previewStyle = generatePreviewStyle(type, cfg);
  const isShader = type === "shader";

  const copy = () => {
    navigator.clipboard.writeText(cssOutput);
    setCopied(true);
    toast({ title: "Copied!", description: "Background CSS copied to clipboard." });
    setTimeout(() => setCopied(false), 2000);
  };

  const applyPreset = (p: typeof PRESETS[0]) => {
    setType(p.type);
    setCfg(prev => ({ ...DEFAULT_CFG, ...prev, ...p.cfg }));
    setActiveTab("generator");
  };

  const needsAngle = type === "linear";
  const needsSize = ["dots", "grid", "diagonal", "zigzag", "hexagon"].includes(type);
  const needsDensity = type === "dots";
  const needsOpacity = type === "noise";
  const needsColors = !["shader"].includes(type);

  const filtered = filterCat === "All" ? PRESETS : PRESETS.filter(p => p.category === filterCat);
  const fullCfg = (p: typeof PRESETS[0]) => ({ ...DEFAULT_CFG, ...p.cfg });

  return (
    <div className="container mx-auto max-w-screen-xl px-4 md:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Background Generator</h1>
        <p className="text-muted-foreground">CSS patterns, gradients, textures, and live WebGL shaders.</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-8">
          <TabsTrigger value="generator">Generator</TabsTrigger>
          <TabsTrigger value="presets">Presets ({PRESETS.length})</TabsTrigger>
          <TabsTrigger value="shaders">WebGL Shaders</TabsTrigger>
        </TabsList>

        <TabsContent value="generator">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="h-[480px] rounded-2xl border border-border overflow-hidden relative">
              {isShader ? (
                <ShaderCanvas
                  fragment={SHADER_PRESETS[cfg.shaderIndex]?.fragment ?? SHADER_PRESETS[0].fragment}
                  className="w-full h-full"
                />
              ) : (
                <div className="w-full h-full transition-all duration-300" style={previewStyle} />
              )}
            </div>

            <div className="space-y-5">
              <Card>
                <CardContent className="p-6 space-y-5">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Background Type</label>
                    <Select value={type} onValueChange={v => setType(v as BgType)}>
                      <SelectTrigger data-testid="bg-type-select"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {TYPE_OPTIONS.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>

                  {isShader && (
                    <div>
                      <label className="text-sm font-medium mb-2 block">Shader Preset</label>
                      <div className="grid grid-cols-2 gap-2">
                        {SHADER_PRESETS.map((s, i) => (
                          <button
                            key={s.name}
                            data-testid={`shader-preset-${i}`}
                            onClick={() => update({ shaderIndex: i })}
                            className={`px-3 py-2 rounded-lg text-sm border transition-colors text-left ${
                              cfg.shaderIndex === i ? "border-primary text-primary bg-primary/10" : "border-border text-muted-foreground hover:text-foreground"
                            }`}
                          >
                            <div className="font-medium">{s.name}</div>
                            <div className="text-xs opacity-70">{s.description}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {needsColors && (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-2">
                        <label className="text-sm font-medium shrink-0">Color 1</label>
                        <input type="color" value={cfg.color1} onChange={e => update({ color1: e.target.value })} className="w-10 h-9 rounded cursor-pointer border border-border" />
                        <span className="font-mono text-xs text-muted-foreground">{cfg.color1.toUpperCase()}</span>
                      </div>
                      {type !== "solid" && (
                        <div className="flex items-center gap-2">
                          <label className="text-sm font-medium shrink-0">Color 2</label>
                          <input type="color" value={cfg.color2} onChange={e => update({ color2: e.target.value })} className="w-10 h-9 rounded cursor-pointer border border-border" />
                          <span className="font-mono text-xs text-muted-foreground">{cfg.color2.toUpperCase()}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {needsAngle && (
                    <div>
                      <label className="text-sm font-medium mb-3 block">Angle — {cfg.angle}deg</label>
                      <Slider min={0} max={360} step={1} value={[cfg.angle]} onValueChange={([v]) => update({ angle: v })} />
                    </div>
                  )}
                  {needsSize && (
                    <div>
                      <label className="text-sm font-medium mb-3 block">Size — {cfg.size}px</label>
                      <Slider min={8} max={100} step={2} value={[cfg.size]} onValueChange={([v]) => update({ size: v })} />
                    </div>
                  )}
                  {needsDensity && (
                    <div>
                      <label className="text-sm font-medium mb-3 block">Dot Size — {cfg.density}px</label>
                      <Slider min={1} max={10} step={1} value={[cfg.density]} onValueChange={([v]) => update({ density: v })} />
                    </div>
                  )}
                  {needsOpacity && (
                    <div>
                      <label className="text-sm font-medium mb-3 block">Noise Opacity — {Math.round(cfg.opacity * 100)}%</label>
                      <Slider min={0} max={100} step={1} value={[Math.round(cfg.opacity * 100)]} onValueChange={([v]) => update({ opacity: v / 100 })} />
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <pre className="text-xs font-mono text-muted-foreground whitespace-pre-wrap break-all leading-relaxed">{cssOutput}</pre>
                </CardContent>
              </Card>

              <Button data-testid="copy-bg-css" onClick={copy} className="w-full">
                {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                {isShader ? "Copy Shader Info" : "Copy CSS"}
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="presets">
          <div className="flex gap-2 flex-wrap mb-6">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setFilterCat(cat)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                  filterCat === cat ? "border-primary text-primary bg-primary/10" : "border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map((preset) => (
              <div
                key={preset.name}
                data-testid={`bg-preset-${preset.name.toLowerCase().replace(/ /g, "-")}`}
                className="group rounded-xl overflow-hidden border border-border hover:border-primary transition-all cursor-pointer hover:scale-[1.02]"
                onClick={() => applyPreset(preset)}
              >
                <div className="h-32 w-full relative overflow-hidden">
                  {preset.type === "shader" ? (
                    <ShaderCanvas
                      fragment={SHADER_PRESETS[preset.cfg.shaderIndex ?? 0]?.fragment}
                      className="w-full h-full"
                    />
                  ) : (
                    <div className="w-full h-full" style={generatePreviewStyle(preset.type, fullCfg(preset))} />
                  )}
                </div>
                <div className="p-3 bg-card flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{preset.name}</p>
                    <p className="text-xs text-muted-foreground capitalize">{preset.category}</p>
                  </div>
                  <Wand2 className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="shaders">
          <div className="mb-6">
            <p className="text-muted-foreground text-sm">Live GLSL fragment shaders running directly in the browser via WebGL. Click any to customize in the generator.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {SHADER_PRESETS.map((shader, i) => (
              <div
                key={shader.name}
                data-testid={`shader-card-${i}`}
                className="group rounded-xl overflow-hidden border border-border hover:border-primary transition-all cursor-pointer hover:scale-[1.02]"
                onClick={() => { update({ shaderIndex: i }); setType("shader"); setActiveTab("generator"); }}
              >
                <div className="h-48 relative overflow-hidden">
                  <ShaderCanvas fragment={shader.fragment} className="w-full h-full" />
                </div>
                <div className="p-4 bg-card">
                  <p className="font-medium text-sm">{shader.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{shader.description}</p>
                  <div className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-xs text-primary font-medium flex items-center gap-1">
                      <Wand2 className="w-3 h-3" /> Customize
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
