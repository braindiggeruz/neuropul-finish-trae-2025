export default function Premium() {
  return (
    <div className="py-8">
      <h1 className="text-3xl font-bold mb-6">Premium Access</h1>
      <div className="grid gap-6 md:grid-cols-3">
        <div className="bg-white rounded-lg border p-6">
          <h2 className="text-xl font-semibold mb-2">Variant A</h2>
          <p className="text-3xl font-bold mb-4">$9.99<span className="text-sm font-normal text-slate-600">/mo</span></p>
          <p className="text-slate-600">Multi-armed bandit will optimize pricing</p>
        </div>
        <div className="bg-white rounded-lg border p-6 border-blue-500">
          <h2 className="text-xl font-semibold mb-2">Variant B</h2>
          <p className="text-3xl font-bold mb-4">$14.99<span className="text-sm font-normal text-slate-600">/mo</span></p>
          <p className="text-slate-600">Thompson Sampling in action</p>
        </div>
        <div className="bg-white rounded-lg border p-6">
          <h2 className="text-xl font-semibold mb-2">Variant C</h2>
          <p className="text-3xl font-bold mb-4">$19.99<span className="text-sm font-normal text-slate-600">/mo</span></p>
          <p className="text-slate-600">Dynamic assignment per user</p>
        </div>
      </div>
    </div>
  );
}
