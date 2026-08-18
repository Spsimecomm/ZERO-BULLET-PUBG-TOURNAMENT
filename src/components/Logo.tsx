import { Crosshair } from 'lucide-react';

interface LogoProps {
  className?: string;
}

export default function Logo({ className = '' }: LogoProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="relative grid place-items-center w-9 h-9 rounded-md bg-gold-gradient shadow-gold">
        <Crosshair className="w-5 h-5 text-ink-950" strokeWidth={2.5} />
      </div>
      <span className="font-display font-bold uppercase tracking-wider text-lg leading-none">
        <span className="text-gray-100">Zero</span>
        <span className="text-gradient-gold">Bullet</span>
      </span>
    </div>
  );
}
