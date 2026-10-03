import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join, relative, resolve } from "node:path";
import ts from "typescript";

const root = resolve(process.cwd());
const sourceRoots = ["src", "tests", "scripts"];
const extensions = new Set([".ts", ".tsx", ".js", ".mjs"]);
const files = [];

function walk(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const fullPath = join(directory, entry.name);
    if (entry.isDirectory()) {
      if (!["node_modules", "dist", ".output", ".vinxi"].includes(entry.name)) walk(fullPath);
      continue;
    }
    if (extensions.has(entry.name.slice(entry.name.lastIndexOf(".")))) files.push(fullPath);
  }
}

for (const sourceRoot of sourceRoots) {
  const directory = join(root, sourceRoot);
  if (existsSync(directory)) walk(directory);
}

const configFiles = ["vite.config.ts", "eslint.config.js"]
  .map((file) => join(root, file))
  .filter(existsSync);
files.push(...configFiles);

const parseKind = (file) => {
  const ext = file.slice(file.lastIndexOf("."));
  return ext === ".tsx" ? ts.ScriptKind.TSX : ext === ".ts" ? ts.ScriptKind.TS : ts.ScriptKind.JS;
};

const errors = [];
for (const file of files.sort()) {
  const source = readFileSync(file, "utf8");
  const result = ts.transpileModule(source, {
    fileName: file,
    reportDiagnostics: true,
    compilerOptions: {
      jsx: ts.JsxEmit.ReactJSX,
      target: ts.ScriptTarget.ES2022,
      module: ts.ModuleKind.ESNext,
      moduleResolution: ts.ModuleResolutionKind.Bundler,
      allowJs: true,
      allowImportingTsExtensions: true,
    },
  });

  for (const diagnostic of result.diagnostics ?? []) {
    const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n");
    const start = diagnostic.file?.getLineAndCharacterOfPosition(diagnostic.start ?? 0);
    const location = start ? `${relative(root, file)}:${start.line + 1}:${start.character + 1}` : relative(root, file);
    errors.push(`${location} — ${message}`);
  }
}

if (errors.length) {
  console.error(`Syntax check failed with ${errors.length} error(s):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Syntax check passed: ${files.length} source/config files parsed.`);
