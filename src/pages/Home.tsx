export default function Home() {
  return (
    <div className="relative min-h-screen bg-gradient-to-b from-[#020617] via-[#050816] to-[#020617] overflow-hidden">
      {/* Ambient glow background */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-cyan-500/20 blur-3xl rounded-full pointer-events-none" />
      <div className="absolute bottom-1/3 left-0 w-96 h-96 bg-indigo-500/10 blur-3xl rounded-full pointer-events-none" />

      <main className="relative z-10 min-h-screen flex items-center justify-center px-4 py-16">
        <div className="max-w-6xl w-full grid md:grid-cols-2 gap-12 items-center">
          {/* Left Column - Text Content */}
          <div className="space-y-8">
            {/* Badge */}
            <div>
              <span className="inline-flex items-center px-4 py-2 rounded-full border border-cyan-500/50 bg-cyan-500/10 text-cyan-300 text-sm font-medium">
                Day 1 · Portal of Awakening
              </span>
            </div>

            {/* Heading */}
            <div>
              <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-slate-50 leading-tight mb-4">
                Neuropul:{' '}
                <span className="bg-gradient-to-r from-cyan-400 to-indigo-500 text-transparent bg-clip-text">
                  портал пробуждения
                </span>
              </h1>
            </div>

            {/* Subheading */}
            <p className="text-lg text-slate-300 leading-relaxed max-w-xl">
              Личный путь роста с ИИ-ментором по архетипам. Пройди ритуал, получи свой архетип и план действий на 30 дней.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button className="px-8 py-3 rounded-full bg-gradient-to-r from-cyan-500 to-cyan-400 text-slate-950 font-semibold hover:shadow-lg hover:shadow-cyan-500/50 transition-all duration-300 hover:scale-105">
                Войти в портал
              </button>
              <button className="px-8 py-3 rounded-full border border-cyan-500/60 bg-slate-950/40 text-cyan-300 font-semibold hover:bg-slate-900/60 hover:border-cyan-400 transition-all duration-300 backdrop-blur-sm">
                Посмотреть, как это работает
              </button>
            </div>

            {/* Small text */}
            <p className="text-sm text-slate-400 pt-2">
              Без регистрации и оплат — сначала просто пройди ритуал Дня 1.
            </p>
          </div>

          {/* Right Column - Dashboard Preview Card */}
          <div className="relative">
            {/* Main Card */}
            <div className="bg-slate-900/60 backdrop-blur-xl border border-cyan-500/30 rounded-2xl p-6 shadow-2xl hover:shadow-cyan-500/20 transition-shadow duration-300">
              {/* Header */}
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-700/50">
                <span className="text-sm font-semibold text-slate-300">День 1 · Нигредо</span>
                <span className="text-xs px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 font-medium">
                  XP 40/100
                </span>
              </div>

              {/* Progress Bar */}
              <div className="h-1 bg-slate-800/60 rounded-full overflow-hidden mb-6">
                <div className="h-full w-2/5 bg-gradient-to-r from-cyan-500 to-indigo-500" />
              </div>

              {/* Quests Section */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-slate-200 mb-4">Стартовые миссии</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-slate-300">
                    <div className="w-5 h-5 rounded border border-cyan-500/50 flex items-center justify-center">
                      <svg className="w-3 h-3 text-cyan-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-sm">Подключиться к порталу</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-300">
                    <div className="w-5 h-5 rounded border border-cyan-500/50 flex items-center justify-center">
                      <svg className="w-3 h-3 text-cyan-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-sm">Получить свой архетип</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-400">
                    <div className="w-5 h-5 rounded border border-slate-700/60" />
                    <span className="text-sm">Забрать первый план действий</span>
                  </div>
                </div>
              </div>

              {/* Chat Section */}
              <div className="border-t border-slate-700/50 pt-4 space-y-3">
                <div className="bg-slate-800/40 rounded-lg p-3 border border-slate-700/30">
                  <p className="text-xs text-slate-400 mb-1 font-semibold">Trae</p>
                  <p className="text-sm text-slate-200 leading-relaxed">
                    Я здесь, чтобы прокачать твой мозг, а не отнимать время. Готов к ритуалу?
                  </p>
                </div>
                <div className="bg-slate-900/60 border border-slate-700/50 rounded-lg px-4 py-3">
                  <p className="text-sm text-slate-500">Напиши Trae...</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
