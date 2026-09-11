import { type ReactNode, useEffect, useRef, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  ArrowDownRight,
  ArrowRight,
  Check,
  Clock3,
  Instagram,
  MapPin,
  Menu,
  Phone,
  Play,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { ChatBot } from '@/components/chatbot';
import NotFound from '@/pages/not-found';
import { Link, Route, Switch, useLocation, Router as WouterRouter } from 'wouter';

const queryClient = new QueryClient();
const base = import.meta.env.BASE_URL;

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'The gym' },
  { href: '/training', label: 'Training' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/memberships', label: 'Memberships' },
  { href: '/contact', label: 'Contact' },
];

const trainingOffers = [
  ['01', 'Strength floor', 'Free weights, racks, cables and room to find your form.'],
  ['02', 'Personal training', 'One-to-one guidance that meets you where you are.'],
  ['03', 'Functional fitness', 'Move better, work harder, feel ready for real life.'],
  ['04', 'Beginner foundations', 'A friendly start, simple plans and zero guesswork.'],
];

const galleryImages = [
  { src: `${base}images/gallery-01.jpg`, label: 'Fitplay life', ratio: '335 / 597' },
  { src: `${base}images/gallery-02.jpg`, label: 'Train hard', ratio: '335 / 597' },
  { src: `${base}images/gallery-03.jpg`, label: 'Power up', ratio: '335 / 597' },
  { src: `${base}images/gallery-04.jpg`, label: 'Strong daily', ratio: '335 / 597' },
  { src: `${base}images/gym-02.jpg`, label: 'The floor', ratio: '515 / 388' },
  { src: `${base}images/gym-03.jpg`, label: 'Strength zone', ratio: '515 / 388' },
  { src: `${base}images/gym-05.jpg`, label: 'Every rep counts', ratio: '1 / 1' },
  { src: `${base}images/gym-07.jpg`, label: 'Fitplay energy', ratio: '515 / 388' },
  { src: `${base}images/gym-09.jpg`, label: 'The crew', ratio: '1 / 1' },
];

function useReveal() {
  useEffect(() => {
    const nodes = document.querySelectorAll<HTMLElement>('.reveal');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);
}

function SiteHeader({ onBookVisit }: { onBookVisit: () => void }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 28);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const closeMenu = () => setMenuOpen(false);
  const handleBookVisit = () => {
    closeMenu();
    onBookVisit();
  };

  return (
    <header className={`topbar ${scrolled ? 'scrolled' : ''}`} data-testid="header-main">
      <div className="container-wide flex h-[72px] items-center justify-between">
        <Link href="/" className="brand-mark flex items-center bg-[var(--acid)] px-3 py-2" data-testid="link-brand"><img src={`${base}images/gym-symbol.jpg`} alt="Fitplay Gym" className="h-10 w-auto object-contain" /></Link>
        <nav className="nav-desktop flex items-center gap-6" aria-label="Primary navigation">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className={`nav-link eyebrow ${location === item.href ? 'active' : ''}`} data-testid={`link-nav-${item.label.toLowerCase().replace(' ', '-')}`}>{item.label}</Link>
          ))}
          <button onClick={handleBookVisit} className="button-primary !px-4 !py-3" data-testid="button-nav-visit">Book a visit <ArrowRight size={15} /></button>
        </nav>
        <button className="mobile-menu" onClick={() => setMenuOpen((open) => !open)} aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen} data-testid="button-mobile-menu">
          {menuOpen ? <X size={19} /> : <Menu size={19} />}
        </button>
      </div>
      {menuOpen && (
        <nav className="mobile-links" aria-label="Mobile navigation">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} onClick={closeMenu} className={`eyebrow ${location === item.href ? 'active' : ''}`}>{item.label}</Link>
          ))}
          <button onClick={handleBookVisit} className="button-primary" data-testid="button-mobile-visit">Book a visit <ArrowRight size={15} /></button>
        </nav>
      )}
    </header>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="container-wide">
        <div className="footer-grid">
          <div>
            <div className="footer-logo"><img src={`${base}images/gym-symbol.jpg`} alt="Fitplay Gym" className="h-14 w-auto object-contain" /></div>
            <p className="mt-6 max-w-[250px] text-sm leading-6 text-[rgba(245,241,232,.55)]">A stronger everyday, built in Kaithal.</p>
          </div>
          <div>
            <p className="footer-label">Find us</p>
            <a href="https://maps.google.com/?q=Fitplay+Gym+Kaithal" target="_blank" rel="noreferrer" className="flex items-start gap-2" data-testid="link-footer-map"><MapPin size={15} className="mt-0.5 text-[var(--acid)]" />Near City Centre,<br />Kaithal, Haryana</a>
            <a href="tel:+919876543210" className="mt-4 flex items-center gap-2" data-testid="link-footer-phone"><Phone size={14} className="text-[var(--acid)]" />+91 98765 43210</a>
          </div>
          <div>
            <p className="footer-label">Hours</p>
            <p className="text-sm leading-7 text-[rgba(245,241,232,.68)]"><span className="text-[var(--paper)]">Mon — Sat</span><br />6:00 AM — 10:00 PM<br /><span className="text-[var(--paper)]">Sunday</span><br />7:00 AM — 1:00 PM</p>
            <a href="https://www.instagram.com/fitplaykaithal" target="_blank" rel="noreferrer" className="mt-5 flex items-center gap-2" data-testid="link-footer-instagram"><Instagram size={15} className="text-[var(--acid)]" /> @fitplaykaithal</a>
          </div>
        </div>
        <div className="footer-bottom"><span>© 2024 Fitplay Gym Kaithal</span><span className="flex items-center gap-2"><Clock3 size={13} /> Train with intent.</span></div>
      </div>
    </footer>
  );
}

function BookingModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [submitted, setSubmitted] = useState(false);
  useEffect(() => {
    if (open) setSubmitted(false);
  }, [open]);
  if (!open) return null;

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="visit-title" data-testid="modal-visit">
      <div className="modal">
        <button className="close-button" onClick={onClose} aria-label="Close visit form" data-testid="button-close-visit"><X size={18} /></button>
        {!submitted ? (
          <form onSubmit={(event) => { event.preventDefault(); setSubmitted(true); }}>
            <p className="eyebrow text-[var(--ember)]">No pressure / just a hello</p>
            <h2 id="visit-title" className="display mt-4">Come see<br />the floor.</h2>
            <p className="mt-4 text-sm leading-6 opacity-70">Leave your details and we’ll have someone from the crew reach out to set up your first look.</p>
            <label className="form-label" htmlFor="visit-name">Your name</label>
            <input id="visit-name" required placeholder="What should we call you?" data-testid="input-visit-name" />
            <label className="form-label" htmlFor="visit-phone">Phone number</label>
            <input id="visit-phone" required type="tel" placeholder="+91" data-testid="input-visit-phone" />
            <label className="form-label" htmlFor="visit-goal">What brings you in?</label>
            <select id="visit-goal" defaultValue="strength" data-testid="select-visit-goal"><option value="strength">Build strength</option><option value="fitness">Get fitter</option><option value="beginner">Start from scratch</option><option value="training">Personal training</option></select>
            <button type="submit" className="button-dark mt-7 w-full" data-testid="button-submit-visit">Send it through <ArrowRight size={16} /></button>
          </form>
        ) : (
          <div className="py-8"><p className="eyebrow text-[var(--ember)]">You're on the list</p><h2 className="display mt-5">See you<br />on the floor.</h2><p className="mt-5 text-sm leading-7 opacity-70">Thanks for reaching out. The Fitplay crew will call you soon to arrange a good time.</p><button className="button-dark mt-7" onClick={onClose} data-testid="button-finish-visit">Done <Check size={16} /></button></div>
        )}
      </div>
    </div>
  );
}

function SiteLayout({ children }: { children: ReactNode }) {
  const [modalOpen, setModalOpen] = useState(false);
  return (
    <div className="fitplay-page">
      <SiteHeader onBookVisit={() => setModalOpen(true)} />
      {children}
      <Footer />
      <BookingModal open={modalOpen} onClose={() => setModalOpen(false)} />
      <ChatBot />
    </div>
  );
}

