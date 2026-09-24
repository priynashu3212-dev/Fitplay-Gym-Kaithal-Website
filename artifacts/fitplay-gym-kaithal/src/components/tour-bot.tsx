import { type CSSProperties, useEffect, useRef, useState } from 'react';
import { useLocation } from 'wouter';
import { ArrowLeft, ArrowRight, Sparkles, X } from 'lucide-react';

const COMPLETE_KEY = 'fitplay-tour-complete';
const DECLINED_KEY = 'fitplay-tour-declined';

type TourSpot = { top: number; left: number; width: number; height: number };

type TourStep = {
  path: string;
  selector?: string;
  title: string;
  text: string;
};

const TOUR_STEPS: TourStep[] = [
  {
    path: '/',
    selector: '.hero',
    title: 'Welcome home 🏋️',
    text: 'Ye hai Fitplay Gym Kaithal ka hero section — hamara video intro, "Show up. Get stronger." tagline aur explore button. Kaithal apna training ground yahin se shuru hota hai!',
  },
  {
    path: '/about',
    selector: '.team-layout',
    title: 'The gym — hamari kahani',
    text: 'About page par milti hai Fitplay ki story (2017 se), hamari belief, kuch facts aur hamara crew — founder Ravi Kumar aur unki team. Come as you are, train with intent.',
  },
  {
    path: '/training',
    selector: '.offer-list',
    title: 'Training programs 💪',
    text: 'Yaahan choose karo apni training: Strength floor, Personal training, Functional fitness aur Beginner foundations. Har level ke liye kuch na kuch milta hai — koi jarurt nahi hesitancy ki!',
  },
  {
    path: '/gallery',
    selector: '.gallery-grid',
    title: 'Gallery 📸',
    text: 'Inside the gym — floor ki real photos. Kisi bhi photo par click karke badi dekh sakte ho. Delh ke hi belief aa jata hai!',
  },
  {
    path: '/memberships',
    selector: '.pricing-grid',
    title: 'Memberships 💰',
    text: 'Simple, honest pricing: Monthly ₹1,200 / Quarterly ₹3,000 / Annual ₹9,600. Annual plan chuno aur ₹4,800 bachao. No hidden charges!',
  },
  {
    path: '/contact',
    selector: '.contact-grid',
    title: 'Contact — pehla kadam 📞',
    text: 'Yahan hai location, timings (Mon–Sat 6AM–10PM), phone +91 870551762, WhatsApp aur inquiry form. Free visit book karne ka sabse aasan tarika!',
  },
];

function RobotAvatar({ size = 58 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <circle cx="32" cy="32" r="30" fill="#111827" />
      <circle cx="32" cy="4" r="3.6" fill="#E63946" />
      <line x1="32" y1="8" x2="32" y2="14" stroke="#111827" strokeWidth="3" strokeLinecap="round" />
      <rect x="6" y="26" width="4" height="12" rx="2" fill="#E63946" />
      <rect x="54" y="26" width="4" height="12" rx="2" fill="#E63946" />
      <circle cx="22" cy="29" r="5.5" fill="#E63946" />
      <circle cx="42" cy="29" r="5.5" fill="#E63946" />
      <circle cx="24.2" cy="27.2" r="1.8" fill="#fff" />
      <circle cx="44.2" cy="27.2" r="1.8" fill="#fff" />
      <circle cx="15" cy="37" r="2.2" fill="#E63946" opacity="0.35" />
      <circle cx="49" cy="37" r="2.2" fill="#E63946" opacity="0.35" />
      <rect x="24" y="42" width="16" height="5" rx="2.5" fill="#E63946" />
    </svg>
  );
}

