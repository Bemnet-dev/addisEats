import { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAdminAuth } from './useAdminAuth';
import { ThemeToggle } from '../theme/ThemeToggle';
import { LayoutDashboard, UtensilsCrossed, ShoppingBag, LogOut, ExternalLink, Menu as MenuIcon, X, ShieldCheck, Store, } from 'lucide-react';
export const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { admin, logout } = useAdminAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navItems = [
    { label: 'Dashboard & Analytics', path: '/admin', icon: LayoutDashboard, exact: true },
    { label: 'Menu Dishes CRUD', path: '/admin/menu', icon: UtensilsCrossed, exact: false },
    { label: 'Orders & Status', path: '/admin/orders', icon: ShoppingBag, exact: false },
  ];
  const isActive = (path, exact) => {
    if (exact)
      return location.pathname === path;
    return location.pathname.startsWith(path);
  };
  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };
  return (<div className="min-h-screen flex bg-[#F5F2EC] dark:bg-[#0E0A08] text-stone-900 dark:text-stone-100">
    {sidebarOpen && (<div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />)}
    <aside className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-white dark:bg-[#16100C] border-r border-stone-200 dark:border-stone-800 flex flex-col justify-between transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div>
        <div className="p-6 flex items-center justify-between border-b border-stone-100 dark:border-stone-800">
          <Link to="/admin" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#D9381E] text-white flex items-center justify-center font-bold shadow-md">
              AE
            </div>
            <div>
              <span className="font-extrabold text-stone-900 dark:text-stone-100 tracking-tight text-lg">
                Addis Eats Admin
              </span>
              <span className="block text-[10px] text-[#D9381E] font-semibold uppercase tracking-widest">
                Restaurant Staff
              </span>
            </div>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1.5 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200">
            <X className="w-5 h-5" />
          </button>
        </div>
        <nav className="p-4 space-y-1.5" aria-label="Admin Navigation">
          {navItems.map(({ label, path, icon: Icon, exact }) => {
            const active = isActive(path, exact);
            return (<Link key={path} to={path} onClick={() => setSidebarOpen(false)} className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all ${active
              ? 'bg-[#D9381E] text-white shadow-md shadow-[#D9381E]/20'
              : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800/60 hover:text-stone-900 dark:hover:text-white'}`}>
              <Icon className="w-4 h-4" />
              <span>{label}</span>
            </Link>);
          })}
        </nav>
      </div>
      <div className="p-4 border-t border-stone-100 dark:border-stone-800 space-y-3">
        <Link to="/" className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-stone-100 dark:bg-stone-800/80 text-xs font-bold text-stone-700 dark:text-stone-300 hover:bg-stone-200/70 transition-colors">
          <span className="flex items-center gap-2">
            <Store className="w-4 h-4 text-[#D9381E]" />
            <span>Customer Store</span>
          </span>
          <ExternalLink className="w-3.5 h-3.5 text-stone-400" />
        </Link>
        <div className="flex items-center justify-between px-2 pt-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div className="text-xs">
              <p className="font-bold text-stone-800 dark:text-stone-200">
                {admin?.username || 'Admin'}
              </p>
              <p className="text-[10px] text-stone-400 capitalize">
                {admin?.role || 'Manager'}
              </p>
            </div>
          </div>
          <button onClick={handleLogout} className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer" title="Logout from admin session" aria-label="Logout from admin session">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
    <div className="flex-1 lg:pl-64 flex flex-col min-h-screen">
      <header className="sticky top-0 z-30 bg-white/90 dark:bg-[#16100C]/90 backdrop-blur-md border-b border-stone-200 dark:border-stone-800 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => setSidebarOpen(true)} className="p-2 lg:hidden rounded-xl text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer" aria-label="Open navigation sidebar">
            <MenuIcon className="w-5 h-5" />
          </button>
          <h2 className="text-sm font-bold text-stone-800 dark:text-stone-200 hidden sm:block">
            Addis Eats Management Portal
          </h2>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link to="/menu" className="hidden sm:inline-flex items-center gap-1 text-xs font-bold text-[#D9381E] hover:underline">
            View Live Menu →
          </Link>
        </div>
      </header>
      <main className="flex-1 p-4 sm:p-8">
        <Outlet />
      </main>
    </div>
  </div>);
};
