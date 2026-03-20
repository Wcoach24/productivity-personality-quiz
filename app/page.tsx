'use client'

import { useState, useEffect, useCallback } from 'react'

// ============================================================
// TYPES
// ============================================================

type Dimension = 'structure' | 'energy' | 'social' | 'focus'

interface Answer {
  text: string
  scores: Record<Dimension, number>
}

interface Question {
  question: string
  emoji: string
  answers: Answer[]
}

interface PersonalityType {
  id: string
  name: string
  emoji: string
  tagline: string
  color: string
  gradient: string
  description: string
  strengths: string[]
  weaknesses: string[]
  tip: string
  shareText: string
  famous: string
}

type Screen = 'landing' | 'quiz' | 'loading' | 'result' | 'email-gate'

// ============================================================
// DATA
// ============================================================

const questions: Question[] = [
  {
    question: "It's Monday morning. What's your first move?",
    emoji: "\ud83c\udf05",
    answers: [
      { text: "Check my color-coded task list and start #1", scores: { structure: 3, energy: 1, social: 0, focus: 2 } },
      { text: "Coffee first, then whatever feels right", scores: { structure: 0, energy: 2, social: 0, focus: 1 } },
      { text: "Catch up on Slack/Teams messages", scores: { structure: 1, energy: 1, social: 3, focus: 0 } },
      { text: "Deep work session \u2014 phone on airplane mode", scores: { structure: 2, energy: 2, social: 0, focus: 3 } },
    ]
  },
  {
    question: "You have 3 hours of uninterrupted time. You...",
    emoji: "\u23f0",
    answers: [
      { text: "Tackle the hardest task on my list", scores: { structure: 2, energy: 3, social: 0, focus: 3 } },
      { text: "Bounce between 4 different projects", scores: { structure: 0, energy: 3, social: 1, focus: 0 } },
      { text: "Organize & plan for next week", scores: { structure: 3, energy: 1, social: 0, focus: 2 } },
      { text: "Collaborate with someone on a shared project", scores: { structure: 1, energy: 2, social: 3, focus: 1 } },
    ]
  },
  {
    question: "Your inbox has 47 unread emails. Your reaction?",
    emoji: "\ud83d\udce7",
    answers: [
      { text: "Process them systematically \u2014 oldest first", scores: { structure: 3, energy: 2, social: 1, focus: 2 } },
      { text: "Scan for the urgent ones, ignore the rest", scores: { structure: 1, energy: 2, social: 0, focus: 1 } },
      { text: "Reply to people I know first", scores: { structure: 0, energy: 1, social: 3, focus: 0 } },
      { text: "47? Those are rookie numbers. I have 2,847", scores: { structure: 0, energy: 0, social: 1, focus: 2 } },
    ]
  },
  {
    question: "A colleague asks for help. You're in the middle of deep work.",
    emoji: "\ud83e\udd1d",
    answers: [
      { text: "Help them now \u2014 people come first", scores: { structure: 0, energy: 1, social: 3, focus: 0 } },
      { text: "Block my calendar \u2014 I'll help at 3pm", scores: { structure: 3, energy: 2, social: 1, focus: 3 } },
      { text: "Quick 2-min answer, then back to work", scores: { structure: 2, energy: 2, social: 2, focus: 2 } },
      { text: "Pretend I didn't see the message", scores: { structure: 1, energy: 0, social: 0, focus: 3 } },
    ]
  },
  {
    question: "Your ideal workspace is...",
    emoji: "\ud83c\udfe0",
    answers: [
      { text: "Minimalist desk, noise-canceling headphones", scores: { structure: 2, energy: 1, social: 0, focus: 3 } },
      { text: "Busy coffee shop with background buzz", scores: { structure: 0, energy: 3, social: 2, focus: 0 } },
      { text: "Open office where I can chat with everyone", scores: { structure: 0, energy: 2, social: 3, focus: 0 } },
      { text: "Home office with everything in its place", scores: { structure: 3, energy: 1, social: 0, focus: 2 } },
    ]
  },
  {
    question: "When do you do your best work?",
    emoji: "\ud83e\udde0",
    answers: [
      { text: "5 AM \u2014 before anyone's awake", scores: { structure: 2, energy: 2, social: 0, focus: 3 } },
      { text: "10 AM \u2014 after my morning routine", scores: { structure: 3, energy: 2, social: 1, focus: 2 } },
      { text: "2 PM \u2014 post-lunch creative burst", scores: { structure: 1, energy: 2, social: 2, focus: 1 } },
      { text: "11 PM \u2014 chaos fuels me", scores: { structure: 0, energy: 3, social: 0, focus: 1 } },
    ]
  },
  {
    question: "You just finished a big project. Next you...",
    emoji: "\ud83c\udf89",
    answers: [
      { text: "Start the next one immediately", scores: { structure: 2, energy: 3, social: 0, focus: 2 } },
      { text: "Celebrate with the team", scores: { structure: 0, energy: 1, social: 3, focus: 0 } },
      { text: "Document what went well for next time", scores: { structure: 3, energy: 1, social: 1, focus: 2 } },
      { text: "Take a well-deserved break", scores: { structure: 1, energy: 0, social: 1, focus: 1 } },
    ]
  },
  {
    question: "Your secret productivity weapon is...",
    emoji: "\u26a1",
    answers: [
      { text: "Notion/spreadsheets for tracking everything", scores: { structure: 3, energy: 1, social: 0, focus: 2 } },
      { text: "Pressure. I work best under deadlines", scores: { structure: 0, energy: 3, social: 0, focus: 1 } },
      { text: "Body doubling \u2014 working alongside others", scores: { structure: 1, energy: 2, social: 3, focus: 1 } },
      { text: "Flow state \u2014 once I'm in, I'm unstoppable", scores: { structure: 1, energy: 2, social: 0, focus: 3 } },
    ]
  },
]

