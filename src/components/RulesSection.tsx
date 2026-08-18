import { ScrollText, Users, Trophy, ShieldAlert, Smartphone, Gamepad2 } from 'lucide-react';

const rules = [
  {
    icon: Users,
    title: 'Team Composition',
    points: [
      'Squad mode requires exactly 4 players per team.',
      'Duo mode requires exactly 2 players per team.',
      'Solo mode is individual entry only.',
      'Substitutes allowed only before match start.',
    ],
  },
  {
    icon: Gamepad2,
    title: 'Match Rules',
    points: [
      'Matches are played in TPP (Third Person Perspective) mode.',
      'No teaming with other squads — will result in disqualification.',
      'No use of hacks, mods, or third-party tools.',
      'Emulators are not allowed — mobile devices only.',
    ],
  },
  {
    icon: Trophy,
    title: 'Scoring System',
    points: [
      '1 point per kill.',
      'Placement points: #1 = 12, #2 = 9, #3 = 8, scaling down to #15.',
      'Total points = kills + placement points.',
      'Ties broken by total kills.',
    ],
  },
  {
    icon: ShieldAlert,
    title: 'Fair Play & Penalties',
    points: [
      'Team kill (TK) results in a 5-point deduction.',
      'Leaving mid-match forfeits all points.',
      'Toxic behavior in voice chat = warning, then ban.',
      'All disputes reviewed within 24 hours.',
    ],
  },
  {
    icon: Smartphone,
    title: 'Device & Connection',
    points: [
      'Players must have a stable internet connection.',
      'PUBG Mobile latest version required.',
      'Recording gameplay is recommended for disputes.',
      'Room ID and password shared 15 minutes before start.',
    ],
  },
  {
    icon: ScrollText,
    title: 'Payment & Refunds',
    points: [
      'Entry fee is non-refundable once registration is confirmed.',
      'If a match is cancelled by organizers, full refund issued.',
      'Payment must be completed before slot is reserved.',
      'Fake transaction IDs result in permanent ban.',
    ],
  },
];

export default function RulesSection() {
  return (
    <section id="rules" className="relative py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="section-label mb-4 mx-auto">
            <ScrollText className="w-3.5 h-3.5" />
            Tournament Guidelines
          </div>
          <h2 className="font-display font-bold uppercase text-4xl lg:text-5xl tracking-tight text-gray-100">
            Rules & <span className="text-gradient-gold">Regulations</span>
          </h2>
          <p className="mt-3 text-gray-400 max-w-xl mx-auto">
            All participants must follow these rules. Violations may result in point deductions, disqualification, or permanent bans.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rules.map((rule) => {
            const Icon = rule.icon;
            return (
              <div key={rule.title} className="card-surface p-6 hover:border-gold-500/40 transition-colors">
                <div className="flex items-center gap-3 mb-4">
                  <div className="grid place-items-center w-10 h-10 rounded-lg bg-gold-500/10 border border-gold-500/30">
                    <Icon className="w-5 h-5 text-gold-400" />
                  </div>
                  <h3 className="font-display font-bold uppercase tracking-wide text-gray-100">{rule.title}</h3>
                </div>
                <ul className="space-y-2.5">
                  {rule.points.map((p, i) => (
                    <li key={i} className="flex gap-2.5 text-sm text-gray-400 leading-relaxed">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gold-500 shrink-0" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
