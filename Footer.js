export default function Footer() {
  return (
    <footer className="border-t border-white/10 py-8 px-4">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-white/20 text-[10px] tracking-[0.35em] uppercase">
          © 2025 ROBROUX — All rights reserved
        </p>
        <div className="flex items-center gap-6">
          <a
            href="https://discord.gg/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/30 hover:text-cyan-400 text-[10px] tracking-[0.25em] uppercase transition-colors duration-200"
          >
            ◆ Discord
          </a>
          <a
            href="https://twitter.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/30 hover:text-cyan-400 text-[10px] tracking-[0.25em] uppercase transition-colors duration-200"
          >
            ◆ Twitter / X
          </a>
        </div>
      </div>
    </footer>
  );
}
