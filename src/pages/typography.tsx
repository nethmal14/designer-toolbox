import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const RATIOS = [
  { name: "Minor Second", value: 1.067 },
  { name: "Major Second", value: 1.125 },
  { name: "Minor Third", value: 1.2 },
  { name: "Major Third", value: 1.25 },
  { name: "Perfect Fourth", value: 1.333 },
  { name: "Augmented Fourth", value: 1.414 },
  { name: "Perfect Fifth", value: 1.5 },
  { name: "Golden Ratio", value: 1.618 },
];

const FONT_CATEGORIES: Record<string, string[]> = {
  "Sans Serif": [
    "Inter", "Roboto", "Open Sans", "Lato", "Montserrat", "Poppins",
    "DM Sans", "Outfit", "Nunito", "Work Sans", "Rubik", "Plus Jakarta Sans",
    "Figtree", "Geist", "IBM Plex Sans", "Source Sans 3",
  ],
  "Serif": [
    "Playfair Display", "Lora", "Merriweather", "PT Serif", "Libre Baskerville",
    "EB Garamond", "Cormorant Garamond", "DM Serif Display", "Fraunces",
  ],
  "Display": [
    "Space Grotesk", "Syne", "Clash Display", "Bebas Neue", "Oswald",
    "Raleway", "Josefin Sans", "Righteous",
  ],
  "Monospace": [
    "Source Code Pro", "JetBrains Mono", "Fira Code", "IBM Plex Mono",
    "Space Mono", "Roboto Mono", "Inconsolata",
  ],
};

const ALL_FONTS = Object.values(FONT_CATEGORIES).flat();

const WEIGHTS = [100, 200, 300, 400, 500, 600, 700, 800, 900];
const WEIGHT_NAMES: Record<number, string> = {
  100: "Thin", 200: "Extra Light", 300: "Light", 400: "Regular",
  500: "Medium", 600: "Semi Bold", 700: "Bold", 800: "Extra Bold", 900: "Black",
};

const SCALE_NAMES = ["xs", "sm", "base", "lg", "xl", "2xl", "3xl", "4xl", "5xl", "6xl"];

function generateScale(base: number, ratio: number) {
  return SCALE_NAMES.map((name, i) => {
    const steps = i - 2;
    const rem = (base * Math.pow(ratio, steps)) / 16;
    return { name, rem: parseFloat(rem.toFixed(3)), px: Math.round(rem * 16) };
  });
}

const PREVIEW_TEXTS = [
  "The quick brown fox jumps over the lazy dog",
  "Design is intelligence made visible",
  "Typography is the craft of enduring visual communication",
  "Good design is obvious. Great design is transparent.",
  "ABCDEFGHIJKLMNOPQRSTUVWXYZ 0123456789",
];

