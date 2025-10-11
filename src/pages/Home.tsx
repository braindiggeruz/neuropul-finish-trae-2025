export default function Home() {
  return (
    <div className="py-12">
      <h1 className="text-4xl font-bold mb-4">Neuropul: Portal of Awakening</h1>
      <p className="text-lg text-slate-600 mb-8">
        AI-powered personal growth companion with archetype-based coaching
      </p>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="p-6 bg-white rounded-lg border">
          <h2 className="text-xl font-semibold mb-2">Discover Your Archetype</h2>
          <p className="text-slate-600">Take the quiz to unlock your personal growth path</p>
        </div>
        <div className="p-6 bg-white rounded-lg border">
          <h2 className="text-xl font-semibold mb-2">AI Coach</h2>
          <p className="text-slate-600">Get personalized guidance from your archetype coach</p>
        </div>
        <div className="p-6 bg-white rounded-lg border">
          <h2 className="text-xl font-semibold mb-2">Track Progress</h2>
          <p className="text-slate-600">Level up with XP and unlock new abilities</p>
        </div>
      </div>
    </div>
  );
}