function IntroOverlay({ onFinish, base }: { onFinish: () => void; base: string }) {
  const clipRefs = useRef<HTMLVideoElement[]>([]);
  const ringRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const songRef = useRef<HTMLAudioElement>(null);
  const finishRef = useRef(onFinish);
  finishRef.current = onFinish;
  const clips = ['scene-01','scene-02','scene-03','scene-04','scene-05','scene-06','scene-07','scene-08','scene-09','scene-10'];
  const count = clips.length;

  useEffect(() => {
    if (!clipRefs.current.length) return;
    const videos = clipRefs.current;
    videos.forEach(v => { if (v) { v.currentTime = 0; v.play().catch(() => {}); v.style.zIndex = String(iOffset(v)); } });
    function iOffset(v: HTMLVideoElement) { return videos.indexOf(v) + 1; }

    const ringSize = () => {
      const radius = Math.min(window.innerWidth, window.innerHeight) * 0.30;
      if (ringRef.current) {
        const size = radius * 2.3;
        ringRef.current.style.width = `${size}px`;
        ringRef.current.style.height = `${size}px`;
        ringRef.current.style.transform = 'translate(-50%,-50%)';
      }
    };
    ringSize();
    window.addEventListener('resize', ringSize);

    videos.forEach((v, i) => setTimeout(() => {
      const startX = (Math.random() - 0.5) * window.innerWidth * 1.1;
      const startY = (Math.random() - 0.5) * window.innerHeight * 1.1;
      const startRot = (Math.random() - 0.5) * 120;
      v.style.transition = 'transform 1.15s cubic-bezier(.16,.84,.28,1), opacity .6s ease';
      v.style.transform = `translate(-50%,-50%) translate(${startX}px, ${startY}px) rotate(${startRot}deg) scale(0.7)`;
      v.style.opacity = '1';
    }, i * 25));

    setTimeout(() => videos.forEach((v, i) => setTimeout(() => {
      const radius = Math.min(window.innerWidth, window.innerHeight) * 0.30;
      const angle = (i / count) * Math.PI * 2 - Math.PI / 2;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      const rot = (angle * 180 / Math.PI) + 90;
      v.style.transform = `translate(-50%,-50%) translate(${x}px, ${y}px) rotate(${rot}deg) scale(1)`;
    }, i * 40)), 500);

    const GROW_AT = 3000;
    const GROW_STAGGER = 280;
    setTimeout(() => videos.forEach((v, i) => setTimeout(() => {
      const radius = Math.min(window.innerWidth, window.innerHeight) * 0.30;
      const angle = (i / count) * Math.PI * 2 - Math.PI / 2;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      const rot = (angle * 180 / Math.PI) + 90;
      const scale = Math.max(window.innerWidth, window.innerHeight) / (v.offsetWidth || 96) * 1.15;
      v.style.transition = 'transform 1.2s cubic-bezier(.2,.7,.2,1)';
      v.style.transform = `translate(-50%,-50%) translate(${x}px, ${y}px) rotate(${rot}deg) scale(${scale})`;
    }, i * GROW_STAGGER)), GROW_AT);

    const SHRINK_AT = GROW_AT + count * GROW_STAGGER + 1200;
    setTimeout(() => {
      if (titleRef.current) titleRef.current.classList.add('show');
    }, SHRINK_AT - 450);
    setTimeout(() => {
      videos.forEach((v) => {
        v.style.transition = 'transform .7s cubic-bezier(.55,0,.85,.36), opacity .7s ease';
        v.style.transform = 'translate(-50%,-50%) translate(0, 0) rotate(0deg) scale(0.02)';
        v.style.opacity = '0';
      });
      if (ringRef.current) { ringRef.current.style.transition = 'opacity .5s ease'; ringRef.current.style.opacity = '0'; }
    }, SHRINK_AT);

    const fadeAt = SHRINK_AT + 950;
    const finishTimer = window.setTimeout(() => {
      if (rootRef.current) rootRef.current.classList.add('video-intro-hide');
      window.setTimeout(() => finishRef.current(), 500);
    }, fadeAt);

    const song = songRef.current;
    const trySong = () => { if (song) { song.volume = 0.9; song.play().catch(() => {}); } };
    trySong();
    const onGesture = () => trySong();
    window.addEventListener('pointerdown', onGesture);

    return () => {
      window.removeEventListener('resize', ringSize);
      window.removeEventListener('pointerdown', onGesture);
      window.clearTimeout(finishTimer);
      videos.forEach(v => { if (v) { v.pause(); } });
      if (song) song.pause();
    };
  }, [count]);

  return (
    <div className="video-intro" ref={rootRef} role="dialog" aria-modal="true" aria-label="Fitplay Gym intro">
      <audio ref={songRef} src={`${base}assets/intro/intro-song.mp3`} preload="auto" aria-hidden="true" />
      <div className="intro-glow intro-glow-a" aria-hidden="true" />
      <div className="intro-glow intro-glow-b" aria-hidden="true" />
      <div className="intro-grid-lines" aria-hidden="true" />
      <div className="intro-clips" aria-hidden="true">
        {clips.map((c, i) => (
          <video key={c} className="intro-clip" muted playsInline loop
            ref={el => { clipRefs.current[i] = el!; }}
          ><source src={`${base}assets/intro/${c}.mp4`} type="video/mp4" /></video>
        ))}
        <div className="intro-ring" ref={ringRef} aria-hidden="true" />
      </div>
      <div className="video-intro-content">
        <div className="intro-progress" aria-hidden="true"><span /></div>
        <h1 className="intro-title center-content" ref={titleRef}>FITPLAY GYM</h1>
      </div>
    </div>
  );
}

