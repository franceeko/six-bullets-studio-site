export type PerfTier = "ultra" | "high" | "balanced" | "eco" | "minimal" | "static";

type PerfSettings = {
  octaves: number;
  maxDpr: number;
  maxPixels: number;
  fps: number;
  rich: boolean;
};

export const PERF_SETTINGS: Record<PerfTier, PerfSettings> = {
  ultra: { octaves: 6, maxDpr: 2, maxPixels: 8_000_000, fps: 60, rich: true },
  high: { octaves: 5, maxDpr: 2, maxPixels: 6_000_000, fps: 60, rich: true },
  balanced: { octaves: 4, maxDpr: 1.75, maxPixels: 4_500_000, fps: 45, rich: true },
  eco: { octaves: 4, maxDpr: 1.5, maxPixels: 2_500_000, fps: 30, rich: false },
  minimal: { octaves: 3, maxDpr: 1.25, maxPixels: 1_800_000, fps: 24, rich: false },
  static: { octaves: 0, maxDpr: 1, maxPixels: 0, fps: 0, rich: false },
};

const TIER_ORDER: PerfTier[] = ["static", "minimal", "eco", "balanced", "high", "ultra"];

export function downgrade(tier: PerfTier, floor: PerfTier = "static"): PerfTier {
  const index = TIER_ORDER.indexOf(tier);
  const floorIndex = Math.max(0, TIER_ORDER.indexOf(floor));
  if (index <= floorIndex) return tier;
  return TIER_ORDER[index - 1] ?? floor;
}

type NavigatorSignals = Navigator & {
  deviceMemory?: number;
  hardwareConcurrency?: number;
};

function gpuScore(): number {
  let gl: WebGLRenderingContext | null = null;
  try {
    const canvas = document.createElement("canvas");
    gl = canvas.getContext("webgl");
    if (!gl) return 0;

    const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
    const renderer = String(
      gl.getParameter(debugInfo?.UNMASKED_RENDERER_WEBGL ?? gl.RENDERER) ?? "",
    ).toLowerCase();

    if (/swiftshader|software|llvmpipe|basic render/.test(renderer)) return 0;
    if (/rtx|radeon rx|apple m[1-9]|geforce (gtx|rtx)/.test(renderer)) return 3;
    if (/apple a1[3-9]|adreno [6-9]|mali-g7|iris|intel arc/.test(renderer)) return 2;
    return 1;
  } catch {
    return 1;
  } finally {
    gl?.getExtension("WEBGL_lose_context")?.loseContext();
  }
}

export function detectPerfTier(): PerfTier {
  if (typeof window === "undefined") return "balanced";

  const nav = window.navigator as NavigatorSignals;
  const cores = nav.hardwareConcurrency ?? 4;
  const memory = nav.deviceMemory ?? 4;
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const narrow = window.innerWidth < 640;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduced || coarse || narrow) return "static";

  const gpu = gpuScore();
  if (gpu === 0) return "static";
  if (memory <= 2 || cores <= 2) return "minimal";
  if (cores <= 4 || memory <= 4) return "balanced";
  if (gpu >= 3 && cores >= 8) return "ultra";
  return "high";
}
