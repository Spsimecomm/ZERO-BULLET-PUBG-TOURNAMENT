import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import Logo from './Logo';

interface NavbarProps {
  onLoginClick: () => void;
}

const links = [
  { label: 'Home', href: '#home' },
  { label: 'Tournaments', href: '#tournaments' },
  { label: 'Leaderboard', href: '#leaderboard' },
  { label: 'Rules', href: '#rules' },
];

export default function Navbar({ onLoginClick }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-ink-950/90 backdrop-blur-md border-b border-ink-600 shadow-lg shadow-black/50'
          : 'bg-transparent'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <a href="#home" className="shrink-0">
            <Logo />
          </a>

          <ul className="hidden lg:flex items-center gap-1">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="px-4 py-2 font-display font-medium uppercase tracking-wider text-sm text-gray-300 hover:text-gold-400 transition-colors duration-200 relative group"
                >
                  {l.label}
                  <span className="absolute left-4 right-4 -bottom-0.5 h-px bg-gold-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                </a>
              </li>
            ))}
          </ul>

          <div className="hidden lg:flex items-center gap-3">
            <button onClick={onLoginClick} className="btn-gold text-sm py-2.5">
              Login / Register
            </button>
          </div>

          <button
            className="lg:hidden p-2 text-gray-200 hover:text-gold-400 transition-colors"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-300 ${
          open ? 'max-h-96 border-b border-ink-600' : 'max-h-0'
        }`}
      >
        <div className="px-4 py-4 bg-ink-900/95 backdrop-blur-md space-y-1">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block px-4 py-3 font-display font-medium uppercase tracking-wider text-sm text-gray-300 hover:text-gold-400 hover:bg-ink-800 rounded-lg transition-colors"
            >
              {l.label}
            </a>
          ))}
          <button
            onClick={() => {
              setOpen(false);
              onLoginClick();
            }}
            className="btn-gold w-full mt-2"
          >
            Login / Register
          </button>
        </div>
      </div>
    </header>
  );
}
