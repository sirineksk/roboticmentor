import { useState, useEffect, useCallback, useRef } from 'react';
import {
  Play,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Bot,
  Sparkles,
  Heart,
  Wrench,
  Paperclip,
  Send,
  BookOpen,
  Bug,
  GraduationCap,
  Check,
  X,
  RotateCcw,
  ArrowRightCircle,
} from 'lucide-react';
import { GoogleGenAI } from '@google/genai';

const slides = [
  { image: 'https://images.pexels.com/photos/15470542/pexels-photo-15470542.jpeg?auto=compress&cs=tinysrgb&w=1920', alt: 'Arduino microcontroller' },
  { image: 'https://images.pexels.com/photos/7869034/pexels-photo-7869034.jpeg?auto=compress&cs=tinysrgb&w=1920', alt: 'Child robotics project' },
  { image: 'https://images.pexels.com/photos/15470540/pexels-photo-15470540.jpeg?auto=compress&cs=tinysrgb&w=1920', alt: 'Hands assembling electronics' },
  { image: 'https://images.pexels.com/photos/7869084/pexels-photo-7869084.jpeg?auto=compress&cs=tinysrgb&w=1920', alt: 'Kids STEM education' },
];

function App() {
  const [active, setActive] = useState(0);
  const [mode, setMode] = useState<'explain' | 'debug' | 'quiz'>('explain');
  const [quizTopic, setQuizTopic] = useState('Sensors');
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);
  const timerRef = useRef<number | null>(null);

  const [messages, setMessages] = useState<Array<{ role: 'user' | 'ai'; text: string }>>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const quizTopics = ['Sensors', 'Motors', 'Control Loops', 'Arduino Basics', 'Kinematics'];
  const quizOptions = ['Temperature', 'Light intensity', 'Angular position', 'Magnetic field'];
  const correctIndex = 2;

  const go = useCallback((dir: number) => {
    setActive((prev) => (prev + dir + slides.length) % slides.length);
  }, []);
  const goTo = useCallback((index: number) => setActive(index), []);

  useEffect(() => {
    timerRef.current = window.setInterval(() => {
      setActive((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = window.setInterval(() => {
      setActive((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [active]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') go(1);
      if (e.key === 'ArrowLeft') go(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [go]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userText = input;
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', text: userText }]);
    setLoading(true);

    try {
          const systemPrompt = `You are RoboMentor, a friendly AI tutor for beginner robotics students.
- Explain concepts simply with analogies first, then technical detail.
- When a student shares code, identify bugs and explain why.
- Keep answers under 200 words unless asked for more.
Current mode: ${mode}.`;

    

      console.log('KEY BEING SENT:', import.meta.env.VITE_GROQ_API_KEY);
      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'openai/gpt-oss-120b',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userText },
          ],
        }),
      });

      const data = await res.json();

      console.log('GROQ RESPONSE:', data);

      const reply = data.choices?.[0]?.message?.content ?? 'No response from Groq.';
      setMessages((prev) => [...prev, { role: 'ai', text: reply }]);



    } catch (err) {
      console.error(err);
      setMessages((prev) => [...prev, { role: 'ai', text: 'Error connecting to Gemini. Check your API key.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans antialiased">
      {/* NAV */}
      <header className="fixed top-0 inset-x-0 z-50">
        <div className="mx-auto max-w-[1440px] px-6 md:px-10 h-16 md:h-20 flex items-center justify-between">
          <a href="#" className="flex items-center gap-2.5">
            <span className="w-9 h-9 rounded-xl bg-[#4CAF50] text-black grid place-items-center">
              <Bot className="w-5 h-5" strokeWidth={2.5} />
            </span>
            <span className="text-lg font-bold">Robo<span className="text-[#4CAF50]">Mentor</span></span>
          </a>
          <nav className="hidden md:flex items-center gap-8 text-sm text-white/80">
            {['Home', 'About', 'Tutor', 'Features', 'Contact'].map((i) => (
              <a key={i} href="#" className="hover:text-white">{i}</a>
            ))}
          </nav>
          <button className="flex items-center gap-2 bg-[#4CAF50] hover:bg-[#43a047] text-black font-semibold text-sm px-5 py-2.5 rounded-full">
            Join Us <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* HERO */}
      <main className="relative h-screen w-full overflow-hidden">
        <div className="absolute inset-0">
          {slides.map((slide, i) => (
            <div key={i} className="absolute inset-0 transition-opacity duration-1000" style={{ opacity: i === active ? 1 : 0 }}>
              <img src={slide.image} alt={slide.alt} className="absolute inset-0 w-full h-full object-cover" />
            </div>
          ))}
        </div>
        <div className="absolute inset-0 bg-black/70" />
        <div className="relative z-20 h-full flex flex-col items-center justify-center text-center px-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#4CAF50]/30 bg-[#4CAF50]/10 mb-8">
            <Sparkles className="w-3.5 h-3.5 text-[#4CAF50]" />
            <span className="text-xs tracking-widest uppercase text-white/90">AI-Powered Robotics Tutor · Powered by Gemini</span>
          </div>
          <h1 className="font-bold leading-tight text-[clamp(2.5rem,7vw,5.5rem)] max-w-4xl">
            We Help You Build <span className="text-[#4CAF50]">Your Robot.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-white/70">
            From your first circuit to your first line-following bot — RoboMentor is your AI tutor for every step.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <button className="flex items-center gap-2 bg-[#4CAF50] hover:bg-[#43a047] text-black font-semibold text-base px-7 py-3.5 rounded-full">
              Start Learning <ArrowRight className="w-5 h-5" />
            </button>
            <button className="flex items-center gap-2 bg-white/5 border border-white/30 text-white px-7 py-3.5 rounded-full">
              <Play className="w-4 h-4" /> See How It Works
            </button>
          </div>
        </div>
        <button onClick={() => go(-1)} className="absolute z-30 left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full border border-white/20 bg-black/30 text-white grid place-items-center">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button onClick={() => go(1)} className="absolute z-30 right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full border border-white/20 bg-black/30 text-white grid place-items-center">
          <ChevronRight className="w-5 h-5" />
        </button>
        <div className="absolute z-30 bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2.5">
          {slides.map((_, i) => (
            <button key={i} onClick={() => goTo(i)} className="rounded-full transition-all"
              style={{ width: i === active ? 28 : 8, height: 8, backgroundColor: i === active ? '#4CAF50' : 'rgba(255,255,255,0.4)' }} />
          ))}
        </div>
      </main>

      {/* ABOUT */}
      <section className="bg-white text-[#1a2332] py-24">
        <div className="mx-auto max-w-[1440px] px-6 md:px-10 grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-5xl font-bold">About RoboMentor</h2>
            <p className="mt-7 text-lg text-slate-600">RoboMentor connects beginner robotics students with an AI tutor that explains concepts, debugs code, and quizzes them at their own pace.</p>
            <p className="mt-5 text-lg text-slate-600">No expensive kits or prior experience needed — just curiosity, a laptop, and the will to build.</p>
          </div>
          <div className="relative h-[500px]">
            <img src="https://images.pexels.com/photos/7869086/pexels-photo-7869086.jpeg?auto=compress&cs=tinysrgb&w=1280" alt="Students" className="absolute top-0 right-0 w-[78%] h-[80%] object-cover rounded-3xl shadow-2xl" />
            <img src="https://images.pexels.com/photos/39712879/pexels-photo-39712879.jpeg?auto=compress&cs=tinysrgb&w=900" alt="Circuit" className="absolute bottom-0 left-0 w-[48%] h-[48%] object-cover rounded-3xl shadow-2xl border-4 border-white" />
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="bg-slate-50 py-20">
        <div className="mx-auto max-w-[1440px] px-6 md:px-10 grid sm:grid-cols-3 gap-8">
          {[
            { icon: Heart, value: '5k+', label: 'Students Helped' },
            { icon: Wrench, value: '450', label: 'Projects Built' },
            { icon: Bot, value: '1.2k', label: 'Robots Assembled' },
          ].map(({ icon: Icon, value, label }) => (
            <div key={label} className="bg-white rounded-3xl shadow-lg p-10 text-center flex flex-col items-center">
              <div className="w-16 h-16 rounded-2xl bg-[#4CAF50]/10 grid place-items-center mb-5">
                <Icon className="w-8 h-8 text-[#4CAF50]" />
              </div>
              <div className="text-6xl font-bold text-[#1a2332]">{value}</div>
              <div className="mt-3 text-slate-500">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CHAT */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-[1440px] px-6 md:px-10">
          <div className="text-center mb-12">
            <h2 className="text-5xl font-bold text-[#1a2332]">Try RoboMentor</h2>
            <p className="mt-5 text-lg text-slate-500">Ask a question, paste your code, or take a quiz — all in one place.</p>
          </div>

          <div className="mx-auto max-w-[800px] bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
            <div className="h-[400px] overflow-y-auto p-6 md:p-8 space-y-5 bg-slate-50/50">
              {messages.length === 0 && (
                <div className="flex justify-start items-start gap-3">
                  <div className="shrink-0 w-9 h-9 rounded-xl bg-[#4CAF50] text-black grid place-items-center">
                    <Bot className="w-5 h-5" strokeWidth={2.5} />
                  </div>
                  <div className="max-w-[80%] bg-white border border-slate-200 shadow-sm text-slate-700 rounded-2xl rounded-tl-md px-5 py-3.5 text-sm">
                    <p className="font-semibold text-[#1a2332] mb-1.5">RoboMentor</p>
                    <p>Hi! Ask me anything about robotics — concepts, code, sensors, motors…</p>
                  </div>
                </div>
              )}

              {messages.map((msg, i) =>
                msg.role === 'user' ? (
                  <div key={i} className="flex justify-end">
                    <div className="max-w-[80%] bg-[#DBEAFE] text-slate-800 rounded-2xl rounded-tr-md px-5 py-3.5 text-sm whitespace-pre-wrap">{msg.text}</div>
                  </div>
                ) : (
                  <div key={i} className="flex justify-start items-start gap-3">
                    <div className="shrink-0 w-9 h-9 rounded-xl bg-[#4CAF50] text-black grid place-items-center">
                      <Bot className="w-5 h-5" strokeWidth={2.5} />
                    </div>
                    <div className="max-w-[80%] bg-white border border-slate-200 shadow-sm text-slate-700 rounded-2xl rounded-tl-md px-5 py-3.5 text-sm whitespace-pre-wrap">
                      <p className="font-semibold text-[#1a2332] mb-1.5">RoboMentor</p>
                      <p>{msg.text}</p>
                    </div>
                  </div>
                )
              )}

              {loading && (
                <div className="flex justify-start items-start gap-3">
                  <div className="shrink-0 w-9 h-9 rounded-xl bg-[#4CAF50] text-black grid place-items-center">
                    <Bot className="w-5 h-5" strokeWidth={2.5} />
                  </div>
                  <div className="max-w-[80%] bg-white border border-slate-200 text-slate-500 rounded-2xl rounded-tl-md px-5 py-3.5 text-sm italic">
                    RoboMentor is thinking…
                  </div>
                </div>
              )}
            </div>

            <div className="px-6 md:px-8 pt-5 pb-4 border-t border-slate-100 bg-white">
              <div className="flex flex-wrap gap-2.5">
                <ModeButton active={mode === 'explain'} onClick={() => setMode('explain')} activeClass="bg-[#4CAF50]/15 text-[#2e7d32] border-[#4CAF50]/40" idleClass="bg-[#4CAF50]/10 text-[#2e7d32] border-transparent" icon={<BookOpen className="w-4 h-4" />} label="Explain Concept" />
                <ModeButton active={mode === 'debug'} onClick={() => setMode('debug')} activeClass="bg-orange-100 text-orange-700 border-orange-300" idleClass="bg-orange-50 text-orange-600 border-transparent" icon={<Bug className="w-4 h-4" />} label="Debug My Code" />
                <ModeButton active={mode === 'quiz'} onClick={() => setMode('quiz')} activeClass="bg-purple-100 text-purple-700 border-purple-300" idleClass="bg-purple-50 text-purple-600 border-transparent" icon={<GraduationCap className="w-4 h-4" />} label="Quiz Me" />
              </div>
            </div>

            <div className="px-6 md:px-8 pb-6 pt-2 bg-white">
              <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-2xl pl-3 pr-2 py-2">
                <button className="shrink-0 w-9 h-9 rounded-xl grid place-items-center text-slate-400 hover:text-[#4CAF50]">
                  <Paperclip className="w-5 h-5" />
                </button>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Ask a robotics question or paste your code..."
                  className="flex-1 bg-transparent outline-none text-sm text-slate-700 placeholder:text-slate-400 py-1.5"
                />
                <button
                  onClick={sendMessage}
                  disabled={loading}
                  className="shrink-0 flex items-center gap-2 bg-[#4CAF50] hover:bg-[#43a047] disabled:opacity-50 text-black font-semibold text-sm px-5 py-2.5 rounded-xl"
                >
                  <Send className="w-4 h-4" />
                  {loading ? 'Thinking…' : 'Send'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* QUIZ */}
      <section className="bg-slate-50 py-24">
        <div className="mx-auto max-w-[1440px] px-6 md:px-10">
          <div className="text-center mb-12">
            <h2 className="text-5xl font-bold text-[#1a2332]">Test Your Knowledge</h2>
            <p className="mt-5 text-lg text-slate-500">Pick a topic and RoboMentor will generate a quick quiz.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {quizTopics.map((topic) => (
              <button key={topic} onClick={() => setQuizTopic(topic)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium border ${quizTopic === topic ? 'bg-[#4CAF50] text-white border-[#4CAF50]' : 'bg-white text-[#1a2332] border-slate-200'}`}>
                {topic}
              </button>
            ))}
          </div>
          <div className="mx-auto max-w-[800px] bg-white rounded-3xl shadow-xl border border-slate-100 p-8">
            <h3 className="text-xl font-bold text-[#1a2332] mb-6">What does a potentiometer measure?</h3>
            <div className="space-y-3">
              {quizOptions.map((option, i) => {
                const isCorrect = i === correctIndex;
                const isSelected = quizAnswer === i;
                const answered = quizAnswer !== null;
                let stateClass = 'border-slate-200 bg-white';
                if (answered && isCorrect) stateClass = 'border-[#4CAF50] bg-[#4CAF50]/10';
                else if (answered && isSelected && !isCorrect) stateClass = 'border-red-400 bg-red-50';
                else if (answered) stateClass = 'border-slate-200 opacity-60';
                return (
                  <button key={i} onClick={() => !answered && setQuizAnswer(i)} disabled={answered}
                    className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl border-2 text-left ${stateClass}`}>
                    <span className={`shrink-0 w-8 h-8 rounded-lg grid place-items-center text-sm font-bold ${answered && isCorrect ? 'bg-[#4CAF50] text-white' : answered && isSelected && !isCorrect ? 'bg-red-400 text-white' : 'bg-slate-100 text-slate-500'}`}>
                      {answered && isCorrect ? <Check className="w-4 h-4" /> : answered && isSelected && !isCorrect ? <X className="w-4 h-4" /> : String.fromCharCode(65 + i)}
                    </span>
                    <span className="text-base font-medium text-[#1a2332]">{option}</span>
                  </button>
                );
              })}
            </div>
            {quizAnswer !== null && (
              <div className="mt-6 bg-slate-50 border border-slate-200 rounded-2xl p-5 text-sm text-slate-600">
                <strong>{quizAnswer === correctIndex ? 'Correct!' : 'Not quite.'}</strong> A potentiometer measures angular position.
              </div>
            )}
          </div>
          <div className="mx-auto max-w-[800px] flex justify-between mt-8">
            <button onClick={() => setQuizAnswer(null)} className="flex items-center gap-2 text-sm text-slate-500">
              <RotateCcw className="w-4 h-4" /> Start Over
            </button>
            <button className="flex items-center gap-2 bg-[#4CAF50] text-black font-semibold text-sm px-6 py-3 rounded-full">
              Next Question <ArrowRightCircle className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-[1440px] px-6 md:px-10">
          <div className="text-center mb-12">
            <h2 className="text-5xl font-bold text-[#1a2332]">What RoboMentor Can Do For You</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: BookOpen, title: 'Explain Concepts', desc: 'Complex ideas explained simply, with real robot examples.' },
              { icon: Bug, title: 'Debug Your Code', desc: 'Paste your Arduino or Python code and get instant feedback.' },
              { icon: GraduationCap, title: 'Take a Quiz', desc: 'Test yourself on sensors, motors, and control loops.' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white rounded-3xl border border-slate-200 p-8">
                <div className="w-14 h-14 rounded-2xl bg-[#4CAF50]/10 grid place-items-center mb-5">
                  <Icon className="w-7 h-7 text-[#4CAF50]" />
                </div>
                <h3 className="text-xl font-bold text-[#1a2332] mb-3">{title}</h3>
                <p className="text-slate-500 text-sm">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#0a0a0a] text-white pt-16 pb-8">
        <div className="mx-auto max-w-[1440px] px-6 md:px-10">
          <div className="grid md:grid-cols-3 gap-10 pb-10 border-b border-white/10">
            <div>
              <div className="flex items-center gap-2.5 mb-4">
                <span className="w-9 h-9 rounded-xl bg-[#4CAF50] text-black grid place-items-center">
                  <Bot className="w-5 h-5" strokeWidth={2.5} />
                </span>
                <span className="text-lg font-bold">Robo<span className="text-[#4CAF50]">Mentor</span></span>
              </div>
              <p className="text-sm text-white/50">Your AI tutor for robotics.</p>
            </div>
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider mb-4">Quick Links</h4>
              <ul className="space-y-2.5">
                {['Home', 'About', 'Tutor', 'Features', 'Contact'].map((item) => (
                  <li key={item}><a href="#" className="text-sm text-white/50 hover:text-[#4CAF50]">{item}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider mb-4">Follow Us</h4>
              <div className="flex gap-3">
                {['G', 'T', 'L'].map((l, i) => (
                  <a key={i} href="#" className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 grid place-items-center text-white/60">
                    <span className="text-xs font-bold">{l}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
          <div className="pt-8 text-center">
            <p className="text-xs text-white/40">© 2026 RoboMentor.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function ModeButton({ active, onClick, activeClass, idleClass, icon, label }: {
  active: boolean; onClick: () => void; activeClass: string; idleClass: string; icon: React.ReactNode; label: string;
}) {
  return (
    <button onClick={onClick} className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border ${active ? activeClass : idleClass}`}>
      {icon}{label}
    </button>
  );
}

export default App;