import { Outlet, Link } from "react-router-dom";

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="sticky top-0 border-b bg-white/70 backdrop-blur-sm">
        <nav className="mx-auto max-w-5xl p-4 flex gap-6">
          <Link to="/" className="hover:text-blue-600 transition-colors">Home</Link>
          <Link to="/coach" className="hover:text-blue-600 transition-colors">Coach</Link>
          <Link to="/premium" className="hover:text-blue-600 transition-colors">Premium</Link>
          <Link to="/dashboard" className="hover:text-blue-600 transition-colors">Dashboard</Link>
        </nav>
      </header>
      <main className="mx-auto max-w-5xl p-6">
        <Outlet />
      </main>
      <footer className="mx-auto max-w-5xl p-6 text-sm text-slate-500">
        Neuropul v3.1.0 — MVP Foundation
      </footer>
    </div>
  );
}
