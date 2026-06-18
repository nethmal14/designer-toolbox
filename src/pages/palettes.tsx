import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Copy, Plus, Save, Download, RefreshCw, Trash2, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

// Hex to HSL, HSL to Hex, basic color math needed
function hexToHsl(hex: string) {
  let r = 0, g = 0, b = 0;
  if (hex.length === 4) {
    r = parseInt(hex[1] + hex[1], 16);
    g = parseInt(hex[2] + hex[2], 16);
    b = parseInt(hex[3] + hex[3], 16);
  } else if (hex.length === 7) {
    r = parseInt(hex.substring(1, 3), 16);
    g = parseInt(hex.substring(3, 5), 16);
    b = parseInt(hex.substring(5, 7), 16);
  }
  r /= 255;
  g /= 255;
  b /= 255;
  let max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;

  if (max !== min) {
    let d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return [h * 360, s * 100, l * 100];
}

function hslToHex(h: number, s: number, l: number) {
  l /= 100;
  const a = s * Math.min(l, 1 - l) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

const PRESETS = [
  { name: "Sunset", colors: ["#FF7B54", "#FFB26B", "#FFD56F", "#939B62", "#E8DFCA"] },
  { name: "Ocean Drift", colors: ["#0B2447", "#19376D", "#576CBC", "#A5D7E8", "#E1F2F7"] },
  { name: "Nordic Fog", colors: ["#2C3333", "#395B64", "#A5C9CA", "#E7F6F2", "#F2F7F6"] },
  { name: "Neon City", colors: ["#F0134D", "#FF6F5E", "#F5F0E3", "#40DFEF", "#B9F8D3"] },
  { name: "Earthy Tones", colors: ["#606C38", "#283618", "#FEFAE0", "#DDA15E", "#BC6C25"] },
  { name: "Minimal Mono", colors: ["#111111", "#333333", "#555555", "#888888", "#DDDDDD"] },
  { name: "Pastel Dreams", colors: ["#FFB7B2", "#E2F0CB", "#B5EAD7", "#C7CEEA", "#F2D8D8"] },
  { name: "Cyberpunk", colors: ["#FCE38A", "#F38181", "#EAFFD0", "#95E1D3", "#1B1A17"] },
];

export default function Palettes() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("generator");
  const [baseColor, setBaseColor] = useState("#6366f1");
  const [generatedPalette, setGeneratedPalette] = useState<string[]>([]);
  const [savedPalettes, setSavedPalettes] = useState<{name: string, colors: string[]}[]>([]);

  useEffect(() => {
    generatePalette(baseColor);
    const saved = localStorage.getItem("designer-toolbox-palettes");
    if (saved) setSavedPalettes(JSON.parse(saved));
  }, []);

  const generatePalette = (hex: string) => {
    const [h, s, l] = hexToHsl(hex);
    // Analogous
    const colors = [
      hslToHex((h - 60 + 360) % 360, s, l),
      hslToHex((h - 30 + 360) % 360, s, l),
      hex,
      hslToHex((h + 30) % 360, s, l),
      hslToHex((h + 60) % 360, s, l),
    ];
    setGeneratedPalette(colors);
  };

  const copyHex = (hex: string) => {
    navigator.clipboard.writeText(hex);
    toast({
      title: "Copied!",
      description: `${hex} has been copied to your clipboard.`,
    });
  };

  const savePalette = () => {
    const newSaved = [...savedPalettes, { name: "Saved Palette", colors: generatedPalette }];
    setSavedPalettes(newSaved);
    localStorage.setItem("designer-toolbox-palettes", JSON.stringify(newSaved));
    toast({ title: "Saved", description: "Palette saved to your collection." });
  };

  const loadPreset = (preset: { name: string; colors: string[] }) => {
    const mid = preset.colors[Math.floor(preset.colors.length / 2)];
    setBaseColor(mid);
    setGeneratedPalette(preset.colors);
    setActiveTab("generator");
  };

  return (
    <div className="container mx-auto max-w-screen-xl px-4 md:px-8 py-8">
      <div className="flex flex-col mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Color Palettes</h1>
        <p className="text-muted-foreground">Generate, discover, and save harmonious color schemes.</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-8">
          <TabsTrigger value="generator">Generator</TabsTrigger>
          <TabsTrigger value="presets">Presets</TabsTrigger>
          <TabsTrigger value="saved">My Palettes</TabsTrigger>
        </TabsList>

        <TabsContent value="generator" className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Generator</CardTitle>
              <CardDescription>Pick a base color to generate a palette.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-8">
                <Input 
                  type="color" 
                  value={baseColor} 
                  onChange={(e) => {
                    setBaseColor(e.target.value);
                    generatePalette(e.target.value);
                  }}
                  className="w-16 h-12 p-1 cursor-pointer"
                />
                <Input 
                  type="text" 
                  value={baseColor} 
                  onChange={(e) => {
                    setBaseColor(e.target.value);
                    if (/^#[0-9A-F]{6}$/i.test(e.target.value)) {
                      generatePalette(e.target.value);
                    }
                  }}
                  className="w-32 font-mono uppercase"
                />
                <Button variant="outline" onClick={() => generatePalette(baseColor)}>
                  <RefreshCw className="w-4 h-4 mr-2" /> Regenerate
                </Button>
                <Button onClick={savePalette}>
                  <Save className="w-4 h-4 mr-2" /> Save Palette
                </Button>
              </div>

              <div className="flex h-48 rounded-xl overflow-hidden shadow-sm">
                {generatedPalette.map((color, i) => (
                  <div 
                    key={i} 
                    className="flex-1 transition-all hover:flex-[1.2] cursor-pointer relative group flex items-end justify-center pb-4"
                    style={{ backgroundColor: color }}
                    onClick={() => copyHex(color)}
                  >
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 text-white text-sm font-mono px-3 py-1 rounded-md backdrop-blur-md">
                      {color.toUpperCase()}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="presets">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {PRESETS.map((preset, i) => (
              <Card key={i} className="overflow-hidden group/card">
                <div className="flex h-32 cursor-pointer" onClick={() => loadPreset(preset)}>
                  {preset.colors.map((c, j) => (
                    <div
                      key={j}
                      className="flex-1 relative"
                      style={{ backgroundColor: c }}
                      onClick={e => { e.stopPropagation(); copyHex(c); }}
                    >
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 bg-black/25 transition-opacity text-white text-xs font-mono font-medium drop-shadow-md">
                        {c.toUpperCase()}
                      </div>
                    </div>
                  ))}
                </div>
                <CardContent className="p-4 flex items-center justify-between">
                  <span className="font-medium">{preset.name}</span>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs h-7 px-2 opacity-0 group-hover/card:opacity-100 transition-opacity"
                      onClick={() => loadPreset(preset)}
                    >
                      Customize
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => {
                      navigator.clipboard.writeText(preset.colors.join(", "));
                      toast({ title: "Copied!", description: "All hex codes copied." });
                    }}>
                      <Copy className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="saved">
          {savedPalettes.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No saved palettes yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {savedPalettes.map((preset, i) => (
                <Card key={i} className="overflow-hidden">
                  <div className="flex h-32">
                    {preset.colors.map((c, j) => (
                      <div 
                        key={j} 
                        className="flex-1 cursor-pointer group relative"
                        style={{ backgroundColor: c }}
                        onClick={() => copyHex(c)}
                      >
                         <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/20 transition-opacity text-white text-xs font-mono font-medium drop-shadow-md">
                          {c.toUpperCase()}
                        </div>
                      </div>
                    ))}
                  </div>
                  <CardContent className="p-4 flex items-center justify-between">
                    <span className="font-medium">{preset.name}</span>
                    <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={() => {
                      const newSaved = savedPalettes.filter((_, idx) => idx !== i);
                      setSavedPalettes(newSaved);
                      localStorage.setItem("designer-toolbox-palettes", JSON.stringify(newSaved));
                    }}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
