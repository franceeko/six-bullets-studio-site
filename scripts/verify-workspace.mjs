import { existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";

const root = resolve(process.cwd());
const failures = [];
const requireFile = (relative) => {
  if (!existsSync(join(root, relative))) failures.push(`missing ${relative}`);
};

[
  "package.json",
  "tsconfig.json",
  "vite.config.ts",
  "src/routes/index.tsx",
  "src/routes/__root.tsx",
  "src/styles.css",
  "src/data/site.ts",
  "src/data/studio.ts",
  "src/assets/index.ts",
  "src/lib/security-headers.ts",
  "src/lib/error-capture.ts",
  "public/favicon.svg",
  "public/robots.txt",
  "public/theme-init.js",
  "vercel.json",
].forEach(requireFile);

if (existsSync(join(root, "public", "README.md")))
  failures.push("README.md must not be published from public/");
if (existsSync(join(root, "public", "package.json")))
  failures.push("package.json must not be published from public/");
if (existsSync(join(root, ".npmrc")))
  failures.push("repository .npmrc should not override global npm behavior");
if (existsSync(join(root, ".vscode/extensions.json"))) {
  failures.push("obsolete extension recommendations file remains");
}

const settings = JSON.parse(readFileSync(join(root, ".vscode/settings.json"), "utf8"));
for (const key of [
  "typescript.tsdk",
  "typescript.disableAutomaticTypeAcquisition",
  "javascript.suggest.autoImports",
  "typescript.suggest.autoImports",
]) {
  if (Object.hasOwn(settings, key)) failures.push(`deprecated VS Code setting remains: ${key}`);
}

const cspellFileTypes = settings["cSpell.enabledFileTypes"];
if (
  !cspellFileTypes ||
  cspellFileTypes.typescript !== false ||
  cspellFileTypes.typescriptreact !== false
) {
  failures.push(
    "Code Spell Checker should be disabled for TypeScript to avoid code/config false positives",
  );
}

const packageJson = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));
const packageLock = JSON.parse(readFileSync(join(root, "package-lock.json"), "utf8"));
const compareVersions = (left, right) => {
  const a = left.split(".").map(Number);
  const b = right.split(".").map(Number);
  for (let index = 0; index < Math.max(a.length, b.length); index += 1) {
    const difference = (a[index] ?? 0) - (b[index] ?? 0);
    if (difference) return Math.sign(difference);
  }
  return 0;
};
if (packageJson.dependencies?.["@tanstack/react-start"] !== "^1.168.60") {
  failures.push("TanStack Start minimum must stay at the patched XSS release (1.168.60+)");
}
if (
  compareVersions(
    packageLock.packages?.["node_modules/@tanstack/react-start"]?.version ?? "0.0.0",
    "1.168.60",
  ) < 0
) {
  failures.push("lockfile must not resolve a vulnerable TanStack Start version");
}
if (
  compareVersions(
    packageLock.packages?.["node_modules/@tanstack/start-server-core"]?.version ?? "0.0.0",
    "1.169.39",
  ) < 0
) {
  failures.push("lockfile must not resolve a vulnerable TanStack Start server-core version");
}
for (const script of [
  "test",
  "check",
  "check:syntax",
  "verify:workspace",

  "build:vercel",
  "deploy:vercel",
  "check:ci",
]) {
  if (!packageJson.scripts?.[script]) failures.push(`package.json is missing ${script}`);
}
if (packageJson.devDependencies?.["eslint-plugin-prettier"]) {
  failures.push("eslint-plugin-prettier is redundant with the workspace Prettier formatter");
}

if (!packageJson.scripts?.audit) failures.push("package.json is missing audit script");
const ciScript = packageJson.scripts?.["check:ci"] ?? "";
if (!ciScript.includes("format:check") || ciScript.includes("prettier --write")) {
  failures.push("check:ci must verify formatting without modifying workspace files");
}

const startSource = readFileSync(join(root, "src/start.ts"), "utf8");
if (
  !startSource.includes("createCsrfMiddleware") ||
  !startSource.includes('context.handlerType === "serverFn"')
) {
  failures.push("custom TanStack Start instance must keep server-function CSRF middleware enabled");
}

const securitySource = readFileSync(join(root, "src/lib/security-headers.ts"), "utf8");
for (const token of [
  "Content-Security-Policy",
  "X-Frame-Options",
  "X-Content-Type-Options",
  "Referrer-Policy",
]) {
  if (!securitySource.includes(token)) failures.push(`security header is missing: ${token}`);
}
if (existsSync(join(root, "public", "_headers")))
  failures.push("_headers must not be published from public/ for Vercel/Workers SSR");

const viteSource = readFileSync(join(root, "vite.config.ts"), "utf8");
if (!viteSource.includes("sourcemap: false"))
  failures.push("production source maps must remain disabled");
if (!viteSource.includes("nitro/vite") || viteSource.includes("@cloudflare/vite-plugin")) {
  failures.push("Vite config must target Vercel/Nitro only");
}
const vercelConfig = JSON.parse(readFileSync(join(root, "vercel.json"), "utf8"));
const nitroVersion = packageJson.dependencies?.nitro ?? packageJson.devDependencies?.nitro;
if (nitroVersion !== "3.0.260903-beta")
  failures.push("Nitro must be pinned exactly in package.json");
if (String(vercelConfig.installCommand).trim() !== "npm ci")
  failures.push("Vercel installCommand must use npm ci");

const assetSource = readFileSync(join(root, "src/assets/index.ts"), "utf8");
const assetPaths = [...assetSource.matchAll(/\/assets\/team\/[A-Za-z0-9._@-]+/g)].map((m) => m[0]);
for (const assetPath of new Set(assetPaths)) {
  requireFile(`public${assetPath}`);
}

if (failures.length) {
  console.error(`Workspace verification failed with ${failures.length} issue(s):`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exitCode = 1;
}

if (!failures.length) console.log("Workspace verification passed.");
