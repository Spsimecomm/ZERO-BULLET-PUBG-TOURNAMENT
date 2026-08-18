import { Crosshair, Facebook, Youtube, Instagram, MessageCircle, Send, Mail, ShieldCheck } from 'lucide-react';
import Logo from './Logo';

const quickLinks = [
  { label: 'Home', href: '#home' },
  { label: 'Tournaments', href: '#tournaments' },
  { label: 'Leaderboard', href: '#leaderboard' },
  { label: 'Rules', href: '#rules' },
];

const socials = [
  { icon: Facebook, href: '#', label: 'Facebook' },
  { icon: Youtube, href: '#', label: 'YouTube' },
  { icon: Instagram, href: '#', label: 'Instagram' },
  { icon: MessageCircle, href: '#', label: 'Discord' },
  { icon: Send, href: '#', label: 'Telegram' },
];

export default function Footer() {
  return (
    <footer className="relative border-t border-ink-600 bg-ink-900/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-2">
            <Logo />
            <p className="mt-4 text-gray-400 max-w-sm leading-relaxed">
              ZeroBullet Tournaments is the home for competitive PUBG Mobile esports. Compete, climb the ranks, and win real prize pools.
            </p>
            <div className="mt-6 flex gap-3">
              {socials.map((s) => {
                const Icon = s.icon;
                return (
                  <a
                    key={s.label}
                    href={s.href}
                    aria-label={s.label}
                    className="grid place-items-center w-10 h-10 rounded-lg bg-ink-800 border border-ink-600 text-gray-400 hover:text-gold-400 hover:border-gold-500/50 hover:shadow-gold transition-all duration-200"
                  >
                    <Icon className="w-4.5 h-4.5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="font-display font-semibold uppercase tracking-wider text-sm text-gold-400 mb-4">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="text-gray-400 hover:text-gold-400 transition-colors text-sm">
                    {l.label}
                  </a>
                </li>
              ))}
              <li>
                <a href="#/admin" className="inline-flex items-center gap-1.5 text-gray-500 hover:text-gold-400 transition-colors text-sm">
                  <ShieldCheck className="w-3.5 h-3.5" /> Admin Panel
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-semibold uppercase tracking-wider text-sm text-gold-400 mb-4">Get In Touch</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-gold-500" />
                <a href="mailto:info@zerobullet.gg" className="hover:text-gold-400 transition-colors">info@zerobullet.gg</a>
              </li>
              <li className="flex items-center gap-2.5">
                <MessageCircle className="w-4 h-4 text-gold-500" />
                <span>Discord: ZeroBullet</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Crosshair className="w-4 h-4 text-gold-500" />
                <span>Dhaka, Bangladesh</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-ink-700 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} ZeroBullet Tournaments. All rights reserved.
          </p>
          <p className="text-xs text-gray-600 font-display uppercase tracking-wider">
            Built for the battleground
          </p>
        </div>
      </div>
    </footer>
  );
}
