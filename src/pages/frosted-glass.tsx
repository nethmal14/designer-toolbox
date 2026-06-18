import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";

const BG_PRESETS = [
  { label: "Purple Mesh", value: "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f953c6 100%)" },
  { label: "Ocean", value: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)" },
  { label: "Sunset", value: "linear-gradient(135deg, #f83600 0%, #f9d423 100%)" },
  { label: "Aurora", value: "linear-gradient(135deg, #43e97b 0%, #38f9d7 50%, #4facfe 100%)" },
  { label: "Midnight", value: "linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 50%, #16213e 100%)" },
  { label: "Rose Gold", value: "linear-gradient(135deg, #f8b4b4 0%, #e066a0 50%, #8b1a4a 100%)" },
];

export default function FrostedGlass() {
  const { toast } = useToast();
  const [blur, setBlur] = useState(12);
  const [opacity, setOpacity] = useState(0.15);
  const [borderOpacity, setBorderOpacity] = useState(0.2);
  const [borderRadius, setBorderRadius] = useState(16);
  const [shadowIntensity, setShadowIntensity] = useState(0.25);
  const [tint, setTint] = useState("#ffffff");
  const [bg, setBg] = useState(BG_PRESETS[0].value);
  const [copied, setCopied] = useState<"css" | "tailwind" | null>(null);

  const r = parseInt(tint.slice(1, 3), 16);
  const g = parseInt(tint.slice(3, 5), 16);
  const b = parseInt(tint.slice(5, 7), 16);

  const glassStyle = {
    backdropFilter: `blur(${blur}px)`,
    WebkitBackdropFilter: `blur(${blur}px)`,
    background: `rgba(${r}, ${g}, ${b}, ${opacity})`,
    border: `1px solid rgba(${r}, ${g}, ${b}, ${borderOpacity + 0.3})`,
    borderRadius: `${borderRadius}px`,
    boxShadow: `0 8px 32px rgba(0, 0, 0, ${shadowIntensity}), inset 0 1px 0 rgba(255,255,255,${borderOpacity * 0.8})`,
  };

  const cssOutput = `backdrop-filter: blur(${blur}px);
-webkit-backdrop-filter: blur(${blur}px);
background: rgba(${r}, ${g}, ${b}, ${opacity});
border: 1px solid rgba(${r}, ${g}, ${b}, ${(borderOpacity + 0.3).toFixed(2)});
border-radius: ${borderRadius}px;
box-shadow: 0 8px 32px rgba(0, 0, 0, ${shadowIntensity}), inset 0 1px 0 rgba(255,255,255,${(borderOpacity * 0.8).toFixed(2)});`;

  const tailwindOutput = `className="backdrop-blur-[${blur}px] bg-white/${Math.round(opacity * 100)} border border-white/${Math.round((borderOpacity + 0.3) * 100)} rounded-[${borderRadius}px] shadow-lg"`;

  const copy = (type: "css" | "tailwind") => {
    navigator.clipboard.writeText(type === "css" ? cssOutput : tailwindOutput);
    setCopied(type);
    toast({ title: "Copied!", description: `${type === "css" ? "CSS" : "Tailwind"} copied to clipboard.` });
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="container mx-auto max-w-screen-xl px-4 md:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Frosted Glass</h1>
        <p className="text-muted-foreground">Create glassmorphism effects with live preview and CSS output.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div
          className="relative h-[500px] rounded-2xl overflow-hidden flex items-center justify-center"
          style={{ background: bg }}
        >
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full opacity-30"
              style={{
                width: `${80 + i * 30}px`,
                height: `${80 + i * 30}px`,
                background: "rgba(255,255,255,0.15)",
                top: `${10 + i * 12}%`,
                left: `${5 + i * 14}%`,
              }}
            />
          ))}
          <div style={glassStyle} className="relative z-10 p-8 w-64">
            <div className="h-3 w-24 rounded-full bg-white/40 mb-3" />
            <div className="h-2 w-40 rounded-full bg-white/25 mb-2" />
            <div className="h-2 w-32 rounded-full bg-white/25 mb-4" />
            <div className="h-8 w-full rounded-lg bg-white/20" />
          </div>
        </div>

        <div className="space-y-6">
          <Card>
            <CardContent className="p-6 space-y-6">
              <div>
                <label className="text-sm font-medium mb-3 block">Background Blur — {blur}px</label>
                <Slider min={0} max={50} step={1} value={[blur]} onValueChange={([v]) => setBlur(v)} />
              </div>
              <div>
                <label className="text-sm font-medium mb-3 block">Transparency — {Math.round(opacity * 100)}%</label>
                <Slider min={0} max={100} step={1} value={[Math.round(opacity * 100)]} onValueChange={([v]) => setOpacity(v / 100)} />
              </div>
              <div>
                <label className="text-sm font-medium mb-3 block">Border Opacity — {Math.round(borderOpacity * 100)}%</label>
                <Slider min={0} max={100} step={1} value={[Math.round(borderOpacity * 100)]} onValueChange={([v]) => setBorderOpacity(v / 100)} />
              </div>
              <div>
                <label className="text-sm font-medium mb-3 block">Border Radius — {borderRadius}px</label>
                <Slider min={0} max={48} step={2} value={[borderRadius]} onValueChange={([v]) => setBorderRadius(v)} />
              </div>
              <div>
                <label className="text-sm font-medium mb-3 block">Shadow Intensity — {Math.round(shadowIntensity * 100)}%</label>
                <Slider min={0} max={100} step={1} value={[Math.round(shadowIntensity * 100)]} onValueChange={([v]) => setShadowIntensity(v / 100)} />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Tint Color</label>
                <div className="flex items-center gap-3">
                  <input type="color" value={tint} onChange={e => setTint(e.target.value)} className="w-12 h-10 rounded cursor-pointer border border-border" />
                  <span className="font-mono text-sm text-muted-foreground">{tint.toUpperCase()}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3 block">Background Preset</label>
              <div className="grid grid-cols-3 gap-2">
                {BG_PRESETS.map((preset) => (
                  <button
                    key={preset.label}
                    data-testid={`bg-preset-${preset.label.toLowerCase().replace(" ", "-")}`}
                    onClick={() => setBg(preset.value)}
                    className={`h-12 rounded-lg transition-all hover:scale-105 ${bg === preset.value ? "ring-2 ring-primary ring-offset-2 ring-offset-card" : ""}`}
                    style={{ background: preset.value }}
                    title={preset.label}
                  />
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 gap-3">
            <Button
              data-testid="copy-css"
              onClick={() => copy("css")}
              className="w-full"
            >
              {copied === "css" ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
              Copy CSS
            </Button>
            <Button
              data-testid="copy-tailwind"
              variant="outline"
              onClick={() => copy("tailwind")}
              className="w-full"
            >
              {copied === "tailwind" ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
              Copy Tailwind
            </Button>
          </div>

          <Card>
            <CardContent className="p-4">
              <pre className="text-xs font-mono text-muted-foreground whitespace-pre-wrap break-all leading-relaxed">{cssOutput}</pre>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
