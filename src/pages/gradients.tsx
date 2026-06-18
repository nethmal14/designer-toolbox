import { useState } from "react";
import { Copy, Check, Wand2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

type GradientType = "linear" | "radial" | "conic" | "animated" | "mesh";

interface GradientPreset {
  name: string;
  category: string;
  type: GradientType;
  color1: string;
  color2: string;
  color3?: string;
  angle: number;
  css: string;
}

const PRESETS: GradientPreset[] = [
  { name: "Aurora", category: "Nature", type: "linear", color1: "#a18cd1", color2: "#fbc2eb", angle: 135, css: "linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)" },
  { name: "Sunset Blaze", category: "Nature", type: "linear", color1: "#f6d365", color2: "#fda085", angle: 120, css: "linear-gradient(120deg, #f6d365 0%, #fda085 100%)" },
  { name: "Ocean Depth", category: "Nature", type: "linear", color1: "#4facfe", color2: "#00f2fe", angle: 90, css: "linear-gradient(to right, #4facfe 0%, #00f2fe 100%)" },
  { name: "Forest", category: "Nature", type: "linear", color1: "#134e5e", color2: "#71b280", angle: 135, css: "linear-gradient(135deg, #134e5e 0%, #71b280 100%)" },
  { name: "Desert Dune", category: "Nature", type: "linear", color1: "#c79081", color2: "#dfa579", angle: 160, css: "linear-gradient(160deg, #c79081 0%, #dfa579 100%)" },
  { name: "Cosmic Dust", category: "Space", type: "linear", color1: "#7b4397", color2: "#dc2430", angle: 90, css: "linear-gradient(to right, #7b4397 0%, #dc2430 100%)" },
  { name: "Nebula", category: "Space", type: "linear", color1: "#0f2027", color2: "#2c5364", angle: 135, css: "linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)" },
  { name: "Star Cluster", category: "Space", type: "radial", color1: "#1a1a2e", color2: "#e94560", angle: 0, css: "radial-gradient(circle at 30% 50%, #e94560 0%, #1a1a2e 70%)" },
  { name: "Neon Pulse", category: "Neon", type: "linear", color1: "#f83600", color2: "#f9d423", angle: 90, css: "linear-gradient(to right, #f83600 0%, #f9d423 100%)" },
  { name: "Electric Violet", category: "Neon", type: "linear", color1: "#4776e6", color2: "#8e54e9", angle: 135, css: "linear-gradient(135deg, #4776e6 0%, #8e54e9 100%)" },
  { name: "Cyber Lime", category: "Neon", type: "linear", color1: "#00f260", color2: "#0575e6", angle: 90, css: "linear-gradient(to right, #00f260 0%, #0575e6 100%)" },
  { name: "Hot Pink", category: "Neon", type: "linear", color1: "#f953c6", color2: "#b91d73", angle: 135, css: "linear-gradient(135deg, #f953c6 0%, #b91d73 100%)" },
  { name: "Mint Fresh", category: "Pastel", type: "linear", color1: "#a8edea", color2: "#fed6e3", angle: 135, css: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)" },
  { name: "Peach Cream", category: "Pastel", type: "linear", color1: "#ffecd2", color2: "#fcb69f", angle: 135, css: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)" },
  { name: "Lavender Dream", category: "Pastel", type: "linear", color1: "#e0c3fc", color2: "#8ec5fc", angle: 135, css: "linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)" },
  { name: "Cotton Candy", category: "Pastel", type: "linear", color1: "#fddb92", color2: "#d1fdff", angle: 135, css: "linear-gradient(135deg, #fddb92 0%, #d1fdff 100%)" },
  { name: "Midnight", category: "Dark", type: "linear", color1: "#0c0c0c", color2: "#1a1a2e", angle: 135, css: "linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 100%)" },
  { name: "Ink", category: "Dark", type: "linear", color1: "#000428", color2: "#004e92", angle: 135, css: "linear-gradient(135deg, #000428 0%, #004e92 100%)" },
  { name: "Charcoal", category: "Dark", type: "radial", color1: "#141e30", color2: "#243b55", angle: 0, css: "radial-gradient(ellipse at top, #141e30 0%, #243b55 100%)" },
  { name: "Golden Hour", category: "Nature", type: "linear", color1: "#f7971e", color2: "#ffd200", angle: 120, css: "linear-gradient(120deg, #f7971e 0%, #ffd200 100%)" },
  { name: "Radial Pop", category: "Neon", type: "radial", color1: "#6366f1", color2: "#0a0a0a", angle: 0, css: "radial-gradient(circle at 50% 50%, #6366f1 0%, #0a0a0a 70%)" },
  { name: "Conic Rainbow", category: "Special", type: "conic", color1: "#ff0000", color2: "#0000ff", angle: 0, css: "conic-gradient(from 0deg, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)" },
];

const CATEGORIES = ["All", ...Array.from(new Set(PRESETS.map(p => p.category)))];

function parseCSSToState(preset: GradientPreset) {
  return {
    color1: preset.color1,
    color2: preset.color2,
    angle: preset.angle,
    gradientType: preset.type,
  };
}

export default function Gradients() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("generator");
  const [category, setCategory] = useState("All");

  const [gradientType, setGradientType] = useState<GradientType>("linear");
  const [color1, setColor1] = useState("#6366f1");
  const [color2, setColor2] = useState("#ec4899");
  const [color3, setColor3] = useState("#f59e0b");
  const [angle, setAngle] = useState(135);
  const [stops, setStops] = useState([0, 100]);
  const [copied, setCopied] = useState(false);

  const meshStyle = {
    background: `radial-gradient(ellipse at 20% 30%, ${color1}88 0%, transparent 50%),
radial-gradient(ellipse at 80% 70%, ${color2}88 0%, transparent 50%),
radial-gradient(ellipse at 50% 50%, ${color3}55 0%, transparent 60%)`,
    backgroundColor: "#0a0a0a",
  };

  function buildCSS() {
    switch (gradientType) {
      case "linear":
        return `background: linear-gradient(${angle}deg, ${color1} ${stops[0]}%, ${color2} ${stops[1]}%);`;
      case "radial":
        return `background: radial-gradient(circle at center, ${color1} 0%, ${color2} 100%);`;
      case "conic":
        return `background: conic-gradient(from ${angle}deg at 50% 50%, ${color1}, ${color2}, ${color1});`;
      case "animated":
        return `background: linear-gradient(${angle}deg, ${color1}, ${color2}, ${color1});\nbackground-size: 300% 300%;\nanimation: gradientShift 4s ease infinite;\n\n@keyframes gradientShift {\n  0% { background-position: 0% 50%; }\n  50% { background-position: 100% 50%; }\n  100% { background-position: 0% 50%; }\n}`;
      case "mesh":
        return `background-color: #0a0a0a;\nbackground-image:\n  radial-gradient(ellipse at 20% 30%, ${color1}88 0%, transparent 50%),\n  radial-gradient(ellipse at 80% 70%, ${color2}88 0%, transparent 50%),\n  radial-gradient(ellipse at 50% 50%, ${color3}55 0%, transparent 60%);`;
    }
  }

  function getPreviewStyle(): React.CSSProperties {
    switch (gradientType) {
      case "linear":
        return { background: `linear-gradient(${angle}deg, ${color1} ${stops[0]}%, ${color2} ${stops[1]}%)` };
      case "radial":
        return { background: `radial-gradient(circle at center, ${color1} 0%, ${color2} 100%)` };
      case "conic":
        return { background: `conic-gradient(from ${angle}deg at 50% 50%, ${color1}, ${color2}, ${color1})` };
      case "animated":
        return { background: `linear-gradient(${angle}deg, ${color1}, ${color2}, ${color1})`, backgroundSize: "300% 300%", animation: "gradientShift 4s ease infinite" };
      case "mesh":
        return meshStyle as React.CSSProperties;
    }
  }

  const copy = (css?: string) => {
    navigator.clipboard.writeText(css ?? buildCSS());
    setCopied(true);
    toast({ title: "Copied!", description: "Gradient CSS copied to clipboard." });
    setTimeout(() => setCopied(false), 2000);
  };

  const applyPreset = (preset: GradientPreset) => {
    const s = parseCSSToState(preset);
    setColor1(s.color1);
    setColor2(s.color2);
    setAngle(s.angle);
    setGradientType(s.gradientType);
    setActiveTab("generator");
  };

  const filtered = category === "All" ? PRESETS : PRESETS.filter(p => p.category === category);

  return (
    <div className="container mx-auto max-w-screen-xl px-4 md:px-8 py-8">
      <style>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>

      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Gradients</h1>
        <p className="text-muted-foreground">Build custom gradients or explore 20+ curated presets.</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-8">
          <TabsTrigger value="generator">Generator</TabsTrigger>
          <TabsTrigger value="presets">Presets ({PRESETS.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="generator">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div
              className="h-[420px] rounded-2xl border border-border shadow-sm"
              style={getPreviewStyle()}
            />

            <Card>
              <CardContent className="p-6 space-y-5">
                <div>
                  <label className="text-sm font-medium mb-2 block">Type</label>
                  <div className="flex flex-wrap gap-2">
                    {(["linear", "radial", "conic", "animated", "mesh"] as GradientType[]).map(t => (
                      <button
                        key={t}
                        data-testid={`gradient-type-${t}`}
                        onClick={() => setGradientType(t)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors capitalize ${
                          gradientType === t ? "border-primary text-primary bg-primary/10" : "border-border text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Color 1</label>
                    <div className="flex items-center gap-2">
                      <Input type="color" value={color1} onChange={e => setColor1(e.target.value)} className="w-12 h-10 p-1 cursor-pointer" />
                      <Input value={color1} onChange={e => setColor1(e.target.value)} className="font-mono text-sm uppercase" />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Color 2</label>
                    <div className="flex items-center gap-2">
                      <Input type="color" value={color2} onChange={e => setColor2(e.target.value)} className="w-12 h-10 p-1 cursor-pointer" />
                      <Input value={color2} onChange={e => setColor2(e.target.value)} className="font-mono text-sm uppercase" />
                    </div>
                  </div>
                </div>

                {gradientType === "mesh" && (
                  <div>
                    <label className="text-sm font-medium mb-2 block">Accent Color</label>
                    <div className="flex items-center gap-2">
                      <Input type="color" value={color3} onChange={e => setColor3(e.target.value)} className="w-12 h-10 p-1 cursor-pointer" />
                      <Input value={color3} onChange={e => setColor3(e.target.value)} className="font-mono text-sm uppercase" />
                    </div>
                  </div>
                )}

                {(gradientType === "linear" || gradientType === "conic" || gradientType === "animated") && (
                  <div>
                    <label className="text-sm font-medium mb-3 block">Angle — {angle}°</label>
                    <Slider min={0} max={360} step={1} value={[angle]} onValueChange={([v]) => setAngle(v)} />
                  </div>
                )}

                {gradientType === "linear" && (
                  <div>
                    <label className="text-sm font-medium mb-3 block">Stops — {stops[0]}% → {stops[1]}%</label>
                    <div className="flex gap-4">
                      <Slider min={0} max={50} step={1} value={[stops[0]]} onValueChange={([v]) => setStops([v, stops[1]])} />
                      <Slider min={50} max={100} step={1} value={[stops[1]]} onValueChange={([v]) => setStops([stops[0], v])} />
                    </div>
                  </div>
                )}

                <div className="bg-muted rounded-lg p-3">
                  <pre className="text-xs font-mono text-muted-foreground whitespace-pre-wrap">{buildCSS()}</pre>
                </div>

                <Button data-testid="copy-gradient-css" onClick={() => copy()} className="w-full">
                  {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                  Copy CSS
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="presets">
          <div className="flex gap-2 flex-wrap mb-6">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                  category === cat ? "border-primary text-primary bg-primary/10" : "border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map((preset, i) => (
              <div
                key={i}
                data-testid={`gradient-preset-${i}`}
                className="group rounded-xl overflow-hidden border border-border hover:border-primary transition-all cursor-pointer hover:scale-[1.02]"
                onClick={() => applyPreset(preset)}
              >
                <div className="h-36 w-full" style={{ background: preset.css }} />
                <div className="p-3 bg-card flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{preset.name}</p>
                    <p className="text-xs text-muted-foreground capitalize">{preset.type} · {preset.category}</p>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={e => { e.stopPropagation(); copy(preset.css); }}
                      className="p-1.5 rounded-md hover:bg-muted"
                      title="Copy CSS"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={e => { e.stopPropagation(); applyPreset(preset); }}
                      className="p-1.5 rounded-md hover:bg-muted"
                      title="Customize"
                    >
                      <Wand2 className="w-3.5 h-3.5" />
                    </button>
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
