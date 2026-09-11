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

const INTENTS: { keywords: string[]; replies: string[] }[] = [
  {
    keywords: ['workout plan', 'training plan', 'gym plan', 'routine', 'program', 'split', 'schedule workout'],
    replies: [
      'Start with a simple full-body routine 3–4 days a week: Squat, Press, Row and a hinge. Rest days are just as important as training days! 🏋️',
      'A balanced week: Mon Push, Tue Pull, Wed Legs, Thu Rest, Fri Full body, Sat core + cardio. Track your lifts and add a little weight each week.',
      'For beginners, full body 3x/week is perfect. Advanced lifters do great on push/pull/legs. Want me to break it down even more? 💪',
    ],
  },
  {
    keywords: ['weight loss', 'lose weight', 'fat loss', 'fat lose', 'fat', 'slim', 'tond', 'belly', 'moti', 'padhha'],
    replies: [
      'Fat loss is 70% food, 30% training. Stay in a small calorie deficit, lift weights to protect muscle, walk 8–10k steps a day, sleep well. Steady wins! 🔥',
      'Lose fat sustainably: eat slightly less but high-protein, lift heavy, add daily walking, 7–8 hours sleep. No crash diets — they always bounce back! 🥗',
      'Nobody spot-reduces belly fat! Full-body strength + calorie deficit + cardio does the job. Keep protein high at every meal. 💪',
    ],
  },
  {
    keywords: ['weight gain', 'gain weight', 'muscle gain', 'build muscle', 'muscle build', 'bulk', 'patla', 'dubala'],
    replies: [
      'To build muscle: progressive overload in training + a small calorie surplus with 1.6–2g protein per kg bodyweight. Muscle literally grows while you sleep! 💪',
      'Bulking done right: extra 300–500 calories daily, lots of protein, big compound lifts (squat, deadlift, bench, rows), 7–9 hours sleep.',
      'Muscle needs three things: stimulus (lifting), fuel (food), and time (recovery). Hit all three and the mirror rewards you. Our trainers set up a plan on your first visit!',
    ],
  },
  {
    keywords: ['protein', 'supplement', 'whey', 'creatine', 'mass gainer', 'gainer', 'shakti powder'],
    replies: [
      'Whey protein and creatine are the two most researched supplements — safe and effective. But real food comes first: eggs, chicken, paneer, dal, curd! 🍳',
      'Creatine 3–5g daily boosts strength and recovery. Whey is convenient, not mandatory — whole-food protein works just as well. Ask our trainer for guidance before starting.',
      'Top protein sources: eggs, chicken, fish, paneer, soya, dal, curd + a whey scoop post-workout if needed. Aim ~1.6–2g per kg bodyweight daily. 💛',
    ],
  },
  {
    keywords: ['diet', 'nutrition', 'diet plan', 'food', 'khana', 'diet chart', 'healthy food', 'meal'],
    replies: [
      'Train hard, but fuel smarter! Build every meal around protein + vegetables + some good carbs. A simple diet chart: eggs/porridge in the morning, dal-chicken-rice for lunch, light dinner before 9 PM. 🥗',
      'There is no magic food — just consistency. Eat protein with every meal, cut sugary drinks, keep veggies half your plate. Our in-house trainer can make you a proper diet plan on a visit!',
      'Nutrition tip: 80% healthy food, 20% you still enjoy life. That balance is what actually works long-term! 💛',
    ],
  },
  {
    keywords: ['sore', 'soreness', 'pain', 'recovery', 'recover', 'rest', 'rest day', 'sleep', 'muscle pain', 'body pain'],
    replies: [
      'Soreness is normal — muscle repair takes 24–72 hours. Light movement, water, protein and good sleep speed it up. Severe pain? Rest and talk to a coach. 😴',
      'Training hard is good, recovering harder is better! Sleep 7–9 hours, eat enough protein, take rest days seriously. That is when you actually grow.',
      'Sore but active is fine; sharp or joint pain is not. Come in rest day, do light walking/stretching. Most "no gain" problems are really "no sleep" problems! 🌙',
    ],
  },
  {
    keywords: ['injury', 'injured', 'back pain', 'knee pain', 'form', 'technique', 'safe', 'hurt', 'avoid injury'],
    replies: [
      'Never trade form for weight! Start light, perfect your technique, and let a coach check your lifts. A safe session beats a show-off session every time. 🛡️',
      'If you have back/knee pain, do not push heavy through it. Tell our trainers — we adjust exercises to your body. Working around an old injury is a skill!',
      'Key form tips: brace your core, keep a neutral spine, control the weight on the way down. Slow is smooth, smooth is strong.',
    ],
  },
  {
    keywords: ['warmup', 'warm up', 'stretch', 'stretching', 'mobility', 'cool down'],
    replies: [
      'Always warm up 5–10 minutes before lifting: light cardio, arm circles, hip openers, empty-bar reps. A warm muscle is a strong, safe muscle! 🔥',
      'Dynamic stretching before training, static stretching after. Spend extra time on whatever you will train that day — your joints will thank you.',
      'Warm-up template: 3–5 min cardio → mobility drills → lighter sets of your first exercise. Never skip it, especially early morning!',
    ],
  },
  {
    keywords: ['chest', 'back exercise', 'leg exercise', 'biceps', 'bicep', 'triceps', 'tricep', 'shoulder', 'abs', 'core', 'glutes', 'squat', 'deadlift', 'bench', 'pushup', 'push up', 'pull up', 'lunge', 'plank', 'legs', 'arms', 'bhai kaun sa exercise', 'exercise karo'],
    replies: [
      'Quick picks — Chest: bench press + push-ups. Back: pull-ups + rows. Legs: squats + lunges. Core: planks + hanging knee raises. Full coverage any day! 🏋️',
      'Squat and deadlift are the kings — they hit the whole body. Bench press and rows build the upper half. Planks build that core stability. Want a full split?',
      'Pick 1 big lift + 2 smaller moves per muscle group. Example chest day: Bench → incline DB press → cable flies. That is enough for serious growth!',
    ],
  },
  {
    keywords: ['cardio', 'running', 'treadmill', 'run', 'jog', 'cycling', 'cycling kar', 'fat burn cardio', 'walk'],
    replies: [
      'Cardio options at Fitplay: treadmills, cycles and our functional zone. Mix steady walks with short bursts — intervals torch fat and boost stamina! 🏃',
      'Best combo for fat loss: strength training 3–4x/week + 2–3 cardio sessions (20–30 min). Walk daily even on rest days — moves matter!',
      'Hit-and-go cardio tip: 20 minutes at a comfortable pace is plenty. Consistency beats intensity for long-term health. 💛',
    ],
  },
  {
    keywords: ['home workout', 'no equipment', 'without equipment', 'bodyweight', 'body weight', 'ghar par', 'home par', 'jack'],
    replies: [
      'You can absolutely train at home: push-ups, squats, lunges, planks, glute bridges — all bodyweight gold. Do 3–4 rounds and feel the burn! 💪',
      'Bodyweight circuit: 15 push-ups, 20 squats, 15 lunges, 30s plank, 10 glute bridges. 3 rounds, rest 60s between. No equipment needed!',
      'Progressive overload works at home too — add reps, slow down each rep, or pause at the bottom. Your body is the machine!',
    ],
  },
  {
    keywords: ['women', 'ladies', 'girl', 'mahila', 'female', 'get healthy'],
    replies: [
      'Absolutely! The gym floor is for everyone — we have strength, functional and cardio zones, and female members train alongside everyone, supported by our crew. 💪',
      'Ladies, lifting weights will NOT make you bulky — it makes you toned and strong! We will structure a plan for exactly what you want.',
      'We are a friendly, respectful space for all. Come for a free visit, the crew will show you around and answer every question. 🙌',
    ],
  },
  {
    keywords: ['senior', 'old age', 'old person', 'age', 'kids', 'child', 'children', 'teenager', 'student'],
    replies: [
      'Fitness has no age limit! For seniors we focus on mobility, balance and light strength. For kids/teens, supervised movement and fun — not max weights. 🌱',
      'Teenagers and students are very welcome! Proper form and supervised training build a fantastic base for life. Ask us about student offers.',
      'Every body can train — it is about adjusting the plan to the person. Tell us the age, a coach will design something perfect.',
    ],
  },
  {
    keywords: ['how much time', 'how long', 'results', 'progress', 'when will i', 'kitne din me', 'kitne mahine', 'change dikhe'],
    replies: [
      'Realistic expectations: 4–6 weeks for noticeable energy, 8–12 weeks for visible change, months for a full transformation. You cannot rush a good body — enjoy the process! ⏳',
      'Consistency is the secret. 90% of results come from simply showing up week after week. Give it 12 weeks of honest effort and see the difference.',
      'Newbie gains are real — beginners often see fast progress in the first few months. After that, small weekly improvements add up. Stay patient! 💛',
    ],
  },
  {
    keywords: ['etiquette', 'rules', 'phone', 'music', 'gym rules', 'manner'],
    replies: [
      'Gym 101: rerack your weights, wipe the bench after use, keep phones on silent, and spot your buddy. Mutual respect = great energy on the floor! 🤝',
      'Our only hard rules: put weights back, no filming others without permission, and zero ego lifting. Everything else, we are flexible!',
    ],
  },
  {
    keywords: ['owner', 'founder', 'who runs', 'kaun chalata', 'malik', 'ravi', 'ravi kumar'],
    replies: [
      'Fitplay Gym is founded and run by Ravi Kumar — a coach who believes your best session is the one you make it to. He and the crew are almost always around! 💛',
      'Our founder Ravi Kumar built Fitplay in Kaithal in 2017 with one idea: a gym should feel like home. Walk in, he will happily greet you!',
    ],
  },
  {
    keywords: ['about gym', 'about fitplay', 'what is fitplay', 'about', 'story', 'history', 'kaise bani', 'background'],
    replies: [
      'Fitplay started in 2017 in Kaithal with a simple belief — a gym should feel like a place you want to return to. Good equipment, familiar faces, and one more rep. 🏋️',
      'We are Kaithal\u2019s training ground. Strength floor, functional zone, personal training, and a crew that pushes you — come as you are, train with intent.',
    ],
  },
  {
    keywords: ['price', 'cost', 'fee', 'charge', 'paise', 'mrp', 'pricing', 'kitna', 'rate', 'plan', 'kitne me', 'kitne rupaye'],
    replies: [
      'Fitplay Gym memberships: Monthly ₹1,200 / Quarterly ₹3,000 / Annual ₹9,600. The annual saves you ₹4,800 overall — great value! 💛',
      'Plans: Monthly ₹1,200, Quarterly ₹3,000, Annual ₹9,600. Tap "Memberships" in the menu to compare them side by side.',
      'Pricing starts at ₹1,200/month. Quarterly and Annual plans give extra savings. Want the recommendation? For consistency, quarterly is the sweet spot! 💪',
    ],
  },
  {
    keywords: ['member', 'join', 'subscription', 'signup', 'sign up', 'register', 'enroll', 'admit', 'sham ho', 'join karna'],
    replies: [
      'Joining is easy! Visit the gym or tap "Book a visit" and leave your details — our crew will call you and set everything up. 💪',
      'You can join in 2 minutes at the front desk! Bring yourself (and your water bottle). Tap "Book a visit" and we will do the rest.',
      'Becoming a member: come for a free look, pick your plan, and you are in. We take care of the paperwork, you take care of the reps!',
    ],
  },
  {
    keywords: ['hour', 'timing', 'time', 'open', 'close', 'kab', 'kitni der', 'late', 'early', 'kholte', 'band'],
    replies: [
      'We are open Mon–Sat 6:00 AM to 10:00 PM, Sundays 7:00 AM to 1:00 PM. Even early birds and late workers are covered! ⏰',
      'Timings: Mon–Sat 6 AM–10 PM, Sun 7 AM–1 PM. Early mornings are usually the quietest — perfect if you like a calm floor.',
      'Open six days 6 AM to 10 PM, Sunday morning only! Best time to avoid rush: before 8 AM or after 8 PM. 🕗',
    ],
  },
  {
    keywords: ['location', 'address', 'where', 'place', 'near', 'kaithal', 'direction', 'map', 'kahan', 'kaha hai'],
    replies: [
      'We are near City Centre, Kaithal, Haryana. Open it in Maps: https://maps.google.com/?q=Fitplay+Gym+Kaithal 📍',
      'Find us near City Centre in Kaithal — easy to spot, plenty of parking nearby. Tap "Open in Maps" on our Contact page for exact directions!',
      'Right in the heart of Kaithal, near City Centre. Anyone around there can point you to us! 📍',
    ],
  },
  {
    keywords: ['phone', 'contact', 'call', 'mobile', 'number', 'whatsapp', 'msg', 'contact number'],
    replies: [
      'Call or WhatsApp us at +91 98765 43210, or DM @fitplaykaithal on Instagram. Message anytime — we reply fast! 📞',
      'You can also tap the green WhatsApp button on this site to chat with the owner directly. Easiest way to reach us! 📱',
      'Reach the crew at +91 98765 43210. Prefer WhatsApp? Use the green button — we answer quickly!',
    ],
  },
  {
    keywords: ['instag', 'social', 'follow', 'instagram'],
    replies: [
      'Follow us on Instagram @fitplaykaithal for daily gym energy, member spotlights and updates! 📸',
      'Instagram: @fitplaykaithal — see the floor, the lifts and the Fitplay family before you even visit!',
    ],
  },
  {
    keywords: ['personal', 'trainer', 'coach', 'one to one', 'guidance', 'personal training'],
    replies: [
      'We offer personal training — one-to-one guidance that meets you exactly where you are. Certified trainers, custom plans, real accountability! 💪',
      'Personal training at Fitplay = your goals, your pace, a coach who watches your form and tracks your progress. Ask the front desk to book a session!',
    ],
  },
  {
    keywords: ['beginner', 'start', 'new', 'first time', 'naaya', 'fresh', 'foundation', 'start from scratch', 'naya seekhna', 'kese kare'],
    replies: [
      'No experience needed! Our Beginner Foundations program gives you simple plans and zero guesswork. Just show up — we handle the rest. 🏋️',
      'Everyone starts as a beginner! Come for a free visit, tell us you are new, and we will teach you the basics step by step. No judgment, ever. 🙌',
      'Newbie here is a good thing! You get to build habits the right way from day one. Start with full-body basics 3x/week and you will fly.',
    ],
  },
  {
    keywords: ['equipment', 'machine', 'weights', 'free weights', 'rack', 'cable', 'functional', 'dumbbell', 'barbell', 'kettlebell', 'bench'],
    replies: [
      'Our Strength floor has free weights, racks, cables and plenty of room to find your form, plus a Functional zone for real-life movement. Everything you need, nothing you do not! 💪',
      'We carry dumbbells up to heavy, barbells, racks, cables, functional gear and cardio machines. Tell us what you like to train — it is all here!',
      'Full setup at Fitplay: strength machines, free weights, functional turf zone and cardio. Enough variety to keep workouts fresh for years!',
    ],
  },
  {
    keywords: ['free trial', 'demo', 'trial', 'first look', 'visit', 'book', 'look around', 'tour', 'pehli visit', 'free visit'],
    replies: [
      'You are welcome to book a free first visit! Tap "Book a visit" on the site or call +91 98765 43210, and we will arrange a good time to show you around.',
      'Yes, we do free visits! Come see the floor, meet the crew, try a quick orientation — no pressure at all. Tap "Book a visit" and we will call you!',
      'First look is on us. Leave your details via "Book a visit" and the crew will set up your tour. Bring questions, we love them! 💛',
    ],
  },
  {
    keywords: ['offer', 'discount', 'deal', 'student', 'couple', 'family', 'special offer'],
    replies: [
      'We keep it simple at Fitplay — honest prices, and the longer you commit the more you save (₹600 on quarterly, ₹4,800 on annual). For student/couple/family offers, call +91 98765 43210! 🎯',
      'Best current deal: the Annual plan saves ₹4,800 — cheapest per month. For special offers, tap the WhatsApp button and ask the owner directly!',
      'Check our Memberships page for the latest plans and savings. Discounts for students and families are best discussed at the front desk — they will sort you out!',
    ],
  },
  {
    keywords: ['class', 'classes', 'group', 'group class', 'zumba', 'yoga', 'aerobics', 'session'],
    replies: [
      'We run focused training sessions and personal coaching — from strength foundations to functional fitness. Ask the front desk about the current class schedule! 🏋️',
      'Our sessions: strength, functional fitness, beginner foundations and personal training. Everything is coach-led, so your form stays spot on.',
    ],
  },
  {
    keywords: ['good morning', 'gm', 'subah', 'good afternoon', 'good evening', 'good night', 'ge', 'shubh', 'dag'],
    replies: [timeGreeting()],
  },
  {
    keywords: ['hi', 'hello', 'hey', 'namaste', 'salaam', 'hola', 'yo', 'hii', 'hiii', 'helloo', 'hello bro', 'hlo', 'hey there'],
    replies: [
      'Hey there! 👋 Welcome to Fitplay Gym Kaithal. Ask me about memberships, timings, training, workouts — anything gym related!',
      'Hello! 🙏 Great to see you. I can help with prices, timings, workouts, diets and more. What would you like to know?',
      'Namaste! 💛 Ready to answer anything about Fitplay. Weights, plans, timings — ask away!',
    ],
  },
  {
    keywords: ['how are you', 'kaise ho', 'kesi ho', 'kya haal', 'kaise ho aap', 'tek hai', 'aap kaise', 'kya kar rahe'],
    replies: [
      'I am firing on all cylinders! 💪 Always online and ready to help. More importantly — how are YOU? Ready to train today?',
      'Better now that you asked! 😄 Asking great questions and loving my job. What can I do for you at Fitplay?',
      'Energetic as ever! How about you — already done your workout today, or planning one?',
    ],
  },
  {
    keywords: ['who are you', 'your name', 'tum kaun', 'tumhara naam', 'kya naam', 'whats your name', 'aap kaun'],
    replies: [
      'I am Fitplay AI — your friendly gym assistant born right here at Fitplay Gym Kaithal! 🤖💪 I answer questions about the gym and fitness. What do you want to know?',
      'Fitplay AI at your service! Think of me as the front desk that never sleeps. Ask me anything about memberships, training or workouts!',
    ],
  },
  {
    keywords: ['help', 'help me', 'what can you do', 'kya kar sakte', 'madad', 'options', 'commands', 'kya puchu'],
    replies: [
      'I can help with: membership prices, timings, location, contact, training programs, workouts, diet and fat loss, beginner tips and more! Just type your question. 💪',
      'Here is what I know best: 💰 Prices & plans · ⏰ Timings · 📍 Location · 🏋️ Workouts & training · 🥗 Diet tips. Fire away!',
      'Try asking me like: "membership kya hai?", "gym timings", "fat loss tips", "chest workout", or "owner kaun hai". I have got you!',
    ],
  },
  {
    keywords: ['thanks', 'thank you', 'shukriya', 'dhanyawad', 'thank you so much'],
    replies: [
      'Anytime! 💛 Train with intent — see you on the floor! 💪',
      'You are most welcome! Remember, every rep counts. Come stronger tomorrow!',
      'Glad I could help! 💪 If you ever need anything else, I am right here.',
    ],
  },
  {
    keywords: ['ok', 'great', 'nice', 'good', 'awesome', 'cool', 'perfect', 'nice site', 'love', 'best', 'acha'],
    replies: [
      'Glad you like it! 💛 Want to know more about the gym, or ready to book your first visit?',
      'Awesome! 🙌 Feel free to ask me anything earlier — trainers, plans, timings — I am all ears.',
      'Thanks! The real magic happens on the floor though. Come try it! 💪',
    ],
  },
  {
    keywords: ['bye', 'tata', 'goodbye', 'alvida', 'gym jata', 'see you'],
    replies: [
      'See you on the floor! 💪 Train hard, stay consistent. Bye for now! 👋',
      'Goodbye! Remember — future you is watching. Come back stronger tomorrow! 💛',
      'Bye! If you need a workout plan or prices later, I am one message away. 💪',
    ],
  },
  {
    keywords: ['joke', 'humour', 'humor', 'funny', 'chutkula', 'mazak'],
    replies: [
      'Why do bodybuilders never use elevators? Because they are afraid of failing the reps! 😄 On a serious note — your form matters more than your jokes.',
      'I would tell you a gym joke, but I am still working on my form! 😄 Now, back to training — want a workout plan?',
      'How much does a gym cost? Reps! ...Okay, that was free. 💛 Ask me about real memberships and I will give actual answers!',
    ],
  },
];

const FALLBACK = [
  'Hmm, that is beyond my training range! 😅 I know plenty about membership prices, timings, location, workouts, diet and training programs. Try asking me one of those — or call +91 98765 43210 and the crew will help!',
  'I did not quite catch that one! 🤔 But I can help with: prices, timings, location, workouts, beginner tips and more. Or tap the green WhatsApp button to ask the owner directly!',
  'That one is out of my gym zone! 🏋️ Ask me about memberships, timings, weight loss, workouts, or the owner — and I will answer in seconds.',
].join('\n\n');

const WELCOME: ChatMessage = {
  role: 'bot',
  text: 'Namaste! 🙏 I am Fitplay AI — your gym assistant for Kaithal. I can talk about memberships, timings, location, workouts, diet and more. What would you like to know?',
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
      return intent.replies[Math.floor(Math.random() * intent.replies.length)];
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