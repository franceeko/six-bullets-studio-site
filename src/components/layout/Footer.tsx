export function Footer() {
  return (
    <footer className="relative py-6">
      <div className="relative mx-auto flex w-full max-w-[1400px] items-end justify-between gap-3 px-6 font-mono text-[9px] uppercase text-ink/70 lg:px-12">
        <div className="flex items-center gap-3">
          <span
            className="text-2xl normal-case leading-none tracking-normal text-ink"
            style={{ fontFamily: "var(--font-script)" }}
          >
            six bullets
          </span>
          <span className="hidden md:inline">· © {new Date().getFullYear()}</span>
        </div>
        <div className="text-right">An independent creative studio</div>
      </div>
    </footer>
  );
}
