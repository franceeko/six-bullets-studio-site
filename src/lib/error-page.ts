export function renderErrorPage(): string {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>This page didn't load</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      :root { color-scheme: light dark; }
      body { font: 15px/1.5 system-ui, -apple-system, sans-serif; background: #fafafa; color: #111; display: grid; place-items: center; min-height: 100vh; margin: 0; padding: 1.5rem; }
      @media (prefers-color-scheme: dark) { body { background: #151413; color: #f5f2ec; } }
      .card { max-width: 28rem; width: 100%; text-align: center; padding: 2rem; }
      h1 { font-size: 1.25rem; margin: 0 0 0.5rem; }
      p { color: #4b5563; margin: 0 0 1.5rem; }
      @media (prefers-color-scheme: dark) { p { color: #c4c0b8; } }
      .actions { display: flex; gap: 0.5rem; justify-content: center; flex-wrap: wrap; }
      a { padding: 0.5rem 1rem; border-radius: 0.375rem; font: inherit; cursor: pointer; text-decoration: none; border: 1px solid #d1d5db; background: #111; color: #fff; }
      @media (prefers-color-scheme: dark) { a { border-color: #4b5563; background: #f5f2ec; color: #151413; } }
    </style>
  </head>
  <body>
    <main class="card">
      <h1>This page didn't load</h1>
      <p>Something went wrong on our end. You can try again or head back home.</p>
      <div class="actions">
        <a href="/">Try again</a>
      </div>
    </main>
  </body>
</html>`;
}
