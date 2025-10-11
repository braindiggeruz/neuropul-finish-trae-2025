export default function Dashboard() {
  return (
    <div className="py-8">
      <h1 className="text-3xl font-bold mb-6">Growth Dashboard</h1>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="bg-white rounded-lg border p-6">
          <h2 className="text-xl font-semibold mb-4">XP Progress</h2>
          <div className="mb-2">
            <div className="flex justify-between text-sm mb-1">
              <span>Level 1</span>
              <span className="text-slate-600">0 / 100 XP</span>
            </div>
            <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
              <div className="h-full bg-blue-600 w-0"></div>
            </div>
          </div>
          <p className="text-sm text-slate-500 mt-4">Complete missions to earn XP</p>
        </div>
        <div className="bg-white rounded-lg border p-6">
          <h2 className="text-xl font-semibold mb-4">Archetype</h2>
          <p className="text-slate-600">Complete the quiz to discover your archetype</p>
        </div>
      </div>
    </div>
  );
}
