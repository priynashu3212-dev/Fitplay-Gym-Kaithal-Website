import { useEffect, useRef, useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';

const WHATSAPP_URL = 'https://wa.me/918708551762?text=' + encodeURIComponent('Namaste Fitplay Gym! I want to know more about your gym. 💪');

function WhatsAppIcon({ size = 26 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="currentColor" aria-hidden="true">
      <path d="M16.004 3C8.832 3 3 8.832 3 16.004c0 2.29.6 4.532 1.743 6.506L3 29l6.64-1.704A12.93 12.93 0 0 0 16.004 29C23.176 29 29 23.168 29 15.996 29 8.832 23.176 3 16.004 3zm7.389 18.223c-.303 1.05-1.79 1.925-2.786 2.048-.75.094-1.685.137-2.718-.159-1.03-.297-2.867-1.178-5.946-4.232-2.333-2.317-3.863-4.696-4.31-6.095-.447-1.4-.237-2.82.278-3.964.334-.727 1.276-1.065 2.041-1.065.234 0 .443.013.63.028.343.034.516.036.74.575.282.68 1.591 4.067 1.591 4.067.168.415.26.898-.049 1.435-.214.375-.75.969-1.02 1.228-.273.26-.468.53-.21.858.823.91 2.385 3.003 4.113 4.008.553.32.89.393 1.22.34.513-.083.924-.679 1.084-1.208.16-.53.391-1.9.391-1.9.124-.422.066-.8-.281-1.048-.34-.247-2.12-1.413-2.12-1.413-.254-.18-.446-.28-.07-.68.414-.446.814-.903 1.241-1.408.28-.333.21-.632 0-.891-.252-.309-.76-.554-1.127-.687-.489-.178-1.155-.478-1.638-1.128-.48-.649-.69-1.11-.69-1.11s-.29-.74-.883-.335c-.594.404-1.83 1.778-1.83 1.778s-.55.548-.117 1.35c2.749 5.71 4.622 6.942 4.622 6.942s.62.538 1.075.618c.456.08 1.444-.53 1.444-.53s.418-.246 1.233-1.032c0 0 .44-.36.74.175.297.537.738 1.468.738 1.468s.198.425-.097.73c-.48.5-1.173 1.205-1.173 1.205z" />
    </svg>
  );
}

type ChatMessage = {
  role: 'bot' | 'user';
  text: string;
};

const INTENTS: { keywords: string[]; reply: string }[] = [
  {
    keywords: ['price', 'cost', 'fee', 'charge', 'paise', 'mrp', 'plan', 'pricing', 'kitna', 'rate'],
    reply: 'Fitplay Gym memberships: Monthly ₹1,200 / Quarterly ₹3,000 / Annual ₹9,600. Our front desk can guide you on the best option for your goals. 💪',
  },
  {
    keywords: ['member', 'join', 'subscription', 'signup', 'sign up', 'register', 'enroll', 'sham', 'admit'],
    reply: 'Joining is easy! Visit the gym or tap "Book a visit" to leave your details — our crew will call you and set up your first look at the floor.',
  },
  {
    keywords: ['hour', 'timing', 'time', 'open', 'close', 'schedule', 'kab', 'kitni der', 'late', 'early'],
    reply: 'We are open Mon–Sat 6:00 AM to 10:00 PM, and Sundays 7:00 AM to 1:00 PM. Come by whenever suits you! ⏰',
  },
  {
    keywords: ['location', 'address', 'where', 'place', 'kahan', 'near', 'kaithal', 'direction', 'map'],
    reply: 'We are near City Centre, Kaithal, Haryana. Find us on Google Maps: https://maps.google.com/?q=Fitplay+Gym+Kaithal 📍',
  },
  {
    keywords: ['phone', 'contact', 'call', 'mobile', 'number', 'msg', 'whatsapp'],
    reply: 'You can reach us at +91 98765 43210, or on Instagram @fitplaykaithal. Message us anytime! 📞',
  },
  {
    keywords: ['instag', 'social', 'follow', 'instagram'],
    reply: 'Follow us on Instagram @fitplaykaithal for daily gym energy and updates! 📸',
  },
  {
    keywords: ['personal', 'trainer', 'training', 'coach', 'one to one', 'guidance'],
    reply: 'We offer personal training — one-to-one guidance that meets you where you are. Our certified trainers build plans around your goals.',
  },
  {
    keywords: ['beginner', 'start', 'new', 'first time', 'naaya', 'fresh', 'foundation', 'start from scratch'],
    reply: 'No experience needed! We have Beginner Foundations — a friendly start with simple plans and zero guesswork. Just show up, we will handle the rest. 🏋️',
  },
  {
    keywords: ['equipment', 'machine', 'weights', 'free weights', 'rack', 'cable', 'functional', 'cardio', 'treadmill', 'dumbbell'],
    reply: 'Our Strength floor has free weights, racks, cables and room to find your form, plus a Functional fitness zone to help you move better and feel ready for real life.',
  },
  {
    keywords: ['free trial', 'demo', 'trial', 'first look', 'visit', 'book', 'look around', 'tour'],
    reply: 'You are welcome to book a free first visit! Tap "Book a visit" on the site or call +91 98765 43210 and we will arrange a good time to show you around.',
  },
  {
    keywords: ['offer', 'discount', 'deal', 'student', 'couple', 'family'],
    reply: 'Check our Memberships page for the latest plans. For student/couple/family offers, call +91 98765 43210 — the crew will sort you out with the best deal! 🎯',
  },
  {
    keywords: ['trainer se', 'diet', 'nutrition', 'diet plan', 'food', 'khana', 'fat lose', 'muscle gain', 'weight loss', 'weight gain', 'fat'],
    reply: 'Our trainers guide you on fitness; for structured diet plans we recommend speaking with our in-house trainer during your visit — results come from training + food! 🥗',
  },
  {
    keywords: ['good morning', 'gm', 'subah', 'good afternoon', 'good evening', 'good night', 'ge', 'shubh', 'dag'],
    reply: timeGreeting(),
  },
  {
    keywords: ['hi', 'hello', 'hey', 'namaste', 'salaam', 'hola', 'yo', 'hii', 'hiii', 'helloo', 'hello bro', 'hlo'],
    reply: 'Hey there! 👋 Welcome to Fitplay Gym Kaithal. Ask me about memberships, timings, training or anything gym related!',
  },
  {
    keywords: ['how are you', 'kaise ho', 'kesi ho', 'kya haal', 'kaise ho aap', 'tek hai', 'aap kaise'],
    reply: 'I am firing on all cylinders! 💪 Always online and ready to help. More importantly — how are YOU? Ready to train today?',
  },
  {
    keywords: ['thanks', 'thank you', 'shukriya', 'ok', 'great', 'nice', 'good', 'awesome', 'bye', 'tata'],
    reply: 'Anytime! 💛 Train with intent — see you on the floor! 💪',
  },
];

const FALLBACK = 'That question is beyond my training range! 😅 Ask me about membership prices, timings, location, or training programs — or call +91 98765 43210 and the crew will help.';

const WELCOME: ChatMessage = {
  role: 'bot',
  text: 'Namaste! 🙏 I am Fitplay AI — your gym assistant for Kaithal. Ask me about memberships, timings, training, or anything else!',
};

export function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, [messages, typing, open]);

  const send = (raw?: string) => {
    const text = (raw ?? input).trim();
    if (!text) return;
    setMessages((m) => [...m, { role: 'user', text }]);
    setInput('');
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages((m) => [...m, { role: 'bot', text: replyFor(text) }]);
    }, 650);
  };

  return (
    <>
      <button
        className={`chat-fab ${open ? 'chat-fab-open' : ''}`}
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? 'Close chat' : 'Open chat'}
        data-testid="chat-fab"
      >
        {open ? <X size={22} /> : <MessageCircle size={24} />}
      </button>

      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noreferrer"
        className="whatsapp-fab"
        aria-label="Chat with owner on WhatsApp"
        data-testid="whatsapp-fab"
      >
        <WhatsAppIcon size={26} />
      </a>

      {open && (
        <div className="chat-window" role="dialog" aria-label="Fitplay chatbot" data-testid="chat-window">
          <div className="chat-header">
            <span className="chat-avatar">💪</span>
            <div>
              <p className="chat-title">Fitplay AI</p>
              <p className="chat-status">Online • replies instantly</p>
            </div>
          </div>
          <div className="chat-body" ref={bodyRef}>
            {messages.map((msg, i) => (
              <div key={i} className={`chat-msg ${msg.role}`}>{msg.text}</div>
            ))}
            {typing && <div className="chat-msg bot chat-typing"><span /><span /><span /></div>}
          </div>
          <form
            className="chat-input"
            onSubmit={(e) => {
              e.preventDefault();
              send();
            }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about membership, timings..."
              aria-label="Chat message"
              data-testid="chat-input"
            />
            <button type="submit" aria-label="Send message" data-testid="chat-send"><Send size={16} /></button>
          </form>
        </div>
      )}
    </>
  );
}

function replyFor(text: string): string {
  const lower = text.toLowerCase();
  for (const intent of INTENTS) {
    if (intent.keywords.some((k) => hasWord(lower, k))) {
      return intent.reply;
    }
  }
  return FALLBACK;
}

function hasWord(text: string, keyword: string): boolean {
  const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`(^|\\s|[.,!?])${escaped}($|\\s|[.,!?])`).test(text);
}

function timeGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning! 🌅 Rise and grind — a perfect time to hit the gym. What can I help you with at Fitplay Gym Kaithal?';
  if (hour < 17) return 'Good afternoon! ☀️ Mid-day energy — great time for a workout. Ask me anything about the gym!';
  if (hour < 21) return 'Good evening! 🌆 The gym is open till 10 PM tonight. What can I help you with?';
  return 'Good night! 🌙 We close at 10 PM — but you can still book a visit for tomorrow. Ask me anything!';
}