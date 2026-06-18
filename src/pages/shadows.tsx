import { useState } from "react";
import { Copy, Plus, Trash2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";

interface ShadowLayer {
  id: number;
  x: number;
  y: number;
  blur: number;
  spread: number;
  color: string;
  opacity: number;
  inset: boolean;
}

const PRESETS = [
  {
    name: "Soft Lift",
    layers: [
      { id: 1, x: 0, y: 4, blur: 16, spread: -2, color: "#000000", opacity: 0.12, inset: false },
      { id: 2, x: 0, y: 2, blur: 4, spread: -1, color: "#000000", opacity: 0.08, inset: false },
    ],
  },
  {
    name: "Sharp Edge",
    layers: [
      { id: 1, x: 4, y: 4, blur: 0, spread: 0, color: "#000000", opacity: 0.8, inset: false },
    ],
  },
  {
    name: "Glow",
    layers: [
      { id: 1, x: 0, y: 0, blur: 20, spread: 4, color: "#6366f1", opacity: 0.6, inset: false },
      { id: 2, x: 0, y: 0, blur: 40, spread: 8, color: "#6366f1", opacity: 0.2, inset: false },
    ],
  },
  {
    name: "Dreamy",
    layers: [
      { id: 1, x: 0, y: 8, blur: 32, spread: -4, color: "#8b5cf6", opacity: 0.35, inset: false },
      { id: 2, x: 0, y: 2, blur: 8, spread: -2, color: "#000000", opacity: 0.1, inset: false },
    ],
  },
  {
    name: "Pressed",
    layers: [
      { id: 1, x: 0, y: 2, blur: 4, spread: -1, color: "#000000", opacity: 0.15, inset: true },
      { id: 2, x: 0, y: 1, blur: 2, spread: 0, color: "#000000", opacity: 0.1, inset: true },
    ],
  },
  {
    name: "Floating",
    layers: [
      { id: 1, x: 0, y: 20, blur: 60, spread: -10, color: "#000000", opacity: 0.3, inset: false },
      { id: 2, x: 0, y: 4, blur: 12, spread: -4, color: "#000000", opacity: 0.12, inset: false },
    ],
  },
];

function hexToRgba(hex: string, opacity: number) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

function layerToCSS(l: ShadowLayer) {
  return `${l.inset ? "inset " : ""}${l.x}px ${l.y}px ${l.blur}px ${l.spread}px ${hexToRgba(l.color, l.opacity)}`;
}

export default function Shadows() {
  const { toast } = useToast();
  const [layers, setLayers] = useState<ShadowLayer[]>(PRESETS[0].layers);
  const [selected, setSelected] = useState(0);
  const [cardBg, setCardBg] = useState("#ffffff");
  const [copied, setCopied] = useState(false);

  const boxShadow = layers.map(layerToCSS).join(", ");
  const cssOutput = `box-shadow: ${boxShadow};`;

  const updateLayer = (id: number, patch: Partial<ShadowLayer>) => {
    setLayers(prev => prev.map(l => l.id === id ? { ...l, ...patch } : l));
  };

  const addLayer = () => {
    const newLayer: ShadowLayer = {
      id: Date.now(),
      x: 0, y: 8, blur: 24, spread: 0,
      color: "#000000", opacity: 0.15, inset: false,
    };
    setLayers(prev => [...prev, newLayer]);
    setSelected(layers.length);
  };

  const removeLayer = (id: number) => {
    if (layers.length === 1) return;
    const idx = layers.findIndex(l => l.id === id);
    setLayers(prev => prev.filter(l => l.id !== id));
    setSelected(Math.max(0, idx - 1));
  };

  const copy = () => {
    navigator.clipboard.writeText(cssOutput);
    setCopied(true);
    toast({ title: "Copied!", description: "Box shadow CSS copied to clipboard." });
    setTimeout(() => setCopied(false), 2000);
  };

  const applyPreset = (preset: typeof PRESETS[0]) => {
    setLayers(preset.layers.map((l, i) => ({ ...l, id: i + 1 })));
    setSelected(0);
  };

  const activeLayer = layers[selected] ?? layers[0];

  return (
    <div className="container mx-auto max-w-screen-xl px-4 md:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Box Shadow</h1>
        <p className="text-muted-foreground">Build CSS box-shadows visually with multiple layers.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div
            className="h-72 rounded-2xl flex items-center justify-center transition-all"
            style={{ background: "hsl(var(--muted))" }}
          >
            <div
              className="w-48 h-48 rounded-xl transition-all"
              style={{
                background: cardBg,
                boxShadow,
              }}
            />
          </div>

          <div className="flex items-center gap-3">
            <label className="text-sm font-medium">Card Color</label>
            <input type="color" value={cardBg} onChange={e => setCardBg(e.target.value)} className="w-10 h-9 rounded cursor-pointer border border-border" />
          </div>

          <Card>
            <CardContent className="p-4">
              <pre className="text-xs font-mono text-muted-foreground whitespace-pre-wrap break-all leading-relaxed">{cssOutput}</pre>
            </CardContent>
          </Card>

          <Button data-testid="copy-shadow-css" onClick={copy} className="w-full">
            {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
            Copy CSS
          </Button>

          <div>
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3 block">Presets</label>
            <div className="grid grid-cols-3 gap-2">
              {PRESETS.map((preset) => (
                <button
                  key={preset.name}
                  data-testid={`shadow-preset-${preset.name.toLowerCase().replace(" ", "-")}`}
                  onClick={() => applyPreset(preset)}
                  className="text-xs px-3 py-2 rounded-lg border border-border hover:border-primary hover:text-primary transition-colors text-left font-medium"
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Shadow Layers</span>
            <Button size="sm" variant="outline" onClick={addLayer}>
              <Plus className="w-4 h-4 mr-1" /> Add Layer
            </Button>
          </div>

          <div className="flex gap-2 flex-wrap">
            {layers.map((layer, i) => (
              <button
                key={layer.id}
                data-testid={`layer-tab-${i}`}
                onClick={() => setSelected(i)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors border ${
                  selected === i ? "border-primary text-primary bg-primary/10" : "border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                <span
                  className="w-3 h-3 rounded-full inline-block"
                  style={{ background: hexToRgba(layer.color, Math.max(layer.opacity, 0.3)) }}
                />
                Layer {i + 1}
                {layers.length > 1 && (
                  <span
                    onClick={(e) => { e.stopPropagation(); removeLayer(layer.id); }}
                    className="ml-1 hover:text-destructive transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                  </span>
                )}
              </button>
            ))}
          </div>

          {activeLayer && (
            <Card>
              <CardContent className="p-6 space-y-5">
                <div>
                  <label className="text-sm font-medium mb-3 block">X Offset — {activeLayer.x}px</label>
                  <Slider min={-60} max={60} step={1} value={[activeLayer.x]} onValueChange={([v]) => updateLayer(activeLayer.id, { x: v })} />
                </div>
                <div>
                  <label className="text-sm font-medium mb-3 block">Y Offset — {activeLayer.y}px</label>
                  <Slider min={-60} max={60} step={1} value={[activeLayer.y]} onValueChange={([v]) => updateLayer(activeLayer.id, { y: v })} />
                </div>
                <div>
                  <label className="text-sm font-medium mb-3 block">Blur — {activeLayer.blur}px</label>
                  <Slider min={0} max={100} step={1} value={[activeLayer.blur]} onValueChange={([v]) => updateLayer(activeLayer.id, { blur: v })} />
                </div>
                <div>
                  <label className="text-sm font-medium mb-3 block">Spread — {activeLayer.spread}px</label>
                  <Slider min={-30} max={30} step={1} value={[activeLayer.spread]} onValueChange={([v]) => updateLayer(activeLayer.id, { spread: v })} />
                </div>
                <div>
                  <label className="text-sm font-medium mb-3 block">Opacity — {Math.round(activeLayer.opacity * 100)}%</label>
                  <Slider min={0} max={100} step={1} value={[Math.round(activeLayer.opacity * 100)]} onValueChange={([v]) => updateLayer(activeLayer.id, { opacity: v / 100 })} />
                </div>
                <div className="flex items-center gap-3">
                  <label className="text-sm font-medium">Color</label>
                  <input
                    type="color"
                    value={activeLayer.color}
                    onChange={e => updateLayer(activeLayer.id, { color: e.target.value })}
                    className="w-10 h-9 rounded cursor-pointer border border-border"
                  />
                  <span className="font-mono text-sm text-muted-foreground">{activeLayer.color.toUpperCase()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Inset</label>
                  <Switch
                    checked={activeLayer.inset}
                    onCheckedChange={(v) => updateLayer(activeLayer.id, { inset: v })}
                    data-testid="shadow-inset-toggle"
                  />
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