function Home() {
  useReveal();
  const [introVisible, setIntroVisible] = useState(true);
  const [heroSound, setHeroSound] = useState(false);
  const [heroPhase, setHeroPhase] = useState<'video' | 'photo'>('video');
  const heroVideoRef = useRef<HTMLVideoElement>(null);
  const heroAudioRef = useRef<HTMLAudioElement>(null);
  const photoTimerRef = useRef<number | null>(null);
  const introVisibleRef = useRef(true);
  const pendingSoundRef = useRef(false);

  const enableSound = () => {
    const audio = heroAudioRef.current;
    if (audio) {
      audio.volume = 0.9;
      audio.play().catch(() => {});
      setHeroSound(true);
    }
  };

  const finishIntro = () => {
    window.sessionStorage.setItem('fitplay-intro-seen', 'true');
    introVisibleRef.current = false;
    if (pendingSoundRef.current) enableSound();
    setIntroVisible(false);
  };

  useEffect(() => {
    if (window.sessionStorage.getItem('fitplay-intro-seen')) {
      introVisibleRef.current = false;
      setIntroVisible(false);
    }
  }, []);

  useEffect(() => {
    if (!introVisible) return;
    const timer = window.setTimeout(finishIntro, 12000);
    return () => window.clearTimeout(timer);
  }, [introVisible]);

  useEffect(() => {
    const handler = (e: Event) => {
      if ((e.target as HTMLElement)?.closest('.hero-sound')) return;
      if (introVisibleRef.current) {
        pendingSoundRef.current = true;
      } else {
        enableSound();
      }
      window.removeEventListener('click', handler);
      window.removeEventListener('touchstart', handler);
      window.removeEventListener('keydown', handler);
    };
    window.addEventListener('click', handler);
    window.addEventListener('touchstart', handler);
    window.addEventListener('keydown', handler);
    return () => {
      window.removeEventListener('click', handler);
      window.removeEventListener('touchstart', handler);
      window.removeEventListener('keydown', handler);
    };
  }, []);

  useEffect(() => {
    if (heroPhase === 'photo') {
      photoTimerRef.current = window.setTimeout(() => setHeroPhase('video'), 10000);
    }
    return () => {
      if (photoTimerRef.current) window.clearTimeout(photoTimerRef.current);
    };
  }, [heroPhase]);

  useEffect(() => {
    if (heroPhase === 'video') {
      const video = heroVideoRef.current;
      if (video) {
        video.muted = true;
        video.currentTime = 0;
        video.play().catch(() => {});
      }
    }
  }, [heroPhase]);

  const toggleHeroSound = () => {
    const audio = heroAudioRef.current;
    if (!audio) return;
    if (heroSound) {
      audio.pause();
      setHeroSound(false);
    } else {
      audio.volume = 0.9;
      audio.play().catch(() => {});
      setHeroSound(true);
    }
  };

  return (
    <SiteLayout>
      {introVisible && <IntroOverlay onFinish={finishIntro} base={base} />}
      <main id="top">
        <section className={`hero grain ${heroPhase === 'photo' ? 'hero-showing-photo' : ''}`} aria-labelledby="hero-title">
          <audio ref={heroAudioRef} src={`${base}assets/hero-audio.mp3`} loop preload="auto" aria-hidden="true" />
          {heroPhase === 'video' && (
          <video ref={heroVideoRef} className="hero-video" autoPlay muted loop={false} playsInline aria-hidden="true" onEnded={() => setHeroPhase('photo')}><source src={`${base}assets/hero-video.mp4`} type="video/mp4" /></video>
          )}
          {heroPhase === 'photo' && <img className="hero-photo" src={`${base}images/girl.png`} alt="Fitplay Gym" aria-hidden="true" />}
          <button className="hero-sound" onClick={toggleHeroSound} aria-label={heroSound ? 'Mute song' : 'Play song'} data-testid="button-hero-sound">{heroSound ? <VolumeX size={18} /> : <Volume2 size={18} />}<span>Song {heroSound ? 'on' : 'off'}</span></button>
          <div className="container-wide hero-content">
            <p className="eyebrow reveal" style={{ color: 'var(--acid)' }}>Kaithal's training ground / Est. 2017</p>
            <h1 id="hero-title" className="display hero-title reveal delay-1">Show up.<br /><em>Get stronger.</em></h1>
            <div className="hero-meta reveal delay-2">
              <p className="hero-copy">A serious gym for everyday athletes. Build strength, sharpen your energy and find your people at Fitplay Gym Kaithal.</p>
              <Link className="arrow-link" href="/about" data-testid="link-hero-explore">Explore Fitplay <ArrowDownRight size={18} /></Link>
            </div>
          </div>
        </section>
        <div className="marquee" aria-label="Fitplay values"><div className="marquee-track"><span>Train with intent</span><i className="dot" /><span>Kaithal, Haryana</span><i className="dot" /><span>No shortcuts</span><i className="dot" /><span>Built together</span><i className="dot" /><span>Train with intent</span><i className="dot" /><span>Kaithal, Haryana</span><i className="dot" /><span>No shortcuts</span><i className="dot" /><span>Built together</span><i className="dot" /></div></div>

        <section className="section" aria-labelledby="home-gym-title">
          <div className="container-wide">
            <div className="intro-grid">
              <div className="reveal"><p className="eyebrow mb-5 text-[var(--ember)]">01 / The gym</p><p className="body-copy">Not a room full of machines. A place with a pulse. Fitplay is where Kaithal comes to move with purpose.</p></div>
              <div className="reveal delay-1"><h2 id="home-gym-title" className="display section-title">Make your<br /><span className="text-[var(--ember)]">move.</span></h2><p className="section-lede mt-8">Come for the equipment. Stay for the energy. Leave knowing you gave the day everything.</p><Link className="button-dark mt-8" href="/about">Meet the gym <ArrowRight size={16} /></Link></div>
            </div>
            <div className="stat-band mt-24 reveal delay-2" aria-label="Fitplay gym facts"><div className="stat"><div className="display stat-number">7+</div><div className="stat-label">Years in Kaithal</div></div><div className="stat"><div className="display stat-number">6AM</div><div className="stat-label">Doors open early</div></div><div className="stat"><div className="display stat-number">1</div><div className="stat-label">Crew that has your back</div></div><div className="stat"><div className="display stat-number">∞</div><div className="stat-label">Reasons to return</div></div></div>
          </div>
        </section>

        <section className="dark-panel section" aria-labelledby="home-training-title">
          <div className="container-wide">
            <div className="offer-wrap">
              <div className="reveal"><p className="eyebrow mb-5 text-[var(--acid)]">02 / Training</p><h2 id="home-training-title" className="display section-title">Train<br />your way.</h2><p className="mt-8 max-w-[300px] text-sm leading-7 text-[rgba(245,241,232,.6)]">From your first squat to your strongest set, every session has a place here.</p><Link className="button-primary mt-8" href="/training">See training <ArrowRight size={16} /></Link></div>
              <OfferList className="reveal delay-1" />
            </div>
          </div>
        </section>

        <section className="section" aria-labelledby="home-gallery-title">
          <div className="container-wide">
            <div className="intro-grid">
              <div className="reveal"><p className="eyebrow mb-5 text-[var(--ember)]">03 / Gallery</p><p className="body-copy">A few frames from the floor. Equipment, energy and the people who make Fitplay feel like home.</p></div>
              <div className="reveal delay-1"><h2 id="home-gallery-title" className="display section-title">Inside<br /><span className="text-[var(--ember)]">the gym.</span></h2><Link className="button-dark mt-8" href="/gallery">See the gallery <ArrowRight size={16} /></Link></div>
            </div>
            <div className="home-gallery-strip mt-14 reveal delay-2">
              {galleryImages.slice(0, 4).map((img) => (
                <Link key={img.src} href="/gallery" className="home-gallery-thumb" style={{ aspectRatio: img.ratio }}>
                  <img src={img.src} alt={img.label} loading="lazy" />
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="section dark-panel" aria-labelledby="home-words-title">
          <div className="container-wide">
            <div className="flex flex-wrap items-end justify-between gap-8">
              <div className="reveal"><p className="eyebrow mb-5 text-[var(--acid)]">04 / Member words</p><h2 id="home-words-title" className="display section-title">Everyone<br /><span className="text-[var(--acid)]">knows your name.</span></h2></div>
              <p className="body-copy body-copy-dark reveal delay-1">Results are nice. The crew that pushes you to get them, better.</p>
            </div>
            <div className="home-quotes mt-12">
              <div className="testimonial reveal"><div className="quote-mark">“</div><div><p className="quote-text">I joined for the equipment. I kept coming because everyone knows your name.</p><p className="quote-by">— Ankit, Fitplay member since 2021</p></div></div>
              <div className="testimonial reveal mt-10"><div className="quote-mark">“</div><div><p className="quote-text">The first week is the hardest. Fitplay makes the rest of the climb worth it.</p><p className="quote-by">— Simran, member since 2022</p></div></div>
            </div>
          </div>
        </section>

        <section className="acid-panel cta-panel grain" aria-labelledby="home-cta-title"><div className="container-wide"><p className="eyebrow reveal">05 / Your first rep</p><h2 id="home-cta-title" className="display cta-title mt-8 reveal delay-1">Ready to<br /><span className="text-[var(--ember)]">start?</span></h2><p className="cta-copy reveal delay-2">Walk in for a look, ask us anything and get a feel for the floor.</p><Link href="/contact" className="button-dark reveal delay-3">Plan your visit <ArrowRight size={16} /></Link></div></section>
      </main>
    </SiteLayout>
  );
}

function OfferList({ className = '' }: { className?: string }) {
  return (
    <div className={`offer-list ${className}`}>
      {trainingOffers.map(([index, name, description]) => (
        <Link href="/training" key={index} className="offer-item"><span className="offer-index">{index}</span><div><div className="offer-name">{name}</div><div className="offer-desc">{description}</div></div><ArrowRight size={19} /></Link>
      ))}
    </div>
  );
}

function PageHero({ eyebrow, title, accent, copy, bg }: { eyebrow: string; title: string; accent: string; copy: string; bg?: string }) {
  return (
    <section className="page-hero dark-panel grain" style={bg ? { backgroundImage: `linear-gradient(rgba(17,24,39,.82), rgba(17,24,39,.78)), url(${base}${bg})`, backgroundSize: 'cover', backgroundPosition: 'center' } : undefined}>
      <div className="container-wide page-hero-content">
        <p className="eyebrow text-[var(--acid)] reveal">{eyebrow}</p>
        <h1 className="display page-title reveal delay-1">{title}<br /><span className="text-[var(--acid)]">{accent}</span></h1>
        <p className="page-hero-copy reveal delay-2">{copy}</p>
      </div>
    </section>
  );
}

function AboutPage() {
  useReveal();
  return (
    <SiteLayout>
      <main>
        <PageHero eyebrow="01 / The gym" title="Built for" accent="everyday athletes." copy="Fitplay is Kaithal's training ground for people who want to feel stronger, move better and keep showing up." bg="images/new.png" />
        <section className="section dark-panel"><div className="container-wide">
            <div className="intro-grid">
              <div className="reveal"><p className="eyebrow mb-5 text-[var(--acid)]">The Fitplay idea</p><p className="body-copy" style={{ color: 'rgba(245,241,232,0.8)' }}>We started with a simple belief: a gym should feel like a place you want to return to. The right equipment matters. So does a good coach, a familiar face and a floor that makes you want to get one more rep.</p></div>
              <div className="reveal delay-1"><p className="pull-quote" style={{ color: 'var(--acid)' }}>Come as you are. Train with intent. Leave a little stronger.</p></div>
            </div>
            <div className="stat-band mt-24 reveal delay-2" aria-label="Fitplay gym facts" style={{ borderColor: 'rgba(245,241,232,0.2)' }}>
              <div className="stat" style={{ borderColor: 'rgba(245,241,232,0.2)' }}><div className="display stat-number" style={{ color: 'var(--acid)' }}>2017</div><div className="stat-label" style={{ color: 'rgba(245,241,232,0.7)' }}>Founded in Kaithal</div></div>
              <div className="stat" style={{ borderColor: 'rgba(245,241,232,0.2)' }}><div className="display stat-number" style={{ color: 'var(--acid)' }}>6AM</div><div className="stat-label" style={{ color: 'rgba(245,241,232,0.7)' }}>Doors open early</div></div>
              <div className="stat" style={{ borderColor: 'rgba(245,241,232,0.2)' }}><div className="display stat-number" style={{ color: 'var(--acid)' }}>100%</div><div className="stat-label" style={{ color: 'rgba(245,241,232,0.7)' }}>No ego energy</div></div>
              <div className="stat"><div className="display stat-number" style={{ color: 'var(--acid)' }}>∞</div><div className="stat-label" style={{ color: 'rgba(245,241,232,0.7)' }}>Reasons to return</div></div>
            </div>
          </div></section>
        <section className="section dark-panel"><div className="container-wide"><div className="flex flex-wrap items-end justify-between gap-8"><div className="reveal"><p className="eyebrow mb-5 text-[var(--acid)]">02 / The crew</p><h2 className="display section-title">Good people<br /><span className="text-[var(--acid)]">get results.</span></h2></div><p className="body-copy body-copy-dark reveal delay-1">Our coaches know the difference between pushing you and showing up for you. Expect both.</p></div><TeamGrid /></div></section>
      </main>
    </SiteLayout>
  );
}

function TeamGrid() {
  return (
    <div className="team-layout mt-14"><article className="coach-card reveal"><span className="coach-role">Founder / Coach</span><h3 className="display coach-name">Ravi<br />Kumar</h3><p className="coach-note">“Your best session is the one you make it to.”</p></article><div className="grid gap-[18px]"><article className="coach-card acid reveal delay-1"><span className="coach-role">Strength / Conditioning</span><h3 className="display coach-name">Simran<br />Kaur</h3><p className="coach-note">Form first. Then we add the fire.</p></article><article className="coach-card ember reveal delay-2"><span className="coach-role">Front desk / Good energy</span><h3 className="display coach-name">The<br />Fitplay crew</h3></article></div></div>
  );
}

function TrainingPage() {
  useReveal();
  return (
    <SiteLayout>
      <main>
        <PageHero eyebrow="02 / Training" title="Train" accent="your way." copy="From your first squat to your strongest set, every session has a place here. No intimidation. Just good coaching and better consistency." bg="images/train.png" />
        <section className="dark-panel section pt-0"><div className="container-wide"><OfferList className="reveal" /><div className="class-grid"><article className="class-card tall acid-panel reveal delay-1"><span className="class-tag">Session focus / 01</span><div><h2 className="display class-name">Build<br />the base</h2><p className="mt-5">Strong movement patterns. Steady progress. The kind of work that stays with you.</p></div></article><div className="grid gap-[18px]"><article className="class-card orange-panel reveal delay-2"><span className="class-tag">Session focus / 02</span><div><h2 className="display class-name">Raise<br />the bar</h2><p className="mt-4">Push past the comfortable edge with smart, coached intensity.</p></div></article><article className="class-card reveal delay-3"><span className="class-tag">Session focus / 03</span><div><h2 className="display class-name">Keep<br />showing up</h2><p className="mt-4">The real transformation is built between the big moments.</p></div></article></div></div></div></section>
        <section className="section"><div className="container-wide"><div className="testimonial reveal"><div className="quote-mark">“</div><div><p className="quote-text">I joined for the equipment. I kept coming because everyone knows your name.</p><p className="quote-by">— Ankit, Fitplay member since 2021</p></div></div></div></section>
      </main>
    </SiteLayout>
  );
}

function MembershipsPage() {
  useReveal();
  return (
    <SiteLayout>
      <main>
        <PageHero eyebrow="03 / Memberships" title="Choose" accent="your pace." copy="Straightforward memberships. Everything you need to make training part of your week, not another thing to overthink." bg="images/member.png" />
        <section className="dark-panel section pt-0"><div className="container-wide"><div className="pricing-grid pricing-grid-page"><PriceCard eyebrow="Start here" name="Monthly" amount="₹1,200" period="per month / no fuss" items={['Full gym access', 'Equipment orientation', 'Community floor']} /><PriceCard featured eyebrow="Best rhythm" name="Quarterly" amount="₹3,000" period="three months / keep momentum" items={['Full gym access', 'Goal-setting check-in', 'Save ₹600 overall']} /><PriceCard eyebrow="Go all in" name="Annual" amount="₹9,600" period="twelve months / your year" items={['Full gym access', 'Quarterly progress review', 'Save ₹4,800 overall']} /></div><div className="membership-note reveal"><p className="eyebrow text-[var(--acid)]">Included with every plan</p><p>Friendly floor support, a clean training space, and a community that will notice when you show up.</p></div></div></section>
      </main>
    </SiteLayout>
  );
}

function PriceCard({ eyebrow, name, amount, period, items, featured = false }: { eyebrow: string; name: string; amount: string; period: string; items: string[]; featured?: boolean }) {
  return (
    <article className={`price-card reveal ${featured ? 'featured' : ''}`}><span className={`eyebrow ${featured ? '' : 'text-[var(--acid)]'}`}>{eyebrow}</span><h2 className="price-name mt-5">{name}</h2><div className="price-amount">{amount}</div><div className="price-period">{period}</div><ul className="price-list">{items.map((item) => <li key={item}><Check size={16} /> {item}</li>)}</ul><Link className="button-primary price-cta" href="/contact">Choose this plan <ArrowRight size={14} /></Link></article>
  );
}

function GalleryPage() {
  useReveal();
  const [active, setActive] = useState<number | null>(null);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setActive(null); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);
  return (
    <SiteLayout>
      <main>
        <PageHero eyebrow="05 / Gallery" title="Inside" accent="the gym." copy="Real frames from the Fitplay floor — the equipment, the energy and the people who make it home." />
        <section className="section"><div className="container-wide"><div className="gallery-grid">{galleryImages.map((img, index) => (
          <button key={img.src} className={`gallery-item reveal delay-${(index % 3) + 1}`} style={{ aspectRatio: img.ratio }} onClick={() => setActive(index)} aria-label={`Open photo: ${img.label}`}>
            <img src={img.src} alt={img.label} loading="lazy" />
            <span className="gallery-caption">{img.label}</span>
          </button>
        ))}</div></div></section>
        {active !== null && (
          <div className="gallery-lightbox" role="dialog" aria-modal="true" onClick={() => setActive(null)}>
            <button className="gallery-lightbox-close" onClick={() => setActive(null)} aria-label="Close photo"><X size={20} /></button>
            <img src={galleryImages[active].src} alt={galleryImages[active].label} />
          </div>
        )}
      </main>
    </SiteLayout>
  );
}

function ContactPage() {
  useReveal();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [inquirySent, setInquirySent] = useState(false);

  const handleInquiry = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Website Inquiry from ${name}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nQuery:\n${message}`);
    window.location.href = `mailto:bhanupartap1790@gmail.com?subject=${subject}&body=${body}`;
    setInquirySent(true);
    setName(''); setEmail(''); setMessage('');
  };

  return (
    <SiteLayout>
      <main>
        <PageHero eyebrow="04 / Contact" title="Make the" accent="first move." copy="Come in for a look, ask us anything and get a feel for the floor. Your first step does not need to be perfect. It just needs to happen." bg="images/page.png" />
        <section className="section"><div className="container-wide"><div className="contact-grid"><div className="reveal"><p className="eyebrow mb-5 text-[var(--ember)]">Find the floor</p><h2 className="display section-title">See you<br /><span className="text-[var(--ember)]">at Fitplay.</span></h2><p className="body-copy mt-8">Near City Centre,<br />Kaithal, Haryana</p><a href="https://maps.google.com/?q=Fitplay+Gym+Kaithal" target="_blank" rel="noreferrer" className="button-dark mt-8">Open in Maps <MapPin size={16} /></a></div><div className="contact-details reveal delay-1"><div><p className="footer-label text-[var(--ember)]">Call</p><a className="contact-link" href="tel:+919876543210">+91 98765 43210</a></div><div><p className="footer-label text-[var(--ember)]">Hours</p><p className="contact-copy">Monday — Saturday<br />6:00 AM — 10:00 PM<br /><br />Sunday<br />7:00 AM — 1:00 PM</p></div><div><p className="footer-label text-[var(--ember)]">Social</p><a className="contact-link" href="https://www.instagram.com/fitplaykaithal" target="_blank" rel="noreferrer">@fitplaykaithal <Instagram size={18} /></a></div></div></div>
        <a href="https://maps.google.com/?q=Fitplay+Gym+Kaithal" target="_blank" rel="noreferrer" className="contact-map reveal delay-1"><img src={`${base}images/map.png`} alt="Map to Fitplay Gym Kaithal" /></a></div></section>
        <section className="dark-panel section"><div className="container-wide"><div className="intro-grid"><div className="reveal"><p className="eyebrow mb-5 text-[var(--acid)]">Got a question?</p><h2 className="display section-title">Send an<br /><span className="text-[var(--acid)]">inquiry.</span></h2><p className="mt-5 max-w-[400px] text-sm leading-7 text-[rgba(245,241,232,.6)]">Got a query about the gym, membership or training? Drop your details below and we'll get back to you at your email.</p></div>
          <form className="inquiry-form reveal delay-1" onSubmit={handleInquiry}>
            {!inquirySent ? (<>
              <label className="eyebrow" htmlFor="inquiry-name">Your name</label>
              <input id="inquiry-name" type="text" required placeholder="What should we call you?" value={name} onChange={(e) => setName(e.target.value)} />
              <label className="eyebrow" htmlFor="inquiry-email">Your email</label>
              <input id="inquiry-email" type="email" required placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
              <label className="eyebrow" htmlFor="inquiry-message">Your query</label>
              <textarea id="inquiry-message" required placeholder="Tell us what you'd like to know..." value={message} onChange={(e) => setMessage(e.target.value)} />
              <button type="submit" className="button-primary">Send inquiry <ArrowRight size={16} /></button>
            </>) : (
              <div className="inquiry-success"><p className="eyebrow text-[var(--acid)]">Thanks!</p><p className="mt-4 text-sm leading-7 text-[rgba(245,241,232,.6)]">Your email client should open with the query pre-filled. Send it and we'll get back to you soon.</p><button type="button" className="button-dark mt-7" onClick={() => setInquirySent(false)}>Send another</button></div>
            )}
          </form></div></div></section>
        <section className="acid-panel cta-panel grain"><div className="container-wide"><p className="eyebrow reveal">Your first rep</p><h2 className="display cta-title mt-8 reveal delay-1">Ready to<br /><span className="text-[var(--ember)]">start?</span></h2><p className="cta-copy reveal delay-2">Book a visit and the crew will help you find the right place to begin.</p></div></section>
      </main>
    </SiteLayout>
  );
}

function Router() {
  return <RoutedErrorBoundary><Switch><Route path="/" component={Home} /><Route path="/about" component={AboutPage} /><Route path="/training" component={TrainingPage} /><Route path="/gallery" component={GalleryPage} /><Route path="/memberships" component={MembershipsPage} /><Route path="/contact" component={ContactPage} /><Route component={NotFound} /></Switch></RoutedErrorBoundary>;
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return <QueryClientProvider client={queryClient}><TooltipProvider><WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}><Router /></WouterRouter><Toaster /></TooltipProvider></QueryClientProvider>;
}

export default App;