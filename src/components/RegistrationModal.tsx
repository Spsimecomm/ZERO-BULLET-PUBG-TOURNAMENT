import { useEffect, useState } from 'react';
import { X, Users, User, Gamepad2, Phone, CreditCard, Hash, CheckCircle2, Loader2, ShieldCheck } from 'lucide-react';
import type { Tournament, RegistrationInput, PaymentMethod } from '@/lib/supabase';
import { supabase } from '@/lib/supabase';

interface RegistrationModalProps {
  tournament: Tournament | null;
  onClose: () => void;
  onSubmitted: () => void;
}

type Step = 'details' | 'payment' | 'submitting' | 'success';

const initialForm = {
  team_name: '',
  leader_name: '',
  pubg_id: '',
  whatsapp: '',
  payment_method: 'bKash' as PaymentMethod,
  payment_number: '',
  transaction_id: '',
};

export default function RegistrationModal({ tournament, onClose, onSubmitted }: RegistrationModalProps) {
  const [step, setStep] = useState<Step>('details');
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (tournament) {
      setStep('details');
      setForm(initialForm);
      setError(null);
    }
  }, [tournament]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && tournament) onClose();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = tournament ? 'hidden' : '';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [tournament, onClose]);

  if (!tournament) return null;

  const update = (field: keyof typeof initialForm, value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
    setError(null);
  };

  const detailsValid =
    form.team_name.trim() &&
    form.leader_name.trim() &&
    form.pubg_id.trim() &&
    form.whatsapp.trim();

  const paymentValid = form.payment_number.trim() && form.transaction_id.trim();

  const handleDetailsNext = () => {
    if (!detailsValid) {
      setError('Please fill in all fields.');
      return;
    }
    setStep('payment');
  };

  const handleSubmit = async () => {
    if (!paymentValid) {
      setError('Please enter your payment number and transaction ID.');
      return;
    }
    setStep('submitting');
    const payload: RegistrationInput = {
      tournament_id: tournament.id,
      team_name: form.team_name.trim(),
      leader_name: form.leader_name.trim(),
      pubg_id: form.pubg_id.trim(),
      whatsapp: form.whatsapp.trim(),
      payment_method: form.payment_method,
      payment_number: form.payment_number.trim(),
      transaction_id: form.transaction_id.trim(),
    };
    const { error: insertError } = await supabase.from('registrations').insert(payload);
    if (insertError) {
      setError('Could not submit registration. Please try again.');
      setStep('payment');
      return;
    }
    setStep('success');
    onSubmitted();
  };

  const inputClass = 'input-field pl-11';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-ink-950/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto scrollbar-hide bg-ink-800 border border-ink-600 rounded-2xl shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-ink-800/95 backdrop-blur-sm border-b border-ink-600">
          <div>
            <h3 className="font-display font-bold uppercase tracking-wide text-lg text-gray-100">
              Register Team
            </h3>
            <p className="text-sm text-gold-400 font-display">{tournament.title}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gold-400 hover:bg-ink-700 rounded-lg transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {/* Step indicator */}
          <div className="flex items-center gap-2 mb-6">
            <div className={`flex-1 h-1 rounded-full ${step === 'details' || step === 'payment' || step === 'submitting' || step === 'success' ? 'bg-gold-gradient' : 'bg-ink-600'}`} />
            <div className={`flex-1 h-1 rounded-full ${step === 'payment' || step === 'submitting' || step === 'success' ? 'bg-gold-gradient' : 'bg-ink-600'}`} />
            <div className={`flex-1 h-1 rounded-full ${step === 'success' ? 'bg-gold-gradient' : 'bg-ink-600'}`} />
          </div>

          {/* Step: Details */}
          {step === 'details' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-display font-semibold uppercase tracking-wider text-gray-400 mb-1.5">Team Name</label>
                <div className="relative">
                  <Users className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gold-500" />
                  <input
                    type="text"
                    value={form.team_name}
                    onChange={(e) => update('team_name', e.target.value)}
                    placeholder="e.g. Phoenix Esports"
                    className={inputClass}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-display font-semibold uppercase tracking-wider text-gray-400 mb-1.5">In-Game Leader Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gold-500" />
                  <input
                    type="text"
                    value={form.leader_name}
                    onChange={(e) => update('leader_name', e.target.value)}
                    placeholder="e.g. ProSniper99"
                    className={inputClass}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-display font-semibold uppercase tracking-wider text-gray-400 mb-1.5">PUBG ID</label>
                <div className="relative">
                  <Gamepad2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gold-500" />
                  <input
                    type="text"
                    value={form.pubg_id}
                    onChange={(e) => update('pubg_id', e.target.value)}
                    placeholder="e.g. 5123456789"
                    className={inputClass}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-display font-semibold uppercase tracking-wider text-gray-400 mb-1.5">WhatsApp Number</label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gold-500" />
                  <input
                    type="tel"
                    value={form.whatsapp}
                    onChange={(e) => update('whatsapp', e.target.value)}
                    placeholder="e.g. 01XXXXXXXXX"
                    className={inputClass}
                  />
                </div>
              </div>

              {error && <p className="text-sm text-ember-400">{error}</p>}

              <button onClick={handleDetailsNext} className="btn-gold w-full">
                Continue to Payment
              </button>
            </div>
          )}

          {/* Step: Payment */}
          {(step === 'payment' || step === 'submitting') && (
            <div className="space-y-5">
              {/* Entry fee summary */}
              <div className="flex items-center justify-between p-4 bg-ink-900 border border-gold-500/30 rounded-lg">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Entry Fee</p>
                  <p className="font-display text-2xl font-bold text-gradient-gold">৳{tournament.entry_fee}</p>
                </div>
                <ShieldCheck className="w-8 h-8 text-gold-500" />
              </div>

              {/* Payment method selector */}
              <div>
                <label className="block text-xs font-display font-semibold uppercase tracking-wider text-gray-400 mb-2">Payment Method</label>
                <div className="grid grid-cols-2 gap-3">
                  {(['bKash', 'Nagad'] as PaymentMethod[]).map((m) => (
                    <button
                      key={m}
                      onClick={() => update('payment_method', m)}
                      disabled={step === 'submitting'}
                      className={`px-4 py-3 rounded-lg font-display font-semibold uppercase tracking-wider text-sm border transition-all duration-200 ${
                        form.payment_method === m
                          ? 'border-gold-500 bg-gold-500/10 text-gold-400 shadow-gold'
                          : 'border-ink-500 text-gray-400 hover:border-gold-500/50'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              {/* Instructions */}
              <div className="p-3 bg-ink-900 border border-ink-600 rounded-lg text-sm text-gray-400">
                Send <span className="text-gold-400 font-semibold">৳{tournament.entry_fee}</span> to{' '}
                <span className="text-gray-200 font-mono">017XX-XXXXXX</span> via{' '}
                <span className="text-gold-400 font-semibold">{form.payment_method}</span> (Personal),
                then enter the transaction ID below.
              </div>

              <div>
                <label className="block text-xs font-display font-semibold uppercase tracking-wider text-gray-400 mb-1.5">{form.payment_method} Number</label>
                <div className="relative">
                  <CreditCard className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gold-500" />
                  <input
                    type="tel"
                    value={form.payment_number}
                    onChange={(e) => update('payment_number', e.target.value)}
                    placeholder="Your bKash/Nagad number"
                    className={inputClass}
                    disabled={step === 'submitting'}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-display font-semibold uppercase tracking-wider text-gray-400 mb-1.5">Transaction ID</label>
                <div className="relative">
                  <Hash className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gold-500" />
                  <input
                    type="text"
                    value={form.transaction_id}
                    onChange={(e) => update('transaction_id', e.target.value)}
                    placeholder="e.g. 9F2K3L7M9X"
                    className={inputClass}
                    disabled={step === 'submitting'}
                  />
                </div>
              </div>

              {error && <p className="text-sm text-ember-400">{error}</p>}

              <div className="flex gap-3">
                <button
                  onClick={() => setStep('details')}
                  disabled={step === 'submitting'}
                  className="btn-ghost flex-1"
                >
                  Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={step === 'submitting'}
                  className="btn-gold flex-1"
                >
                  {step === 'submitting' ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    'Confirm Registration'
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Step: Success */}
          {step === 'success' && (
            <div className="py-8 text-center">
              <div className="grid place-items-center w-20 h-20 mx-auto rounded-full bg-gold-500/10 border border-gold-500/40 mb-6 animate-pulse-gold">
                <CheckCircle2 className="w-10 h-10 text-gold-400" />
              </div>
              <h4 className="font-display font-bold uppercase text-2xl text-gray-100 mb-2">Registration Submitted!</h4>
              <p className="text-gray-400 max-w-sm mx-auto">
                Your team <span className="text-gold-400 font-semibold">{form.team_name}</span> is now in the queue for{' '}
                <span className="text-gold-400 font-semibold">{tournament.title}</span>. We'll confirm your slot via WhatsApp after payment verification.
              </p>
              <button onClick={onClose} className="btn-gold mt-8">
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
