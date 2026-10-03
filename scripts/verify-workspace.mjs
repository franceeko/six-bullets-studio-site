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
  "public/_headers",
  "public/theme-init.js",
].forEach(requireFile);

if (existsSync(join(root, ".npmrc"))) failures.push("repository .npmrc should not override global npm behavior");
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
if (!cspellFileTypes || cspellFileTypes.typescript !== false || cspellFileTypes.typescriptreact !== false) {
  failures.push("Code Spell Checker should be disabled for TypeScript to avoid code/config false positives");
}

const packageJson = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));
for (const script of ["test", "check", "check:syntax", "verify:workspace"]) {
  if (!packageJson.scripts?.[script]) failures.push(`package.json is missing ${script}`);
}
if (packageJson.devDependencies?.["eslint-plugin-prettier"]) {
  failures.push("eslint-plugin-prettier is redundant with the workspace Prettier formatter");
}

if (!packageJson.scripts?.audit) failures.push("package.json is missing audit script");

const securitySource = readFileSync(join(root, "src/lib/security-headers.ts"), "utf8");
for (const token of ["Content-Security-Policy", "X-Frame-Options", "X-Content-Type-Options", "Referrer-Policy"]) {
  if (!securitySource.includes(token)) failures.push(`security header is missing: ${token}`);
}
const publicHeaders = readFileSync(join(root, "public/_headers"), "utf8");
if (/(?:^|;)\s*script-src\s+[^;]*unsafe-inline/.test(publicHeaders)) failures.push("static CSP must not allow unsafe-inline scripts");
if (!publicHeaders.includes("style-src-attr 'unsafe-inline'")) failures.push("static CSP should scope inline styles to style attributes");

const viteSource = readFileSync(join(root, "vite.config.ts"), "utf8");
if (!viteSource.includes("sourcemap: false")) failures.push("production source maps must remain disabled");

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