export default function Typography() {
  const { toast } = useToast();
  const [baseSize, setBaseSize] = useState(16);
  const [ratio, setRatio] = useState(1.25);
  const [selectedFont, setSelectedFont] = useState("Inter");
  const [selectedCategory, setSelectedCategory] = useState("Sans Serif");
  const [weight, setWeight] = useState(400);
  const [lineHeight, setLineHeight] = useState(1.5);
  const [letterSpacing, setLetterSpacing] = useState(0);
  const [previewText, setPreviewText] = useState(PREVIEW_TEXTS[0]);
  const [showAllWeights, setShowAllWeights] = useState(false);
  const [copied, setCopied] = useState<"vars" | "full" | null>(null);

  const scale = generateScale(baseSize, ratio);

  const loadFont = (font: string) => {
    setSelectedFont(font);
    const existing = document.getElementById(`font-${font}`);
    if (!existing) {
      const link = document.createElement("link");
      link.id = `font-${font}`;
      link.rel = "stylesheet";
      link.href = `https://fonts.googleapis.com/css2?family=${font.replace(/ /g, "+")}:wght@100;200;300;400;500;600;700;800;900&display=swap`;
      document.head.appendChild(link);
    }
  };

  const cssVars = scale.map(s => `  --text-${s.name}: ${s.rem}rem;`).join("\n");
  const cssVarsOutput = `:root {\n${cssVars}\n}`;
  const fullCSSOutput = `:root {\n  --font-sans: '${selectedFont}', sans-serif;\n  --font-weight: ${weight};\n  --line-height: ${lineHeight};\n  --letter-spacing: ${letterSpacing}em;\n\n${cssVars}\n}\n\nbody {\n  font-family: var(--font-sans);\n  font-weight: var(--font-weight);\n  line-height: var(--line-height);\n  letter-spacing: var(--letter-spacing);\n  font-size: ${baseSize}px;\n}`;

  const copy = (type: "vars" | "full") => {
    navigator.clipboard.writeText(type === "vars" ? cssVarsOutput : fullCSSOutput);
    setCopied(type);
    toast({ title: "Copied!", description: "CSS copied to clipboard." });
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="container mx-auto max-w-screen-xl px-4 md:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Type Scale</h1>
        <p className="text-muted-foreground">Generate a harmonious typographic scale with full font and style controls.</p>
      </div>

      <Tabs defaultValue="scale">
        <TabsList className="mb-8">
          <TabsTrigger value="scale">Scale Preview</TabsTrigger>
          <TabsTrigger value="specimen">Font Specimen</TabsTrigger>
          <TabsTrigger value="weights">Weight Showcase</TabsTrigger>
        </TabsList>

        <TabsContent value="scale">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="space-y-5">
              <Card>
                <CardContent className="p-6 space-y-5">
                  <div>
                    <label className="text-sm font-medium mb-3 block">Base Size — {baseSize}px</label>
                    <Slider min={12} max={24} step={1} value={[baseSize]} onValueChange={([v]) => setBaseSize(v)} />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Scale Ratio</label>
                    <Select value={String(ratio)} onValueChange={v => setRatio(Number(v))}>
                      <SelectTrigger data-testid="ratio-select"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {RATIOS.map(r => (
                          <SelectItem key={r.name} value={String(r.value)}>{r.name} ({r.value})</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Category</label>
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {Object.keys(FONT_CATEGORIES).map(cat => (
                        <button
                          key={cat}
                          onClick={() => setSelectedCategory(cat)}
                          className={`px-2.5 py-1 text-xs rounded-md border transition-colors ${
                            selectedCategory === cat ? "border-primary text-primary bg-primary/10" : "border-border text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                    <Select value={selectedFont} onValueChange={loadFont}>
                      <SelectTrigger data-testid="font-select"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {FONT_CATEGORIES[selectedCategory].map(f => (
                          <SelectItem key={f} value={f}>{f}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Weight — {WEIGHT_NAMES[weight]}</label>
                    <Select value={String(weight)} onValueChange={v => setWeight(Number(v))}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {WEIGHTS.map(w => (
                          <SelectItem key={w} value={String(w)}>{w} — {WEIGHT_NAMES[w]}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-3 block">Line Height — {lineHeight}</label>
                    <Slider min={1} max={2.5} step={0.05} value={[lineHeight]} onValueChange={([v]) => setLineHeight(parseFloat(v.toFixed(2)))} />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-3 block">Letter Spacing — {letterSpacing}em</label>
                    <Slider min={-0.1} max={0.3} step={0.01} value={[letterSpacing]} onValueChange={([v]) => setLetterSpacing(parseFloat(v.toFixed(2)))} />
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" onClick={() => copy("vars")}>
                  {copied === "vars" ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                  Scale Vars
                </Button>
                <Button onClick={() => copy("full")}>
                  {copied === "full" ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                  Full CSS
                </Button>
              </div>

              <Card>
                <CardContent className="p-4">
                  <pre className="text-xs font-mono text-muted-foreground whitespace-pre-wrap leading-relaxed overflow-auto max-h-48">{cssVarsOutput}</pre>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-2">
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-3">
                    {[...scale].reverse().map((step, i) => (
                      <div
                        key={step.name}
                        data-testid={`type-scale-${step.name}`}
                        className="flex items-baseline gap-4 pb-3 border-b border-border/50 last:border-0"
                      >
                        <div className="w-20 shrink-0 text-right">
                          <span className="text-xs font-mono text-muted-foreground block">{step.name}</span>
                          <span className="text-xs font-mono text-muted-foreground/50">{step.px}px</span>
                        </div>
                        <div
                          className="flex-1 truncate text-foreground"
                          style={{
                            fontSize: `${step.rem}rem`,
                            fontFamily: `'${selectedFont}', sans-serif`,
                            fontWeight: weight,
                            lineHeight,
                            letterSpacing: `${letterSpacing}em`,
                          }}
                        >
                          The quick brown fox
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="specimen">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="space-y-4">
              <Card>
                <CardContent className="p-5 space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Font</label>
                    <Select value={selectedFont} onValueChange={loadFont}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {ALL_FONTS.map(f => (
                          <SelectItem key={f} value={f}>{f}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Preview Text</label>
                    <Select value={previewText} onValueChange={setPreviewText}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {PREVIEW_TEXTS.map(t => (
                          <SelectItem key={t} value={t}>{t.slice(0, 30)}…</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Custom Text</label>
                    <Input
                      value={previewText}
                      onChange={e => setPreviewText(e.target.value)}
                      placeholder="Type something..."
                      className="font-sans"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-3 block">Letter Spacing — {letterSpacing}em</label>
                    <Slider min={-0.1} max={0.5} step={0.01} value={[letterSpacing]} onValueChange={([v]) => setLetterSpacing(parseFloat(v.toFixed(2)))} />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-3 block">Line Height — {lineHeight}</label>
                    <Slider min={1} max={2.5} step={0.05} value={[lineHeight]} onValueChange={([v]) => setLineHeight(parseFloat(v.toFixed(2)))} />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-3 space-y-4">
              {[72, 48, 36, 24, 18, 14].map(size => (
                <div key={size} className="pb-4 border-b border-border/50 last:border-0">
                  <span className="text-xs font-mono text-muted-foreground mb-2 block">{size}px</span>
                  <div
                    className="text-foreground leading-tight"
                    style={{
                      fontSize: `${size}px`,
                      fontFamily: `'${selectedFont}', sans-serif`,
                      fontWeight: weight,
                      lineHeight,
                      letterSpacing: `${letterSpacing}em`,
                    }}
                  >
                    {previewText}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="weights">
          <div className="mb-6 flex gap-4 items-center">
            <div className="flex-1 max-w-xs">
              <Select value={selectedFont} onValueChange={loadFont}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {ALL_FONTS.map(f => (
                    <SelectItem key={f} value={f}>{f}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm text-muted-foreground">All sizes</label>
              <Switch checked={showAllWeights} onCheckedChange={setShowAllWeights} />
            </div>
          </div>

          <Card>
            <CardContent className="p-6 divide-y divide-border/50">
              {WEIGHTS.map(w => (
                <div key={w} className="py-5 flex items-baseline gap-6">
                  <div className="w-36 shrink-0">
                    <span className="text-sm font-mono text-muted-foreground block">{w}</span>
                    <span className="text-xs text-muted-foreground/60">{WEIGHT_NAMES[w]}</span>
                  </div>
                  <div
                    className="flex-1 truncate text-foreground"
                    style={{
                      fontSize: showAllWeights ? "2rem" : "1.5rem",
                      fontFamily: `'${selectedFont}', sans-serif`,
                      fontWeight: w,
                      letterSpacing: `${letterSpacing}em`,
                    }}
                  >
                    {previewText}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
