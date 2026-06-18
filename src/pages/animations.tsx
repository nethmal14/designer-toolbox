import { useState, useRef, useEffect } from "react";
import { Copy, Check, Plus, Trash2, Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

const EASINGS = [
  { name: "Linear", value: "linear" },
  { name: "Ease", value: "ease" },
  { name: "Ease In", value: "ease-in" },
  { name: "Ease Out", value: "ease-out" },
  { name: "Ease In Out", value: "ease-in-out" },
  { name: "Spring", value: "cubic-bezier(0.34,1.56,0.64,1)" },
  { name: "Bounce In", value: "cubic-bezier(0.68,-0.55,0.27,1.55)" },
  { name: "Snappy", value: "cubic-bezier(0.4,0,0.2,1)" },
  { name: "Smooth Out", value: "cubic-bezier(0,0,0.2,1)" },
  { name: "Sharp In", value: "cubic-bezier(0.4,0,1,1)" },
];

const FILL_MODES = ["none", "forwards", "backwards", "both"];
const DIRECTIONS = ["normal", "reverse", "alternate", "alternate-reverse"];

interface Keyframe {
  id: number;
  percent: number;
  opacity: number;
  translateX: number;
  translateY: number;
  rotate: number;
  scale: number;
  color: string;
}

const DEFAULT_KEYFRAMES: Keyframe[] = [
  { id: 1, percent: 0, opacity: 0, translateX: -20, translateY: 0, rotate: 0, scale: 0.9, color: "#6366f1" },
  { id: 2, percent: 100, opacity: 1, translateX: 0, translateY: 0, rotate: 0, scale: 1, color: "#ec4899" },
];

const PRESETS: { name: string; keyframes: Omit<Keyframe, "id">[]; duration: number; easing: string; description: string }[] = [
  {
    name: "Fade In Up",
    description: "Classic entrance fade",
    duration: 600,
    easing: "ease-out",
    keyframes: [
      { percent: 0, opacity: 0, translateX: 0, translateY: 20, rotate: 0, scale: 1, color: "#6366f1" },
      { percent: 100, opacity: 1, translateX: 0, translateY: 0, rotate: 0, scale: 1, color: "#6366f1" },
    ],
  },
  {
    name: "Pop In",
    description: "Scale + spring bounce",
    duration: 500,
    easing: "cubic-bezier(0.34,1.56,0.64,1)",
    keyframes: [
      { percent: 0, opacity: 0, translateX: 0, translateY: 0, rotate: 0, scale: 0.5, color: "#6366f1" },
      { percent: 100, opacity: 1, translateX: 0, translateY: 0, rotate: 0, scale: 1, color: "#6366f1" },
    ],
  },
  {
    name: "Slide In Left",
    description: "Horizontal slide entrance",
    duration: 500,
    easing: "cubic-bezier(0.4,0,0.2,1)",
    keyframes: [
      { percent: 0, opacity: 0, translateX: -60, translateY: 0, rotate: 0, scale: 1, color: "#6366f1" },
      { percent: 100, opacity: 1, translateX: 0, translateY: 0, rotate: 0, scale: 1, color: "#6366f1" },
    ],
  },
  {
    name: "Spin & Scale",
    description: "Rotating zoom in",
    duration: 700,
    easing: "ease-out",
    keyframes: [
      { percent: 0, opacity: 0, translateX: 0, translateY: 0, rotate: -180, scale: 0.3, color: "#6366f1" },
      { percent: 100, opacity: 1, translateX: 0, translateY: 0, rotate: 0, scale: 1, color: "#6366f1" },
    ],
  },
  {
    name: "Pulse",
    description: "Breathing scale loop",
    duration: 1000,
    easing: "ease-in-out",
    keyframes: [
      { percent: 0, opacity: 1, translateX: 0, translateY: 0, rotate: 0, scale: 1, color: "#6366f1" },
      { percent: 50, opacity: 1, translateX: 0, translateY: 0, rotate: 0, scale: 1.12, color: "#6366f1" },
      { percent: 100, opacity: 1, translateX: 0, translateY: 0, rotate: 0, scale: 1, color: "#6366f1" },
    ],
  },
  {
    name: "Shake",
    description: "Horizontal attention shake",
    duration: 600,
    easing: "ease-in-out",
    keyframes: [
      { percent: 0, opacity: 1, translateX: 0, translateY: 0, rotate: 0, scale: 1, color: "#6366f1" },
      { percent: 20, opacity: 1, translateX: -10, translateY: 0, rotate: -3, scale: 1, color: "#6366f1" },
      { percent: 40, opacity: 1, translateX: 10, translateY: 0, rotate: 3, scale: 1, color: "#6366f1" },
      { percent: 60, opacity: 1, translateX: -8, translateY: 0, rotate: -2, scale: 1, color: "#6366f1" },
      { percent: 80, opacity: 1, translateX: 8, translateY: 0, rotate: 2, scale: 1, color: "#6366f1" },
      { percent: 100, opacity: 1, translateX: 0, translateY: 0, rotate: 0, scale: 1, color: "#6366f1" },
    ],
  },
  {
    name: "Float",
    description: "Gentle vertical float loop",
    duration: 2000,
    easing: "ease-in-out",
    keyframes: [
      { percent: 0, opacity: 1, translateX: 0, translateY: 0, rotate: 0, scale: 1, color: "#6366f1" },
      { percent: 50, opacity: 1, translateX: 0, translateY: -12, rotate: 0, scale: 1, color: "#6366f1" },
      { percent: 100, opacity: 1, translateX: 0, translateY: 0, rotate: 0, scale: 1, color: "#6366f1" },
    ],
  },
  {
    name: "Color Shift",
    description: "Hue-shifting color loop",
    duration: 1500,
    easing: "linear",
    keyframes: [
      { percent: 0, opacity: 1, translateX: 0, translateY: 0, rotate: 0, scale: 1, color: "#6366f1" },
      { percent: 33, opacity: 1, translateX: 0, translateY: 0, rotate: 0, scale: 1, color: "#ec4899" },
      { percent: 66, opacity: 1, translateX: 0, translateY: 0, rotate: 0, scale: 1, color: "#f59e0b" },
      { percent: 100, opacity: 1, translateX: 0, translateY: 0, rotate: 0, scale: 1, color: "#6366f1" },
    ],
  },
];

function buildCSS(name: string, keyframes: Keyframe[], duration: number, easing: string, delay: number, iterations: string, direction: string, fillMode: string): string {
  const sorted = [...keyframes].sort((a, b) => a.percent - b.percent);
  const kfLines = sorted.map(kf => {
    const transform = `translate(${kf.translateX}px, ${kf.translateY}px) rotate(${kf.rotate}deg) scale(${kf.scale})`;
    return `  ${kf.percent}% {\n    opacity: ${kf.opacity};\n    transform: ${transform};\n    background-color: ${kf.color};\n  }`;
  }).join("\n");

  const animName = name.toLowerCase().replace(/\s+/g, "-");

  return `@keyframes ${animName} {\n${kfLines}\n}\n\n.${animName} {\n  animation: ${animName} ${duration}ms ${easing} ${delay}ms ${iterations} ${direction} ${fillMode};\n}`;
}

function buildInlineStyle(keyframe: Keyframe): React.CSSProperties {
  return {
    opacity: keyframe.opacity,
    transform: `translate(${keyframe.translateX}px, ${keyframe.translateY}px) rotate(${keyframe.rotate}deg) scale(${keyframe.scale})`,
    backgroundColor: keyframe.color,
  };
}

let idCounter = 10;

export default function Animations() {
  const { toast } = useToast();
  const [animName, setAnimName] = useState("my-animation");
  const [keyframes, setKeyframes] = useState<Keyframe[]>(DEFAULT_KEYFRAMES);
  const [selected, setSelected] = useState(0);
  const [duration, setDuration] = useState(600);
  const [delay, setDelay] = useState(0);
  const [easing, setEasing] = useState("ease-out");
  const [iterations, setIterations] = useState("1");
  const [direction, setDirection] = useState("normal");
  const [fillMode, setFillMode] = useState("forwards");
  const [playing, setPlaying] = useState(true);
  const [copied, setCopied] = useState(false);
  const [animKey, setAnimKey] = useState(0);

  const cssOutput = buildCSS(animName, keyframes, duration, easing, delay, iterations, direction, fillMode);
  const sorted = [...keyframes].sort((a, b) => a.percent - b.percent);
  const activeKf = keyframes[selected] ?? keyframes[0];

  const updateKf = (id: number, patch: Partial<Keyframe>) => {
    setKeyframes(prev => prev.map(k => k.id === id ? { ...k, ...patch } : k));
  };

  const addKeyframe = () => {
    const usedPercents = keyframes.map(k => k.percent);
    let pct = 50;
    while (usedPercents.includes(pct)) pct = Math.min(pct + 10, 99);
    const newKf: Keyframe = { id: ++idCounter, percent: pct, opacity: 1, translateX: 0, translateY: 0, rotate: 0, scale: 1, color: "#6366f1" };
    setKeyframes(prev => [...prev, newKf]);
    setSelected(keyframes.length);
  };

  const removeKeyframe = (id: number) => {
    if (keyframes.length <= 2) return;
    const idx = keyframes.findIndex(k => k.id === id);
    setKeyframes(prev => prev.filter(k => k.id !== id));
    setSelected(Math.max(0, idx - 1));
  };

  const replay = () => {
    setPlaying(false);
    setTimeout(() => { setPlaying(true); setAnimKey(k => k + 1); }, 50);
  };

  const applyPreset = (p: typeof PRESETS[0]) => {
    setAnimName(p.name.toLowerCase().replace(/\s+/g, "-"));
    setDuration(p.duration);
    setEasing(p.easing);
    setKeyframes(p.keyframes.map((kf, i) => ({ ...kf, id: ++idCounter })));
    setSelected(0);
    setAnimKey(k => k + 1);
  };

  const copy = () => {
    navigator.clipboard.writeText(cssOutput);
    setCopied(true);
    toast({ title: "Copied!", description: "Animation CSS copied to clipboard." });
    setTimeout(() => setCopied(false), 2000);
  };

  const animStyle = playing ? {
    animationName: animName.toLowerCase().replace(/\s+/g, "-"),
    animationDuration: `${duration}ms`,
    animationTimingFunction: easing,
    animationDelay: `${delay}ms`,
    animationIterationCount: iterations === "inf" ? "infinite" : iterations,
    animationDirection: direction,
    animationFillMode: fillMode,
  } : {};

  return (
    <div className="container mx-auto max-w-screen-xl px-4 md:px-8 py-8">
      <style>{`
        @keyframes ${animName.toLowerCase().replace(/\s+/g, "-")} {
          ${sorted.map(kf => {
            const transform = `translate(${kf.translateX}px, ${kf.translateY}px) rotate(${kf.rotate}deg) scale(${kf.scale})`;
            return `${kf.percent}% { opacity: ${kf.opacity}; transform: ${transform}; background-color: ${kf.color}; }`;
          }).join(" ")}
        }
      `}</style>

      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">CSS Animations</h1>
        <p className="text-muted-foreground">Build keyframe animations visually with a live preview.</p>
      </div>

      <Tabs defaultValue="builder">
        <TabsList className="mb-8">
          <TabsTrigger value="builder">Builder</TabsTrigger>
          <TabsTrigger value="presets">Presets ({PRESETS.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="builder">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-3 space-y-5">
              <div className="h-56 rounded-2xl border border-border bg-muted flex items-center justify-center overflow-hidden">
                <div
                  key={animKey}
                  className="w-20 h-20 rounded-2xl"
                  style={animStyle}
                />
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={replay}>
                  <Play className="w-3.5 h-3.5 mr-1.5" /> Replay
                </Button>
                <div className="flex-1 relative">
                  <input
                    value={animName}
                    onChange={e => setAnimName(e.target.value.replace(/\s+/g, "-"))}
                    className="w-full h-9 px-3 text-sm font-mono bg-muted border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    placeholder="animation-name"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium">Keyframes</span>
                  <Button size="sm" variant="outline" onClick={addKeyframe}>
                    <Plus className="w-3.5 h-3.5 mr-1" /> Add Stop
                  </Button>
                </div>

                <div className="relative h-10 bg-muted rounded-xl border border-border mb-3 overflow-visible">
                  {sorted.map((kf, i) => (
                    <button
                      key={kf.id}
                      onClick={() => setSelected(keyframes.findIndex(k => k.id === kf.id))}
                      className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-5 h-5 rounded-full border-2 transition-all hover:scale-110 ${
                        keyframes[selected]?.id === kf.id ? "border-primary scale-110 z-10" : "border-border"
                      }`}
                      style={{ left: `${kf.percent}%`, backgroundColor: kf.color }}
                      title={`${kf.percent}%`}
                    />
                  ))}
                </div>

                <div className="flex gap-2 flex-wrap">
                  {sorted.map((kf, i) => {
                    const idx = keyframes.findIndex(k => k.id === kf.id);
                    return (
                      <button
                        key={kf.id}
                        onClick={() => setSelected(idx)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono border transition-colors ${
                          selected === idx ? "border-primary text-primary bg-primary/10" : "border-border text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        <span className="w-2.5 h-2.5 rounded-full inline-block shrink-0" style={{ backgroundColor: kf.color }} />
                        {kf.percent}%
                        {keyframes.length > 2 && (
                          <span
                            onClick={e => { e.stopPropagation(); removeKeyframe(kf.id); }}
                            className="ml-0.5 hover:text-destructive"
                          >
                            <Trash2 className="w-3 h-3" />
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {activeKf && (
                <Card>
                  <CardContent className="p-5 space-y-4">
                    <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                      Keyframe at {activeKf.percent}%
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-3 block">Position — {activeKf.percent}%</label>
                      <Slider
                        min={0} max={100} step={1}
                        value={[activeKf.percent]}
                        onValueChange={([v]) => updateKf(activeKf.id, { percent: v })}
                        disabled={activeKf.percent === 0 || activeKf.percent === 100}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-3 block">Opacity — {activeKf.opacity}</label>
                        <Slider min={0} max={1} step={0.05} value={[activeKf.opacity]} onValueChange={([v]) => updateKf(activeKf.id, { opacity: parseFloat(v.toFixed(2)) })} />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-3 block">Scale — {activeKf.scale}</label>
                        <Slider min={0} max={2} step={0.05} value={[activeKf.scale]} onValueChange={([v]) => updateKf(activeKf.id, { scale: parseFloat(v.toFixed(2)) })} />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-3 block">X — {activeKf.translateX}px</label>
                        <Slider min={-100} max={100} step={1} value={[activeKf.translateX]} onValueChange={([v]) => updateKf(activeKf.id, { translateX: v })} />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-3 block">Y — {activeKf.translateY}px</label>
                        <Slider min={-100} max={100} step={1} value={[activeKf.translateY]} onValueChange={([v]) => updateKf(activeKf.id, { translateY: v })} />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-3 block">Rotate — {activeKf.rotate}°</label>
                        <Slider min={-360} max={360} step={1} value={[activeKf.rotate]} onValueChange={([v]) => updateKf(activeKf.id, { rotate: v })} />
                      </div>
                      <div className="flex items-center gap-3">
                        <label className="text-sm font-medium">Color</label>
                        <input type="color" value={activeKf.color} onChange={e => updateKf(activeKf.id, { color: e.target.value })} className="w-10 h-9 rounded cursor-pointer border border-border" />
                        <span className="font-mono text-xs text-muted-foreground">{activeKf.color.toUpperCase()}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            <div className="lg:col-span-2 space-y-5">
              <Card>
                <CardContent className="p-5 space-y-5">
                  <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Timing</div>

                  <div>
                    <label className="text-sm font-medium mb-3 block">Duration — {duration}ms</label>
                    <Slider min={100} max={5000} step={50} value={[duration]} onValueChange={([v]) => setDuration(v)} />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-3 block">Delay — {delay}ms</label>
                    <Slider min={0} max={2000} step={50} value={[delay]} onValueChange={([v]) => setDelay(v)} />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Easing</label>
                    <Select value={easing} onValueChange={setEasing}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {EASINGS.map(e => <SelectItem key={e.name} value={e.value}>{e.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Iterations</label>
                    <div className="flex gap-2 flex-wrap">
                      {["1", "2", "3", "inf"].map(v => (
                        <button
                          key={v}
                          onClick={() => setIterations(v)}
                          className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${
                            iterations === v ? "border-primary text-primary bg-primary/10" : "border-border text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          {v === "inf" ? "∞" : v}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Direction</label>
                    <Select value={direction} onValueChange={setDirection}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {DIRECTIONS.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Fill Mode</label>
                    <div className="flex gap-2 flex-wrap">
                      {FILL_MODES.map(v => (
                        <button
                          key={v}
                          onClick={() => setFillMode(v)}
                          className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${
                            fillMode === v ? "border-primary text-primary bg-primary/10" : "border-border text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          {v}
                        </button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <pre className="text-xs font-mono text-muted-foreground whitespace-pre-wrap break-all leading-relaxed overflow-auto max-h-52">{cssOutput}</pre>
                </CardContent>
              </Card>

              <Button data-testid="copy-animation-css" onClick={copy} className="w-full">
                {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                Copy CSS
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="presets">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {PRESETS.map((preset, i) => (
              <div
                key={preset.name}
                className="group rounded-xl border border-border hover:border-primary transition-all cursor-pointer overflow-hidden"
                onClick={() => applyPreset(preset)}
                data-testid={`anim-preset-${i}`}
              >
                <div className="h-32 bg-muted flex items-center justify-center">
                  <div
                    className="w-14 h-14 rounded-xl"
                    style={{
                      backgroundColor: preset.keyframes[0]?.color ?? "#6366f1",
                      animation: `preset-${i} ${preset.duration}ms ${preset.easing} infinite alternate`,
                    }}
                  />
                  <style>{`
                    @keyframes preset-${i} {
                      ${preset.keyframes.map(kf =>
                        `${kf.percent}% { opacity: ${kf.opacity}; transform: translate(${kf.translateX}px,${kf.translateY}px) rotate(${kf.rotate}deg) scale(${kf.scale}); background-color: ${kf.color}; }`
                      ).join(" ")}
                    }
                  `}</style>
                </div>
                <div className="p-4 bg-card">
                  <p className="font-medium text-sm">{preset.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{preset.description}</p>
                  <p className="text-xs text-primary mt-2 opacity-0 group-hover:opacity-100 transition-opacity font-medium">Click to load</p>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