export function TourBot() {
  const [phase, setPhase] = useState<'hidden' | 'prompt' | 'tour' | 'complete' | 'done'>('hidden');
  const [stepIdx, setStepIdx] = useState(0);
  const [spot, setSpot] = useState<TourSpot | null>(null);
  const [, setLocation] = useLocation();
  const measureRef = useRef<number | null>(null);
  const doneRef = useRef<number | null>(null);

  const step = TOUR_STEPS[stepIdx];

  const tipStyle = (s: TourSpot): CSSProperties => {
    const tipW = Math.min(370, window.innerWidth - 16);
    const topClamp = Math.max(8, s.top);
    let left = s.left + s.width + 14;
    let top = Math.max(8, Math.min(s.top + s.height / 2 - 70, window.innerHeight - 250));
    if (left + tipW > window.innerWidth - 8) {
      left = Math.max(8, s.left - tipW - 14);
      top = topClamp + s.height + 12;
    }
    top = Math.max(8, Math.min(top, window.innerHeight - 230));
    return { left, top, width: tipW };
  };

  const showPrompt = () => {
    if (typeof window === 'undefined') return;
    if (localStorage.getItem(COMPLETE_KEY)) return;
    if (sessionStorage.getItem(DECLINED_KEY)) return;
    setPhase('prompt');
  };

  useEffect(() => {
    if (localStorage.getItem(COMPLETE_KEY) || sessionStorage.getItem(DECLINED_KEY)) return;
    const started = Date.now();
    const timer = window.setInterval(() => {
      const waitingOnIntro = document.querySelector('.video-intro') !== null;
      if (!waitingOnIntro && Date.now() - started > 2500) {
        window.clearInterval(timer);
        window.setTimeout(showPrompt, 800);
      }
    }, 400);
    return () => window.clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startTour = () => {
    setStepIdx(0);
    setPhase('tour');
    setSpot(null);
    setLocation(TOUR_STEPS[0].path);
  };

  const dismissPrompt = () => {
    sessionStorage.setItem(DECLINED_KEY, '1');
    setPhase('done');
  };

  const measure = (current: TourStep) => {
    if (measureRef.current) window.clearTimeout(measureRef.current);
    if (!current.selector) {
      setSpot(null);
      return;
    }
    measureRef.current = window.setTimeout(() => {
      const el = document.querySelector<HTMLElement>(current.selector!);
      if (!el) {
        setSpot(null);
        return;
      }
      el.scrollIntoView({ block: 'center', behavior: 'smooth' });
      measureRef.current = window.setTimeout(() => {
        const r = el.getBoundingClientRect();
        setSpot({
          top: Math.max(8, r.top - 4),
          left: Math.max(8, r.left - 4),
          width: Math.min(r.width + 8, window.innerWidth - 16),
          height: Math.min(r.height + 8, window.innerHeight - 16),
        });
      }, 650);
    }, 750);
  };

  useEffect(() => {
    if (phase !== 'tour') return;
    setLocation(step.path);
    measure(step);
    window.scrollTo({ top: 0 });
    return () => {
      if (measureRef.current) window.clearTimeout(measureRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, stepIdx]);

  const go = (dir: number) => {
    const next = stepIdx + dir;
    if (next < 0 || next >= TOUR_STEPS.length) return;
    setStepIdx(next);
  };

  const finishTour = () => {
    setSpot(null);
    setPhase('complete');
    if (doneRef.current) window.clearTimeout(doneRef.current);
    doneRef.current = window.setTimeout(() => {
      localStorage.setItem(COMPLETE_KEY, '1');
      setPhase('done');
    }, 4200);
  };

  const skipTour = () => {
    dismissPrompt();
  };

  if (phase === 'hidden' || phase === 'done') return null;

  return (
    <>
      {phase === 'prompt' && (
        <div className="tour-prompt" role="dialog" aria-label="Website tour offer" data-testid="tour-prompt">
          <div className="tour-avatar-wrap">
            <RobotAvatar />
            <span className="tour-speak">Namaste! 👋</span>
          </div>
          <div className="tour-promo-card">
            <button className="tour-close" onClick={dismissPrompt} aria-label="Close" data-testid="tour-prompt-close"><X size={15} /></button>
            <p className="tour-promo-tag">Fitplay Robot / Tour guide</p>
            <h2 className="tour-promo-title">Website ka full tour?</h2>
            <p className="tour-promo-text">Kya aapko Fitplay Gym ka poora tour chahiye? Allow karo aur main dikha doonga — gym, training, memberships aur contact. Sirf 1 minute! 🤖💪</p>
            <div className="tour-promo-actions">
              <button className="tour-btn tour-btn-primary" onClick={startTour} data-testid="tour-allow">Allow tour <ArrowRight size={15} /></button>
              <button className="tour-btn tour-btn-ghost" onClick={dismissPrompt} data-testid="tour-skip">Maybe later</button>
            </div>
          </div>
        </div>
      )}

      {phase === 'tour' && (
        <div className="tour-backdrop" data-testid="tour-backdrop" aria-label="Website tour">
          {spot && (
            <div
              className="tour-spot"
              style={{ top: spot.top, left: spot.left, width: spot.width, height: spot.height }}
              data-testid="tour-spot"
            />
          )}
          <div className="tour-avatar-wrap tour-avatar-mini" data-testid="tour-avatar-mini">
            <RobotAvatar size={44} />
          </div>
          <div className="tour-tip" style={spot ? tipStyle(spot) : { left: '50%', top: '38%', transform: 'translate(-50%,-50%)' }} data-testid="tour-tip">
            <div className="tour-tip-head">
              <span className="tour-tip-step">Step {stepIdx + 1} / {TOUR_STEPS.length}</span>
              <button className="tour-close" onClick={skipTour} aria-label="Close tour" data-testid="tour-skip-tour"><X size={15} /></button>
            </div>
            <h3 className="tour-tip-title">{step.title}</h3>
            <p className="tour-tip-text">{step.text}</p>
            <div className="tour-progress"><span style={{ width: `${((stepIdx + 1) / TOUR_STEPS.length) * 100}%` }} /></div>
            <div className="tour-tip-actions">
              <button className="tour-btn tour-btn-ghost" onClick={() => go(-1)} disabled={stepIdx === 0} data-testid="tour-back"><ArrowLeft size={15} /> Back</button>
              {stepIdx < TOUR_STEPS.length - 1 ? (
                <button className="tour-btn tour-btn-primary" onClick={() => go(1)} data-testid="tour-next">Next <ArrowRight size={15} /></button>
              ) : (
                <button className="tour-btn tour-btn-primary" onClick={finishTour} data-testid="tour-finish"><Sparkles size={15} /> Finish tour</button>
              )}
            </div>
          </div>
        </div>
      )}

      {phase === 'complete' && (
        <div className="tour-done" role="dialog" aria-label="Tour complete" data-testid="tour-done">
          <div className="tour-done-card">
            <div className="tour-avatar-wrap"><RobotAvatar size={72} /></div>
            <p className="tour-promo-tag">Tour complete 🎉</p>
            <h2 className="tour-done-title">Bas itna hi!</h2>
            <p className="tour-done-text">Ab aap Fitplay Gym ke baare mein sab jaante ho. Come visit us — rolling pehle rep aapka hai! 💪👋</p>
          </div>
        </div>
      )}
    </>
  );
}