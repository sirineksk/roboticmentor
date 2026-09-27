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

const slides = [
  {
    image:
      'https://images.pexels.com/photos/15470542/pexels-photo-15470542.jpeg?auto=compress&cs=tinysrgb&w=1920',
    alt: 'Arduino microcontroller connected to a breadboard with a glowing LED',
  },
  {
    image:
      'https://images.pexels.com/photos/7869034/pexels-photo-7869034.jpeg?auto=compress&cs=tinysrgb&w=1920',
    alt: 'A child assembling a robotics project with electronic components',
  },
  {
    image:
      'https://images.pexels.com/photos/15470540/pexels-photo-15470540.jpeg?auto=compress&cs=tinysrgb&w=1920',
    alt: 'Hands assembling electronic components on a breadboard with wires',
  },
  {
    image:
      'https://images.pexels.com/photos/7869084/pexels-photo-7869084.jpeg?auto=compress&cs=tinysrgb&w=1920',
    alt: 'Group of kids working on a robotics project, engaging in STEM education',
  },
];

function App() {
  const [active, setActive] = useState(0);
  const [mode, setMode] = useState<'explain' | 'debug' | 'quiz'>('explain');
  const [quizTopic, setQuizTopic] = useState('Sensors');
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);
  const timerRef = useRef<number | null>(null);

  const quizTopics = ['Sensors', 'Motors', 'Control Loops', 'Arduino Basics', 'Kinematics'];
  const quizOptions = [
    'Temperature',
    'Light intensity',
    'Angular position',
    'Magnetic field',
  ];
  const correctIndex = 2;

  const go = useCallback((dir: number) => {
    setActive((prev) => (prev + dir + slides.length) % slides.length);
  }, []);

  const goTo = useCallback((index: number) => {
    setActive(index);
  }, []);

  // Auto-rotate every 4 seconds
  useEffect(() => {
    timerRef.current = window.setInterval(() => {
      setActive((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Reset timer on manual navigation
  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = window.setInterval(() => {
      setActive((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [active]);

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') go(1);
      if (e.key === 'ArrowLeft') go(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [go]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans antialiased selection:bg-[#4CAF50] selection:text-black">
      {/* Nav bar */}
      <header className="fixed top-0 inset-x-0 z-50">
        <div className="mx-auto max-w-[1440px] px-6 md:px-10 h-16 md:h-20 flex items-center justify-between">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2.5 group">
            <span className="w-9 h-9 rounded-xl bg-[#4CAF50] text-black grid place-items-center transition-transform group-hover:rotate-6 duration-300">
              <Bot className="w-5 h-5" strokeWidth={2.5} />
            </span>
            <span className="text-lg font-bold tracking-tight">
              Robo<span className="text-[#4CAF50]">Mentor</span>
            </span>
          </a>

          {/* Center links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-white/80">
            {['Home', 'About', 'Tutor', 'Features', 'Contact'].map((item) => (
              <a
                key={item}
                href="#"
                className="relative py-1 hover:text-white transition-colors after:absolute after:left-0 after:bottom-0 after:h-px after:w-0 hover:after:w-full after:bg-[#4CAF50] after:transition-all after:duration-300"
              >
                {item}
              </a>
            ))}
          </nav>

          {/* Join button */}
          <button className="group flex items-center gap-2 bg-[#4CAF50] hover:bg-[#43a047] text-black font-semibold text-sm px-5 py-2.5 rounded-full transition-all hover:shadow-[0_0_24px_-4px_rgba(76,175,80,0.6)]">
            Join Us
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      </header>

      {/* Hero */}
      <main className="relative h-screen w-full overflow-hidden">
        {/* Slides */}
        <div className="absolute inset-0">
          {slides.map((slide, i) => (
            <div
              key={i}
              className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
              style={{ opacity: i === active ? 1 : 0 }}
              aria-hidden={i !== active}
            >
              <img
                src={slide.image}
                alt={slide.alt}
                className={`absolute inset-0 w-full h-full object-cover ${
                  i === active ? 'scale-105' : 'scale-100'
                }`}
                style={{ transition: 'transform 4500ms ease-out' }}
                loading={i === 0 ? 'eager' : 'lazy'}
                draggable={false}
              />
            </div>
          ))}
        </div>

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/70" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/50" />

        {/* Content */}
        <div className="relative z-20 h-full mx-auto max-w-[1440px] px-6 md:px-10 flex flex-col items-center justify-center text-center">
          {/* Badge */}
          <div
            key={`badge-${active}`}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#4CAF50]/30 bg-[#4CAF50]/10 backdrop-blur-sm mb-8 animate-[fadeUp_600ms_ease-out_both]"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#4CAF50]" />
            <span className="text-[11px] md:text-xs tracking-[0.18em] uppercase text-white/90 font-medium">
              AI-Powered Robotics Tutor · Powered by Gemini
            </span>
          </div>

          {/* Headline */}
          <h1
            key={`title-${active}`}
            className="font-bold leading-[1.05] tracking-tight text-[clamp(2.5rem,7vw,5.5rem)] max-w-4xl animate-[fadeUp_700ms_ease-out_both]"
          >
            We Help You Build{' '}
            <span className="text-[#4CAF50]">Your Robot.</span>
          </h1>

          {/* Subheadline */}
          <p
            key={`sub-${active}`}
            className="mt-6 max-w-2xl text-base md:text-lg text-white/70 leading-relaxed animate-[fadeUp_800ms_ease-out_both]"
          >
            From your first circuit to your first line-following bot — RoboMentor
            is your AI tutor for every step.
          </p>

          {/* Buttons */}
          <div
            key={`btns-${active}`}
            className="mt-10 flex flex-col sm:flex-row items-center gap-4 animate-[fadeUp_900ms_ease-out_both]"
          >
            <button className="group flex items-center gap-2 bg-[#4CAF50] hover:bg-[#43a047] text-black font-semibold text-base px-7 py-3.5 rounded-full transition-all hover:shadow-[0_0_32px_-4px_rgba(76,175,80,0.7)]">
              Start Learning
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </button>
            <button className="group flex items-center gap-2 bg-white/5 backdrop-blur-sm border border-white/30 hover:border-white/60 hover:bg-white/10 text-white font-medium text-base px-7 py-3.5 rounded-full transition-all">
              <span className="w-7 h-7 rounded-full border border-white/40 grid place-items-center group-hover:border-white group-hover:bg-white/10 transition-all">
                <Play className="w-3 h-3 ml-0.5 fill-white" />
              </span>
              See How It Works
            </button>
          </div>
        </div>

        {/* Left arrow */}
        <button
          onClick={() => go(-1)}
          aria-label="Previous slide"
          className="group absolute z-30 left-4 md:left-8 top-1/2 -translate-y-1/2 w-11 h-11 md:w-12 md:h-12 rounded-full border border-white/20 bg-black/30 backdrop-blur-sm hover:bg-[#4CAF50] hover:border-[#4CAF50] hover:text-black grid place-items-center transition-all"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Right arrow */}
        <button
          onClick={() => go(1)}
          aria-label="Next slide"
          className="group absolute z-30 right-4 md:right-8 top-1/2 -translate-y-1/2 w-11 h-11 md:w-12 md:h-12 rounded-full border border-white/20 bg-black/30 backdrop-blur-sm hover:bg-[#4CAF50] hover:border-[#4CAF50] hover:text-black grid place-items-center transition-all"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Dot indicators */}
        <div className="absolute z-30 bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2.5">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Go to slide ${i + 1}`}
              className="rounded-full transition-all duration-300"
              style={{
                width: i === active ? 28 : 8,
                height: 8,
                backgroundColor: i === active ? '#4CAF50' : 'rgba(255,255,255,0.4)',
              }}
            />
          ))}
        </div>
      </main>

      {/* About RoboMentor */}
      <section className="bg-white text-[#1a2332] py-24 md:py-32">
        <div className="mx-auto max-w-[1440px] px-6 md:px-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left: text */}
            <div>
              <span className="inline-flex items-center gap-2 text-sm font-semibold text-[#4CAF50] tracking-[0.15em] uppercase mb-5">
                <span className="w-8 h-px bg-[#4CAF50]" />
                Who We Are
              </span>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.05] tracking-tight text-[#1a2332]">
                About RoboMentor
              </h2>
              <p className="mt-7 text-lg text-slate-600 leading-relaxed max-w-xl">
                RoboMentor connects beginner robotics students with an AI tutor
                that explains concepts, debugs code, and quizzes them at their
                own pace.
              </p>
              <p className="mt-5 text-lg text-slate-600 leading-relaxed max-w-xl">
                No expensive kits or prior experience needed — just curiosity, a
                laptop, and the will to build. We guide you from your first LED to
                your first autonomous robot.
              </p>
              <button className="group mt-9 inline-flex items-center gap-2 bg-[#4CAF50] hover:bg-[#43a047] text-black font-semibold text-base px-7 py-3.5 rounded-full transition-all hover:shadow-[0_0_32px_-4px_rgba(76,175,80,0.7)]">
                Learn More
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </button>
            </div>

            {/* Right: overlapping images */}
            <div className="relative h-[420px] md:h-[520px] lg:h-[560px]">
              <img
                src="https://images.pexels.com/photos/7869086/pexels-photo-7869086.jpeg?auto=compress&cs=tinysrgb&w=1280"
                alt="Smiling students collaborating on a robotics project"
                className="absolute top-0 right-0 w-[78%] h-[80%] object-cover rounded-3xl shadow-2xl"
                loading="lazy"
              />
              <img
                src="https://images.pexels.com/photos/39712879/pexels-photo-39712879.jpeg?auto=compress&cs=tinysrgb&w=900"
                alt="Close-up of circuit board assembly with colorful wires and LED lights"
                className="absolute bottom-0 left-0 w-[48%] h-[48%] object-cover rounded-3xl shadow-2xl border-4 border-white"
                loading="lazy"
              />
              {/* Decorative accent */}
              <div className="absolute -top-4 -left-4 w-24 h-24 rounded-3xl bg-[#4CAF50]/10 -z-10 hidden md:block" />
              <div className="absolute -bottom-4 -right-4 w-20 h-20 rounded-full bg-[#4CAF50]/10 -z-10 hidden md:block" />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-slate-50 py-20 md:py-24">
        <div className="mx-auto max-w-[1440px] px-6 md:px-10">
          <div className="grid sm:grid-cols-3 gap-6 md:gap-8">
            {/* Card 1 */}
            <div className="bg-white rounded-3xl shadow-[0_8px_40px_-12px_rgba(0,0,0,0.12)] p-10 text-center flex flex-col items-center transition-transform hover:-translate-y-1.5 duration-300">
              <div className="w-16 h-16 rounded-2xl bg-[#4CAF50]/10 grid place-items-center mb-5">
                <Heart className="w-8 h-8 text-[#4CAF50]" fill="#4CAF50" strokeWidth={0} />
              </div>
              <div className="text-5xl md:text-6xl font-bold text-[#1a2332] tracking-tight tabular-nums">
                5k+
              </div>
              <div className="mt-3 text-base text-slate-500 font-medium">
                Students Helped
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white rounded-3xl shadow-[0_8px_40px_-12px_rgba(0,0,0,0.12)] p-10 text-center flex flex-col items-center transition-transform hover:-translate-y-1.5 duration-300">
              <div className="w-16 h-16 rounded-2xl bg-[#4CAF50]/10 grid place-items-center mb-5">
                <Wrench className="w-8 h-8 text-[#4CAF50]" strokeWidth={2.2} />
              </div>
              <div className="text-5xl md:text-6xl font-bold text-[#1a2332] tracking-tight tabular-nums">
                450
              </div>
              <div className="mt-3 text-base text-slate-500 font-medium">
                Projects Built
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-white rounded-3xl shadow-[0_8px_40px_-12px_rgba(0,0,0,0.12)] p-10 text-center flex flex-col items-center transition-transform hover:-translate-y-1.5 duration-300">
              <div className="w-16 h-16 rounded-2xl bg-[#4CAF50]/10 grid place-items-center mb-5">
                <Bot className="w-8 h-8 text-[#4CAF50]" strokeWidth={2.2} />
              </div>
              <div className="text-5xl md:text-6xl font-bold text-[#1a2332] tracking-tight tabular-nums">
                1.2k
              </div>
              <div className="mt-3 text-base text-slate-500 font-medium">
                Robots Assembled
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Try RoboMentor */}
      <section className="bg-white py-24 md:py-32">
        <div className="mx-auto max-w-[1440px] px-6 md:px-10">
          {/* Header */}
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 text-sm font-semibold text-[#4CAF50] tracking-[0.15em] uppercase mb-5">
              <span className="w-8 h-px bg-[#4CAF50]" />
              Interactive Demo
              <span className="w-8 h-px bg-[#4CAF50]" />
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.05] tracking-tight text-[#1a2332]">
              Try RoboMentor
            </h2>
            <p className="mt-5 text-lg text-slate-500 max-w-2xl mx-auto">
              Ask a question, paste your code, or take a quiz — all in one place.
            </p>
          </div>

          {/* Chat card */}
          <div className="mx-auto max-w-[800px] bg-white rounded-3xl shadow-[0_12px_60px_-12px_rgba(0,0,0,0.15)] border border-slate-100 overflow-hidden">
            {/* Chat window */}
            <div className="h-[400px] overflow-y-auto p-6 md:p-8 space-y-5 bg-slate-50/50">
              {/* Student message */}
              <div className="flex justify-end">
                <div className="max-w-[80%] bg-[#DBEAFE] text-slate-800 rounded-2xl rounded-tr-md px-5 py-3.5 text-sm leading-relaxed">
                  <p>Why is my servo motor jittering? Here's my code:</p>
                  <pre className="mt-3 bg-slate-900/90 text-slate-100 rounded-xl p-3.5 text-xs overflow-x-auto font-mono leading-relaxed">
{`#include <Servo.h>
Servo myServo;
void setup() {
  myServo.attach(9);
}
void loop() {
  myServo.write(90);
  myServo.write(0);
}`}
                  </pre>
                </div>
              </div>

              {/* RoboMentor reply */}
              <div className="flex justify-start items-start gap-3">
                <div className="shrink-0 w-9 h-9 rounded-xl bg-[#4CAF50] text-black grid place-items-center">
                  <Bot className="w-5 h-5" strokeWidth={2.5} />
                </div>
                <div className="max-w-[80%] bg-white border border-slate-200 shadow-sm text-slate-700 rounded-2xl rounded-tl-md px-5 py-3.5 text-sm leading-relaxed">
                  <p className="font-semibold text-[#1a2332] mb-1.5">RoboMentor</p>
                  <p>Jittering is common. Likely causes:</p>
                  <ol className="mt-2 space-y-1 list-decimal list-inside text-slate-600">
                    <li>Power supply — try a separate source.</li>
                    <li>PWM frequency — check your library.</li>
                    <li>Mechanical binding — check the servo horn.</li>
                  </ol>
                  <p className="mt-2.5">
                    <span className="font-semibold text-[#1a2332]">Suggestion:</span>{' '}
                    Try adding a <code className="bg-slate-100 text-[#4CAF50] px-1.5 py-0.5 rounded font-mono text-xs">delay(15)</code> in your loop.
                  </p>
                </div>
              </div>
            </div>

            {/* Mode buttons */}
            <div className="px-6 md:px-8 pt-5 pb-4 border-t border-slate-100 bg-white">
              <div className="flex flex-wrap gap-2.5">
                <ModeButton
                  active={mode === 'explain'}
                  onClick={() => setMode('explain')}
                  activeClass="bg-[#4CAF50]/15 text-[#2e7d32] border-[#4CAF50]/40"
                  idleClass="bg-[#4CAF50]/10 text-[#2e7d32] border-transparent hover:bg-[#4CAF50]/15"
                  icon={<BookOpen className="w-4 h-4" />}
                  label="Explain Concept"
                />
                <ModeButton
                  active={mode === 'debug'}
                  onClick={() => setMode('debug')}
                  activeClass="bg-orange-100 text-orange-700 border-orange-300"
                  idleClass="bg-orange-50 text-orange-600 border-transparent hover:bg-orange-100"
                  icon={<Bug className="w-4 h-4" />}
                  label="Debug My Code"
                />
                <ModeButton
                  active={mode === 'quiz'}
                  onClick={() => setMode('quiz')}
                  activeClass="bg-purple-100 text-purple-700 border-purple-300"
                  idleClass="bg-purple-50 text-purple-600 border-transparent hover:bg-purple-100"
                  icon={<GraduationCap className="w-4 h-4" />}
                  label="Quiz Me"
                />
              </div>
            </div>

            {/* Input area */}
            <div className="px-6 md:px-8 pb-6 pt-2 bg-white">
              <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-2xl pl-3 pr-2 py-2 focus-within:border-[#4CAF50]/50 focus-within:bg-white transition-colors">
                <button
                  aria-label="Upload image"
                  className="shrink-0 w-9 h-9 rounded-xl grid place-items-center text-slate-400 hover:text-[#4CAF50] hover:bg-[#4CAF50]/10 transition-colors"
                >
                  <Paperclip className="w-5 h-5" />
                </button>
                <input
                  type="text"
                  placeholder="Ask a robotics question or paste your code..."
                  className="flex-1 bg-transparent outline-none text-sm text-slate-700 placeholder:text-slate-400 py-1.5"
                />
                <button className="shrink-0 flex items-center gap-2 bg-[#4CAF50] hover:bg-[#43a047] text-black font-semibold text-sm px-5 py-2.5 rounded-xl transition-all hover:shadow-[0_0_20px_-4px_rgba(76,175,80,0.6)]">
                  <Send className="w-4 h-4" />
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Test Your Knowledge */}
      <section className="bg-slate-50 py-24 md:py-32">
        <div className="mx-auto max-w-[1440px] px-6 md:px-10">
          {/* Header */}
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 text-sm font-semibold text-[#4CAF50] tracking-[0.15em] uppercase mb-5">
              <span className="w-8 h-px bg-[#4CAF50]" />
              Interactive Quiz
              <span className="w-8 h-px bg-[#4CAF50]" />
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.05] tracking-tight text-[#1a2332]">
              Test Your Knowledge
            </h2>
            <p className="mt-5 text-lg text-slate-500 max-w-2xl mx-auto">
              Pick a topic and RoboMentor will generate a quick quiz.
            </p>
          </div>

          {/* Topic chips */}
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {quizTopics.map((topic) => (
              <button
                key={topic}
                onClick={() => setQuizTopic(topic)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium border transition-all ${
                  quizTopic === topic
                    ? 'bg-[#4CAF50] text-white border-[#4CAF50] shadow-[0_0_20px_-6px_rgba(76,175,80,0.6)]'
                    : 'bg-white text-[#1a2332] border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                {topic}
              </button>
            ))}
          </div>

          {/* Quiz card */}
          <div className="mx-auto max-w-[800px] bg-white rounded-3xl shadow-[0_12px_60px_-12px_rgba(0,0,0,0.12)] border border-slate-100 p-6 md:p-8">
            {/* Progress */}
            <div className="flex items-center justify-between mb-5">
              <span className="text-sm font-medium text-slate-500">
                Question 1 of 3
              </span>
              <span className="text-sm font-bold text-[#1a2332] tabular-nums">
                1 / 3
              </span>
            </div>
            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden mb-8">
              <div className="h-full bg-[#4CAF50] rounded-full transition-all duration-500" style={{ width: '33.33%' }} />
            </div>

            {/* Question */}
            <h3 className="text-xl font-bold text-[#1a2332] mb-6">
              What does a potentiometer measure?
            </h3>

            {/* Options */}
            <div className="space-y-3">
              {quizOptions.map((option, i) => {
                const isCorrect = i === correctIndex;
                const isSelected = quizAnswer === i;
                const answered = quizAnswer !== null;

                let stateClass = 'border-slate-200 bg-white hover:border-[#4CAF50]/50 hover:bg-slate-50';
                if (answered && isCorrect) {
                  stateClass = 'border-[#4CAF50] bg-[#4CAF50]/10';
                } else if (answered && isSelected && !isCorrect) {
                  stateClass = 'border-red-400 bg-red-50';
                } else if (answered) {
                  stateClass = 'border-slate-200 bg-white opacity-60';
                }

                return (
                  <button
                    key={i}
                    onClick={() => !answered && setQuizAnswer(i)}
                    disabled={answered}
                    className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl border-2 text-left transition-all ${stateClass}`}
                  >
                    <span className={`shrink-0 w-8 h-8 rounded-lg grid place-items-center text-sm font-bold ${
                      answered && isCorrect
                        ? 'bg-[#4CAF50] text-white'
                        : answered && isSelected && !isCorrect
                        ? 'bg-red-400 text-white'
                        : 'bg-slate-100 text-slate-500'
                    }`}>
                      {answered && isCorrect ? (
                        <Check className="w-4 h-4" strokeWidth={3} />
                      ) : answered && isSelected && !isCorrect ? (
                        <X className="w-4 h-4" strokeWidth={3} />
                      ) : (
                        String.fromCharCode(65 + i)
                      )}
                    </span>
                    <span className={`text-base font-medium ${
                      answered && isCorrect ? 'text-[#2e7d32]' : answered && isSelected && !isCorrect ? 'text-red-600' : 'text-[#1a2332]'
                    }`}>
                      {option}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Explanation */}
            {quizAnswer !== null && (
              <div className="mt-6 bg-slate-50 border border-slate-200 rounded-2xl p-5 animate-[fadeUp_400ms_ease-out_both]">
                <div className="flex items-start gap-3">
                  <div className="shrink-0 w-8 h-8 rounded-lg bg-[#4CAF50]/10 grid place-items-center">
                    <Sparkles className="w-4 h-4 text-[#4CAF50]" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#1a2332] mb-1">
                      {quizAnswer === correctIndex ? 'Correct!' : 'Not quite.'}
                    </p>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      A potentiometer measures angular position — often used to read knob or joint angles.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Below card controls */}
          <div className="mx-auto max-w-[800px] flex items-center justify-between mt-8">
            <button
              onClick={() => setQuizAnswer(null)}
              className="group flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-[#1a2332] transition-colors"
            >
              <RotateCcw className="w-4 h-4 transition-transform group-hover:-rotate-180 duration-500" />
              Start Over
            </button>
            <button className="group flex items-center gap-2 bg-[#4CAF50] hover:bg-[#43a047] text-black font-semibold text-sm px-6 py-3 rounded-full transition-all hover:shadow-[0_0_24px_-4px_rgba(76,175,80,0.6)]">
              Next Question
              <ArrowRightCircle className="w-5 h-5 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

function ModeButton({
  active,
  onClick,
  activeClass,
  idleClass,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  activeClass: string;
  idleClass: string;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-all ${
        active ? activeClass : idleClass
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

export default App;
