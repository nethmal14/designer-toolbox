import { useState } from "react";
import { Copy, Check, Shuffle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

const BLOB_PRESETS = [
  { name: "Rounded", value: "30% 70% 70% 30% / 30% 30% 70% 70%" },
  { name: "Blob 1", value: "60% 40% 30% 70% / 60% 30% 70% 40%" },
  { name: "Blob 2", value: "40% 60% 70% 30% / 40% 50% 60% 50%" },
  { name: "Squircle", value: "50% 50% 50% 50% / 50% 50% 50% 50%" },
  { name: "Leaf", value: "0% 100% 100% 0% / 0% 0% 100% 100%" },
  { name: "Lopsided", value: "70% 30% 60% 40% / 50% 50% 50% 50%" },
  { name: "Asymmetric", value: "20% 80% 40% 60% / 70% 30% 60% 40%" },
  { name: "Diamond Soft", value: "50% 50% 50% 50% / 30% 70% 30% 70%" },
];

function randomBlobRadius() {
  const rand = () => Math.floor(Math.random() * 80) + 10;
  return `${rand()}% ${100 - rand()}% ${rand()}% ${100 - rand()}% / ${rand()}% ${rand()}% ${100 - rand()}% ${100 - rand()}%`;
}

export default function BorderRadius() {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const [shapeColor, setShapeColor] = useState("#6366f1");

  const [tl, setTl] = useState(12);
  const [tr, setTr] = useState(12);
  const [br, setBr] = useState(12);
  const [bl, setBl] = useState(12);

  const [blobValue, setBlobValue] = useState(BLOB_PRESETS[0].value);

  const cornerCSS = `border-radius: ${tl}px ${tr}px ${br}px ${bl}px;`;
  const blobCSS = `border-radius: ${blobValue};`;

  const copy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast({ title: "Copied!", description: "CSS copied to clipboard." });
    setTimeout(() => setCopied(false), 2000);
  };

  const randomize = () => setBlobValue(randomBlobRadius());

  return (
    <div className="container mx-auto max-w-screen-xl px-4 md:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Border Radius</h1>
        <p className="text-muted-foreground">Build custom shapes and organic blobs with CSS border-radius.</p>
      </div>

      <Tabs defaultValue="corners">
        <TabsList className="mb-8">
          <TabsTrigger value="corners">Corner Control</TabsTrigger>
          <TabsTrigger value="blob">Blob Mode</TabsTrigger>
        </TabsList>

        <TabsContent value="corners">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="flex items-center justify-center h-80 rounded-2xl bg-muted">
              <div
                className="w-52 h-52 transition-all duration-200"
                style={{
                  borderRadius: `${tl}px ${tr}px ${br}px ${bl}px`,
                  background: shapeColor,
                }}
              />
            </div>

            <div className="space-y-5">
              <Card>
                <CardContent className="p-6 space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-3 block text-muted-foreground">Top Left — {tl}px</label>
                      <Slider min={0} max={200} step={1} value={[tl]} onValueChange={([v]) => setTl(v)} />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-3 block text-muted-foreground">Top Right — {tr}px</label>
                      <Slider min={0} max={200} step={1} value={[tr]} onValueChange={([v]) => setTr(v)} />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-3 block text-muted-foreground">Bottom Left — {bl}px</label>
                      <Slider min={0} max={200} step={1} value={[bl]} onValueChange={([v]) => setBl(v)} />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-3 block text-muted-foreground">Bottom Right — {br}px</label>
                      <Slider min={0} max={200} step={1} value={[br]} onValueChange={([v]) => setBr(v)} />
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <label className="text-sm font-medium">Color</label>
                    <input type="color" value={shapeColor} onChange={e => setShapeColor(e.target.value)} className="w-10 h-9 rounded cursor-pointer border border-border" />
                    <span className="font-mono text-sm text-muted-foreground">{shapeColor.toUpperCase()}</span>
                  </div>

                  <div className="pt-2">
                    <div className="bg-muted rounded-lg p-3 font-mono text-sm text-muted-foreground mb-3">
                      {cornerCSS}
                    </div>
                    <Button
                      data-testid="copy-corner-css"
                      onClick={() => copy(cornerCSS)}
                      className="w-full"
                    >
                      {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                      Copy CSS
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="blob">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="flex items-center justify-center h-80 rounded-2xl bg-muted">
              <div
                className="w-52 h-52 transition-all duration-500"
                style={{
                  borderRadius: blobValue,
                  background: shapeColor,
                }}
              />
            </div>

            <div className="space-y-5">
              <Card>
                <CardContent className="p-6 space-y-5">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3 block">Presets</label>
                    <div className="grid grid-cols-4 gap-2">
                      {BLOB_PRESETS.map((preset) => (
                        <button
                          key={preset.name}
                          data-testid={`blob-preset-${preset.name.toLowerCase().replace(" ", "-")}`}
                          onClick={() => setBlobValue(preset.value)}
                          className={`relative h-12 flex items-center justify-center transition-colors rounded-lg ${
                            blobValue === preset.value ? "ring-2 ring-primary" : "hover:bg-muted"
                          }`}
                        >
                          <div
                            className="w-7 h-7"
                            style={{ borderRadius: preset.value, background: shapeColor }}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <label className="text-sm font-medium">Color</label>
                    <input type="color" value={shapeColor} onChange={e => setShapeColor(e.target.value)} className="w-10 h-9 rounded cursor-pointer border border-border" />
                    <span className="font-mono text-sm text-muted-foreground">{shapeColor.toUpperCase()}</span>
                  </div>

                  <Button
                    data-testid="randomize-blob"
                    variant="outline"
                    onClick={randomize}
                    className="w-full"
                  >
                    <Shuffle className="w-4 h-4 mr-2" /> Randomize
                  </Button>

                  <div>
                    <div className="bg-muted rounded-lg p-3 font-mono text-xs text-muted-foreground mb-3 break-all">
                      {blobCSS}
                    </div>
                    <Button
                      data-testid="copy-blob-css"
                      onClick={() => copy(blobCSS)}
                      className="w-full"
                    >
                      {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                      Copy CSS
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
