import React, { useEffect, useMemo, useState } from 'react';
import { Navigate, Route, Routes, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Settings, ShieldCheck, CreditCard, FileText, LogOut, Menu, X } from 'lucide-react';
import AdminLogin from './AdminLogin';
import AdminDashboard from './AdminDashboard';
import AdminContent from './AdminContent';
import AdminPayments from './AdminPayments';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getStoredAdmin = () => {
  try {
    return JSON.parse(localStorage.getItem('jana-admin'));
  } catch {
    return null;
  }
};

const AdminApp = () => {
  const [admin, setAdmin] = useState(getStoredAdmin());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const logout = () => {
    localStorage.removeItem('jana-admin');
    setAdmin(null);
  };

  const sidebarLinks = useMemo(() => [
    { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { label: 'Content', path: '/admin/content', icon: FileText },
    { label: 'Payments', path: '/admin/payments', icon: CreditCard },
    { label: 'Settings', path: '/admin/settings', icon: Settings },
  ], []);

  if (!admin) {
    return <AdminLogin onLogin={(user) => { setAdmin(user); }} />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="flex min-h-screen flex-col lg:flex-row">
        <aside className="w-full lg:w-72 border-b lg:border-b-0 lg:border-r border-white/10 bg-slate-900/80 backdrop-blur-xl">
          <div className="flex items-center justify-between px-6 py-5">
            <div>
              <p className="text-[11px] uppercase tracking-[0.3em] text-emerald-300">Jana Bikas</p>
              <h2 className="text-xl font-semibold text-white">Admin Console</h2>
            </div>
            <button className="lg:hidden rounded-lg border border-white/10 p-2" onClick={() => setMobileMenuOpen((prev) => !prev)}>
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>

          <nav className={`${mobileMenuOpen ? 'block' : 'hidden'} px-4 pb-6 lg:block lg:px-6 lg:pb-0`}>
            <div className="space-y-2">
              {sidebarLinks.map((link) => {
                const Icon = link.icon;
                const active = location.pathname === link.path || (link.path === '/admin' && location.pathname === '/admin');
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${active ? 'bg-emerald-500/15 text-emerald-300 shadow-lg shadow-emerald-500/10' : 'text-slate-300 hover:bg-white/5 hover:text-white'}`}
                  >
                    <Icon size={18} />
                    {link.label}
                  </Link>
                );
              })}
            </div>

            <div className="mt-6 rounded-3xl border border-white/10 bg-gradient-to-br from-emerald-500/15 to-amber-500/10 p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-white/10 p-2 text-emerald-300"><ShieldCheck size={18} /></div>
                <div>
                  <p className="text-sm font-semibold text-white">{admin.name || 'Admin'}</p>
                  <p className="text-xs text-slate-400">{admin.email}</p>
                </div>
              </div>
              <button onClick={logout} className="mt-4 flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-sm text-slate-300 hover:text-white">
                <LogOut size={16} /> Logout
              </button>
            </div>
          </nav>
        </aside>

        <main className="flex-1 bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.16),_transparent_40%)] p-4 sm:p-8">
          <Routes>
            <Route path="" element={<AdminDashboard />} />
            <Route path="content" element={<AdminContent />} />
            <Route path="payments" element={<AdminPayments />} />
            <Route path="settings" element={<AdminContent />} />
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default AdminApp;