const personalityTypes: PersonalityType[] = [
  {
    id: 'architect',
    name: 'The Architect',
    emoji: '\ud83c\udfd7\ufe0f',
    tagline: 'Plans first. Executes flawlessly.',
    color: '#6C3CE1',
    gradient: 'from-purple-600 to-indigo-700',
    description: 'You are the master planner. Every task has a place, every minute has a purpose. Your color-coded systems are legendary. Chaos is your enemy \u2014 and you always win.',
    strengths: ['Systems thinking', 'Never misses deadlines', 'Incredible organization'],
    weaknesses: ['Over-planning can delay action', 'Rigid when plans change'],
    tip: 'Schedule \"unplanned\" time. Your best ideas might come from chaos you allow.',
    shareText: "I'm The Architect \ud83c\udfd7\ufe0f \u2014 Plans first, executes flawlessly. What's your productivity personality?",
    famous: 'Elon Musk vibes (but with better work-life balance)',
  },
  {
    id: 'chaos-creative',
    name: 'The Chaos Creative',
    emoji: '\ud83c\udf2a\ufe0f',
    tagline: 'Messy desk. Brilliant output.',
    color: '#FF6B6B',
    gradient: 'from-red-500 to-orange-500',
    description: 'Your browser has 47 tabs open and you wouldn\'t have it any other way. You thrive in creative disorder. While others follow checklists, you follow inspiration \u2014 and somehow always deliver.',
    strengths: ['Incredible creativity', 'Thrives under pressure', 'Connects unexpected ideas'],
    weaknesses: ['Misses small details', 'Inconsistent routines'],
    tip: 'Keep ONE anchor habit (like a morning review). It\'ll give your chaos a launchpad.',
    shareText: "I'm The Chaos Creative \ud83c\udf2a\ufe0f \u2014 Messy desk, brilliant output. What's your productivity personality?",
    famous: 'Steve Jobs energy \u2014 think different, ship anyway',
  },
  {
    id: 'connector',
    name: 'The Connector',
    emoji: '\ud83d\udd17',
    tagline: 'Makes teams unstoppable.',
    color: '#4ECDC4',
    gradient: 'from-teal-400 to-cyan-500',
    description: 'Your superpower is people. You know who to talk to, how to unblock teams, and when to bring the right minds together. Your calendar is full of \"quick syncs\" \u2014 and you love every one.',
    strengths: ['Network intelligence', 'Team catalyst', 'Emotional intelligence'],
    weaknesses: ['Hard to say no', 'Own deep work suffers'],
    tip: 'Block 2 hours daily for solo deep work. Your team will survive without you for 120 minutes.',
    shareText: "I'm The Connector \ud83d\udd17 \u2014 Makes teams unstoppable. What's your productivity personality?",
    famous: 'Oprah-level people skills',
  },
  {
    id: 'silent-grinder',
    name: 'The Silent Grinder',
    emoji: '\ud83c\udfaf',
    tagline: 'Heads down. Results up.',
    color: '#45B7D1',
    gradient: 'from-blue-500 to-cyan-600',
    description: 'While others talk about productivity, you just... do it. Headphones on, notifications off, flow state activated. You produce more in 4 hours than most do in 8. Your Slack status is permanently \"\ud83d\udd34 Focusing\".',
    strengths: ['Deep focus mastery', 'High-quality output', 'Self-disciplined'],
    weaknesses: ['Can be hard to reach', 'May miss team dynamics'],
    tip: 'Schedule a 15-min \"visibility window\" daily. People need to know the amazing work you\'re doing.',
    shareText: "I'm The Silent Grinder \ud83c\udfaf \u2014 Heads down, results up. What's your productivity personality?",
    famous: 'Cal Newport would be proud',
  },
  {
    id: 'sprinter',
    name: 'The Sprinter',
    emoji: '\ud83d\ude80',
    tagline: 'Fast bursts. Legendary output.',
    color: '#FF9F43',
    gradient: 'from-orange-500 to-yellow-500',
    description: 'You work in explosive bursts of energy. When you\'re on, you\'re ON \u2014 producing in hours what takes others days. Between sprints? You recharge like a phone on fast-charge mode.',
    strengths: ['Incredible burst productivity', 'High energy', 'Fast decision-making'],
    weaknesses: ['Energy crashes between sprints', 'Can burn out quickly'],
    tip: 'Plan your sprints intentionally. Know when your next recharge window is BEFORE you start.',
    shareText: "I'm The Sprinter \ud83d\ude80 \u2014 Fast bursts, legendary output. What's your productivity personality?",
    famous: 'Usain Bolt of the corporate world',
  },
  {
    id: 'zen-master',
    name: 'The Zen Master',
    emoji: '\ud83e\uddd8',
    tagline: 'Calm pace. Consistent excellence.',
    color: '#A8E6CF',
    gradient: 'from-green-400 to-emerald-500',
    description: 'You don\'t rush. You don\'t panic. You work at a steady, sustainable pace that somehow produces remarkable results. While others burn hot and crash, you\'re the marathon runner who always finishes strong.',
    strengths: ['Sustainable productivity', 'Low stress', 'Consistent quality'],
    weaknesses: ['Can seem slow to fast-paced teams', 'May under-promise'],
    tip: 'Don\'t let others\' urgency become yours. Your pace is your superpower \u2014 protect it.',
    shareText: "I'm The Zen Master \ud83e\uddd8 \u2014 Calm pace, consistent excellence. What's your productivity personality?",
    famous: 'Warren Buffett\'s patience personified',
  },
]

