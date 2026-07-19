import React, { useEffect, useMemo, useState } from 'react';
import { Navigate, Route, Routes, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Settings, ShieldCheck, CreditCard, FileText, LogOut, Menu, X, Heart, Image as ImageIcon, BookOpen, Share2, Users, MessageSquare, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
import AdminLogin from './AdminLogin';
import AdminDashboard from './AdminDashboard';
import AdminContent from './AdminContent';
import AdminCauses from './AdminCauses';
import AdminGallery from './AdminGallery';
import AdminStories from './AdminStories';
import AdminSocial from './AdminSocial';
import AdminPayments from './AdminPayments';
import AdminVolunteers from './AdminVolunteers';
import AdminContacts from './AdminContacts';

const getStoredAdmin = () => {
  try {
    return JSON.parse(localStorage.getItem('jana-admin'));
  } catch {
    return null;
  }
};

const AdminApp = () => {
  const [admin, setAdmin] = useState(getStoredAdmin());
  const [isCollapsed, setIsCollapsed] = useState(() => {
    return localStorage.getItem('jana-admin-collapsed') === 'true';
  });
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMobileDropdownOpen(false);
  }, [location.pathname]);

  const logout = () => {
    localStorage.removeItem('jana-admin');
    setAdmin(null);
  };

  const toggleCollapse = () => {
    setIsCollapsed(prev => {
      const next = !prev;
      localStorage.setItem('jana-admin-collapsed', String(next));
      return next;
    });
  };

  const sidebarLinks = useMemo(() => [
    { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { label: 'Content', path: '/admin/content', icon: FileText },
    { label: 'Causes', path: '/admin/causes', icon: Heart },
    { label: 'Gallery', path: '/admin/gallery', icon: ImageIcon },
    { label: 'Success Stories', path: '/admin/stories', icon: BookOpen },
    { label: 'Social Connect', path: '/admin/social', icon: Share2 },
    { label: 'Payments', path: '/admin/payments', icon: CreditCard },
    { label: 'Volunteers', path: '/admin/volunteers', icon: Users },
    { label: 'Contact Messages', path: '/admin/contacts', icon: MessageSquare },
  ], []);

  // Compute active link for mobile dropdown
  const activeLink = sidebarLinks.find(link => {
    if (link.path === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname === link.path;
  }) || sidebarLinks[0];

  const ActiveIcon = activeLink?.icon;

  if (!admin) {
    return <AdminLogin onLogin={(user) => { setAdmin(user); }} />;
  }

  return (
    <div className="h-screen bg-slate-950 text-slate-100 flex flex-col overflow-hidden">
      
      {/* MOBILE HEADER & NAVIGATION DROPDOWN */}
      <div className="lg:hidden relative px-6 py-4 bg-slate-900 border-b border-white/10 flex items-center justify-between z-40 flex-shrink-0">
        <div>
          <p className="text-[9px] uppercase tracking-[0.25em] text-emerald-300">Jana Bikas</p>
          <span className="text-sm font-bold text-white">Admin Console</span>
        </div>

        <div className="relative">
          <button 
            onClick={() => setMobileDropdownOpen(prev => !prev)}
            className="flex items-center gap-2 rounded-xl border border-white/10 bg-slate-950 px-3.5 py-2.5 text-xs font-semibold text-white shadow-lg active:scale-95 transition-transform"
          >
            {ActiveIcon && <ActiveIcon size={14} className="text-emerald-400" />}
            <span>{activeLink?.label || 'Dashboard'}</span>
            <ChevronDown size={12} className={`transition-transform duration-200 ${mobileDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {mobileDropdownOpen && (
            <div className="absolute right-0 mt-2 w-52 z-50 rounded-2xl border border-white/10 bg-slate-900 p-2 shadow-2xl space-y-0.5 animate-fade-in text-left">
              {sidebarLinks.map((link) => {
                const Icon = link.icon;
                const active = location.pathname === link.path || (link.path === '/admin' && location.pathname === '/admin');
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setMobileDropdownOpen(false)}
                    className={`flex items-center gap-3.5 rounded-xl px-3 py-2 text-xs font-semibold transition ${active ? 'bg-emerald-500/15 text-emerald-300' : 'text-slate-350 hover:bg-white/5 hover:text-white'}`}
                  >
                    <Icon size={14} />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
              <div className="border-t border-white/5 my-1.5"></div>
              <button 
                onClick={logout} 
                className="w-full flex items-center gap-3.5 rounded-xl px-3 py-2 text-xs font-semibold text-rose-450 hover:bg-rose-500/10 transition"
              >
                <LogOut size={14} />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col lg:flex-row min-h-0 overflow-hidden">
        
        {/* DESKTOP SIDEBAR */}
        <aside className={`hidden lg:flex flex-col ${isCollapsed ? 'w-20' : 'w-72'} border-r border-white/10 bg-slate-900/80 backdrop-blur-xl transition-all duration-300 ease-in-out h-full overflow-hidden flex-shrink-0`}>
          <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} px-6 py-5 border-b border-white/5 flex-shrink-0`}>
            {!isCollapsed && (
              <div>
                <p className="text-[11px] uppercase tracking-[0.3em] text-emerald-300">Jana Bikas</p>
                <h2 className="text-lg font-semibold text-white">Admin Console</h2>
              </div>
            )}
            <button 
              className="rounded-lg border border-white/10 p-2 text-slate-400 hover:text-white hover:bg-white/5 transition"
              onClick={toggleCollapse}
              title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            >
              {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </button>
          </div>

          <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
            {sidebarLinks.map((link) => {
              const Icon = link.icon;
              const active = location.pathname === link.path || (link.path === '/admin' && location.pathname === '/admin');
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  title={isCollapsed ? link.label : undefined}
                  className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} rounded-2xl p-3 text-sm font-medium transition ${active ? 'bg-emerald-500/15 text-emerald-300 shadow-lg shadow-emerald-500/10' : 'text-slate-355 hover:bg-white/5 hover:text-white'}`}
                >
                  <Icon size={18} className={active ? 'text-emerald-300' : 'text-slate-400'} />
                  {!isCollapsed && <span className="truncate">{link.label}</span>}
                </Link>
              );
            })}
          </nav>

          {/* User profile footer */}
          <div className="p-4 border-t border-white/5 flex-shrink-0">
            {isCollapsed ? (
              <div className="flex flex-col items-center gap-3">
                <div className="rounded-2xl bg-white/5 border border-white/10 p-2.5 text-emerald-300" title={`${admin.name || 'Admin'} (${admin.email})`}>
                  <ShieldCheck size={18} />
                </div>
                <button 
                  onClick={logout} 
                  className="p-2.5 rounded-xl border border-white/10 text-slate-450 hover:text-rose-450 hover:bg-rose-500/10 hover:border-rose-500/20 transition" 
                  title="Logout"
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-emerald-500/15 to-amber-500/10 p-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-white/10 p-2 text-emerald-300"><ShieldCheck size={18} /></div>
                  <div className="text-left min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{admin.name || 'Admin'}</p>
                    <p className="text-xs text-slate-450 truncate">{admin.email}</p>
                  </div>
                </div>
                <button onClick={logout} className="mt-4 w-full flex items-center justify-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-white/5 transition">
                  <LogOut size={16} /> Logout
                </button>
              </div>
            )}
          </div>
        </aside>

        {/* MAIN DISPLAY WORKSPACE */}
        <main className="flex-1 bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.16),_transparent_40%)] p-4 sm:p-8 overflow-y-auto h-full min-w-0">
          <Routes>
            <Route path="" element={<AdminDashboard />} />
            <Route path="content" element={<AdminContent />} />
            <Route path="causes" element={<AdminCauses />} />
            <Route path="gallery" element={<AdminGallery />} />
            <Route path="stories" element={<AdminStories />} />
            <Route path="social" element={<AdminSocial />} />
            <Route path="payments" element={<AdminPayments />} />
            <Route path="volunteers" element={<AdminVolunteers />} />
            <Route path="contacts" element={<AdminContacts />} />
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default AdminApp;