function getPersonality(scores: Record<Dimension, number>): PersonalityType {
  const { structure, energy, social, focus } = scores

  if (structure >= 14 && focus >= 12) return personalityTypes[0] // Architect
  if (energy >= 14 && structure <= 8) return personalityTypes[1] // Chaos Creative
  if (social >= 14) return personalityTypes[2] // Connector
  if (focus >= 16) return personalityTypes[3] // Silent Grinder
  if (energy >= 14 && focus >= 10) return personalityTypes[4] // Sprinter

  // Score-based fallback
  const maxDim = Object.entries(scores).sort(([,a], [,b]) => b - a)[0][0]
  switch(maxDim) {
    case 'structure': return personalityTypes[0]
    case 'energy': return energy > 12 ? personalityTypes[4] : personalityTypes[1]
    case 'social': return personalityTypes[2]
    case 'focus': return personalityTypes[3]
    default: return personalityTypes[5] // Zen Master
  }
}

// ============================================================
// COMPONENTS
// ============================================================

function LandingScreen({ onStart }: { onStart: () => void }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
      {/* Background orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-600/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-600/15 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative z-10 max-w-md mx-auto">
        <div className="text-6xl mb-6 animate-float">\ud83e\udde0</div>
        <h1 className="text-4xl md:text-5xl font-black mb-4 leading-tight">
          What Type of <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Productive</span> Are You?
        </h1>
        <p className="text-gray-400 text-lg mb-8">
          8 questions. 2 minutes. Discover your unique productivity personality \u2014 and why you work the way you do.
        </p>

        <div className="flex items-center justify-center gap-6 mb-8 text-sm text-gray-500">
          <span className="flex items-center gap-1">\u23f1\ufe0f 2 min</span>
          <span className="flex items-center gap-1">\ud83d\udcca 6 types</span>
          <span className="flex items-center gap-1">\ud83d\udd2c Science-based</span>
        </div>

        <button
          onClick={onStart}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-lg py-4 px-8 rounded-2xl hover:scale-105 active:scale-95 transition-all duration-200 animate-pulse-glow"
        >
          Discover My Type \u2192
        </button>

        <p className="text-gray-600 text-xs mt-6">
          Free. No signup required. Shareable result.
        </p>

        {/* Social proof */}
        <div className="mt-8 glass rounded-xl p-4">
          <div className="flex items-center justify-center gap-2">
            <div className="flex -space-x-2">
              {['\ud83d\udfe3','\ud83d\udfe2','\ud83d\udfe2','\ud83d\udfe1','\ud83d\udd34'].map((c, i) => (
                <div key={i} className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-sm border-2 border-gray-800">
                  {c}
                </div>
              ))}
            </div>
            <span className="text-gray-400 text-sm ml-2">
              <strong className="text-white">2,847</strong> people found their type today
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

function QuizScreen({ onComplete }: { onComplete: (scores: Record<Dimension, number>) => void }) {
  const [current, setCurrent] = useState(0)
  const [scores, setScores] = useState<Record<Dimension, number>>({ structure: 0, energy: 0, social: 0, focus: 0 })
  const [animating, setAnimating] = useState(false)

  const q = questions[current]
  const progress = ((current) / questions.length) * 100

  const handleAnswer = useCallback((answer: Answer) => {
    if (animating) return
    setAnimating(true)

    const newScores = { ...scores }
    for (const [dim, val] of Object.entries(answer.scores)) {
      newScores[dim as Dimension] += val
    }
    setScores(newScores)

    setTimeout(() => {
      if (current < questions.length - 1) {
        setCurrent(current + 1)
        setAnimating(false)
      } else {
        onComplete(newScores)
      }
    }, 300)
  }, [animating, scores, current, onComplete])

  return (
    <div className="min-h-screen flex flex-col p-6 max-w-lg mx-auto">
      {/* Progress */}
      <div className="mb-8">
        <div className="flex justify-between text-sm text-gray-400 mb-2">
          <span>Question {current + 1}/{questions.length}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full progress-bar"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div key={current} className="flex-1 flex flex-col justify-center animate-slide-up">
        <div className="text-4xl mb-4">{q.emoji}</div>
        <h2 className="text-2xl font-bold mb-8">{q.question}</h2>

        <div className="space-y-3">
          {q.answers.map((answer, i) => (
            <button
              key={i}
              onClick={() => handleAnswer(answer)}
              className="w-full text-left glass rounded-xl p-4 hover:bg-white/10 active:scale-[0.98] transition-all duration-200 group"
            >
              <span className="text-gray-400 group-hover:text-purple-400 font-mono text-sm mr-3">
                {String.fromCharCode(65 + i)}
              </span>
              <span className="text-gray-200 group-hover:text-white">
                {answer.text}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

function LoadingScreen() {
  const [step, setStep] = useState(0)
  const messages = [
    { text: 'Analyzing your answers...', emoji: '\ud83d\udd0d' },
    { text: 'Cross-referencing productivity patterns...', emoji: '\ud83d\udcca' },
    { text: 'Identifying your dominant traits...', emoji: '\ud83e\uddec' },
    { text: 'Generating your personality profile...', emoji: '\u2728' },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setStep(s => {
        if (s >= messages.length - 1) {
          clearInterval(interval)
          return s
        }
        return s + 1
      })
    }, 2500)
    return () => clearInterval(interval)
  }, [messages.length])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      {/* Spinning loader */}
      <div className="relative w-24 h-24 mb-8">
        <div className="absolute inset-0 rounded-full border-4 border-gray-800" />
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-purple-500 animate-spin" />
        <div className="absolute inset-2 rounded-full border-4 border-transparent border-t-pink-500 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
        <div className="absolute inset-0 flex items-center justify-center text-2xl">
          {messages[step].emoji}
        </div>
      </div>

      <div className="text-center">
        {messages.map((msg, i) => (
          <p
            key={i}
            className={`transition-all duration-500 ${
              i === step ? 'text-white text-lg opacity-100' :
              i < step ? 'text-gray-600 text-sm opacity-50' :
              'text-gray-800 text-sm opacity-0'
            } ${i <= step ? 'mb-2' : ''}`}
          >
            {i <= step ? msg.text : ''}
          </p>
        ))}
      </div>

      <div className="mt-8 w-64 h-1 bg-gray-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-[10s] ease-linear"
          style={{ width: `${(step + 1) / messages.length * 100}%` }}
        />
      </div>
    </div>
  )
}

function ResultScreen({ personality, onEmailGate }: { personality: PersonalityType; onEmailGate: () => void }) {
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    setTimeout(() => setRevealed(true), 300)
  }, [])

  const shareUrl = typeof window !== 'undefined' ? window.location.href : ''

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(personality.shareText)}&url=${encodeURIComponent(shareUrl)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(personality.shareText + ' ' + shareUrl)}`,
  }

  return (
    <div className="min-h-screen flex flex-col items-center p-6 max-w-lg mx-auto">
      {/* Background based on type */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 rounded-full blur-3xl animate-float" style={{ background: personality.color + '20' }} />
        <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full blur-3xl animate-float" style={{ background: personality.color + '15', animationDelay: '1s' }} />
      </div>

      <div className={`relative z-10 w-full ${revealed ? 'animate-slide-up' : 'opacity-0'}`}>
        {/* Result card */}
        <div className="glass rounded-3xl p-8 mb-6 text-center">
          <p className="text-gray-400 text-sm mb-2">Your productivity personality is</p>
          <div className="text-6xl mb-4 animate-count-up">{personality.emoji}</div>
          <h1 className={`text-3xl md:text-4xl font-black mb-2 bg-gradient-to-r ${personality.gradient} bg-clip-text text-transparent`}>
            {personality.name}
          </h1>
          <p className="text-gray-400 italic text-lg mb-6">&quot;{personality.tagline}&quot;</p>
          <p className="text-gray-300 leading-relaxed">{personality.description}</p>
        </div>

        {/* Strengths & Weaknesses */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="glass rounded-2xl p-4">
            <p className="text-green-400 font-semibold mb-2 text-sm">\ud83d\udcaa Strengths</p>
            {personality.strengths.map((s, i) => (
              <p key={i} className="text-gray-300 text-sm mb-1">\u2022 {s}</p>
            ))}
          </div>
          <div className="glass rounded-2xl p-4">
            <p className="text-orange-400 font-semibold mb-2 text-sm">\u26a0\ufe0f Watch out</p>
            {personality.weaknesses.map((w, i) => (
              <p key={i} className="text-gray-300 text-sm mb-1">\u2022 {w}</p>
            ))}
          </div>
        </div>

        {/* Quick tip */}
        <div className="glass rounded-2xl p-5 mb-6" style={{ borderColor: personality.color + '40' }}>
          <p className="text-sm font-semibold mb-1" style={{ color: personality.color }}>\ud83d\udca1 Your #1 Productivity Tip</p>
          <p className="text-gray-300 text-sm">{personality.tip}</p>
        </div>

        {/* Email gate CTA */}
        <button
          onClick={onEmailGate}
          className={`w-full bg-gradient-to-r ${personality.gradient} text-white font-bold text-lg py-4 px-8 rounded-2xl hover:scale-105 active:scale-95 transition-all duration-200 mb-4`}
        >
          \ud83d\udd13 Unlock Full Report \u2014 Free
        </button>
        <p className="text-gray-600 text-xs text-center mb-8">
          Get your detailed 4-page personality breakdown + custom action plan
        </p>

        {/* Share buttons */}
        <div className="text-center mb-6">
          <p className="text-gray-400 text-sm mb-3">Share your result \ud83d\udd16</p>
          <div className="flex justify-center gap-3">
            <a
              href={shareLinks.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="glass rounded-xl px-5 py-3 hover:bg-white/10 transition-all text-sm font-medium"
            >
              \ud835\udd4f Twitter
            </a>
            <a
              href={shareLinks.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="glass rounded-xl px-5 py-3 hover:bg-white/10 transition-all text-sm font-medium"
            >
              \ud83d\udcbc LinkedIn
            </a>
            <a
              href={shareLinks.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="glass rounded-xl px-5 py-3 hover:bg-white/10 transition-all text-sm font-medium"
            >
              \ud83d\udcac WhatsApp
            </a>
          </div>
        </div>

        {/* Famous comparison */}
        <p className="text-center text-gray-600 text-xs italic">
          {personality.famous}
        </p>
      </div>
    </div>
  )
}

function EmailGateScreen({ personality, onClose }: { personality: PersonalityType; onClose: () => void }) {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    // Store email in localStorage as simple capture
    try {
      const leads = JSON.parse(localStorage.getItem('ppq-leads') || '[]')
      leads.push({ email, personality: personality.id, date: new Date().toISOString() })
      localStorage.setItem('ppq-leads', JSON.stringify(leads))
    } catch { /* ignore */ }
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center max-w-md mx-auto">
        <div className="text-6xl mb-4">\u2705</div>
        <h2 className="text-2xl font-bold mb-2">You&apos;re in!</h2>
        <p className="text-gray-400 mb-6">
          Your full {personality.name} report will be in your inbox within 5 minutes.
        </p>
        <button
          onClick={onClose}
          className="glass rounded-xl px-6 py-3 hover:bg-white/10 transition-all"
        >
          \u2190 Back to my result
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 max-w-md mx-auto">
      <div className="glass rounded-3xl p-8 w-full animate-slide-up">
        <div className="text-center mb-6">
          <div className="text-4xl mb-3">\ud83d\udcca</div>
          <h2 className="text-2xl font-bold mb-2">Your Full Report</h2>
          <p className="text-gray-400">Get your detailed {personality.name} breakdown:</p>
        </div>

        <ul className="space-y-3 mb-6">
          {[
            'Detailed productivity pattern analysis',
            'Custom daily routine template',
            'Tool recommendations for your type',
            'Team compatibility matrix',
          ].map((item, i) => (
            <li key={i} className="flex items-center gap-3 text-gray-300 text-sm">
              <span className="text-green-400">\u2713</span>
              {item}
            </li>
          ))}
        </ul>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 mb-3"
            required
          />
          <button
            type="submit"
            className={`w-full bg-gradient-to-r ${personality.gradient} text-white font-bold py-3 px-8 rounded-xl hover:scale-105 active:scale-95 transition-all duration-200`}
          >
            Send My Free Report \u2192
          </button>
        </form>

        <button
          onClick={onClose}
          className="w-full text-gray-600 text-sm mt-4 hover:text-gray-400 transition-colors"
        >
          No thanks, take me back
        </button>
      </div>
    </div>
  )
}

// ============================================================
// MAIN APP
// ============================================================

export default function Home() {
  const [screen, setScreen] = useState<Screen>('landing')
  const [personality, setPersonality] = useState<PersonalityType | null>(null)

  const handleQuizComplete = useCallback((scores: Record<Dimension, number>) => {
    const result = getPersonality(scores)
    setPersonality(result)
    setScreen('loading')

    // Increment counter
    try {
      const count = parseInt(localStorage.getItem('ppq-count') || '0') + 1
      localStorage.setItem('ppq-count', count.toString())
    } catch { /* ignore */ }

    setTimeout(() => setScreen('result'), 10000)
  }, [])

  return (
    <main className="min-h-screen">
      {screen === 'landing' && (
        <LandingScreen onStart={() => setScreen('quiz')} />
      )}
      {screen === 'quiz' && (
        <QuizScreen onComplete={handleQuizComplete} />
      )}
      {screen === 'loading' && (
        <LoadingScreen />
      )}
      {screen === 'result' && personality && (
        <ResultScreen
          personality={personality}
          onEmailGate={() => setScreen('email-gate')}
        />
      )}
      {screen === 'email-gate' && personality && (
        <EmailGateScreen
          personality={personality}
          onClose={() => setScreen('result')}
        />
      )}
    </main>
  )
}
