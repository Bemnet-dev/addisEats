import { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { CartBadge } from './cart/CartBadge';
import { ThemeToggle } from './theme/ThemeToggle';
import { useAuth } from './auth/AuthContext';
import { useOrders } from './orders/orderHistoryStore';
import { Menu as MenuIcon, X, User, Heart, Clock, Utensils, Home as HomeIcon, ShieldAlert, LogOut, ChevronDown, MapPin, Phone, } from 'lucide-react';
export const Layout = () => {
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const { orders } = useOrders();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const activeOrdersCount = orders.filter((o) => o.status !== 'delivered').length;
  const navLinks = [
    { label: 'Home', path: '/', icon: HomeIcon },
    { label: 'Menu', path: '/menu', icon: Utensils },
    { label: 'Favorites', path: '/favorites', icon: Heart },
    { label: 'My Orders', path: '/orders', icon: Clock },
  ];
  const isActive = (path) => {
    if (path === '/' && location.pathname === '/')
      return true;
    if (path !== '/' && location.pathname.startsWith(path))
      return true;
    return false;
  };
  return (<div className="min-h-screen flex flex-col bg-[#FAF6F0] dark:bg-[#0E0A07] text-stone-900 dark:text-stone-100 transition-colors duration-200">
    <div className="bg-[#221812] text-white py-1.5 px-4 text-center text-[11px] font-medium tracking-wide flex items-center justify-center gap-2">
      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
      <span>Live in Addis Ababa: Fast delivery to Bole, Kazanchis, Piassa, Sarbet & CMC. <strong>Call 0911234567</strong></span>
      <span className="text-stone-400 hidden sm:inline">|</span>
      <Link to="/admin" className="text-[#FFA085] hover:underline font-bold hidden sm:inline">
        Staff & Admin Dashboard →
      </Link>
    </div>
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#16100B]/95 backdrop-blur-md border-b border-stone-200/80 dark:border-stone-800/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center gap-2.5 focus:outline-none focus:ring-2 focus:ring-[#D9381E] rounded-xl px-1" aria-label="Addis Eats Homepage">
            <div className="w-10 h-10 rounded-2xl bg-[#D9381E] text-white flex items-center justify-center shadow-md shadow-[#D9381E]/20">
              <span className="font-extrabold text-xl tracking-tighter">AE</span>
            </div>
            <div className="flex flex-col">
              <span className="font-sans-display font-black text-2xl tracking-tighter text-stone-900 dark:text-white leading-none">
                ADDIS<span className="text-[#D9381E]">.</span>
              </span>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-stone-400 dark:text-stone-500 mt-0.5">
                Eats & Delivery
              </span>
            </div>
          </Link>
          <nav className="hidden md:flex items-center gap-1.5" aria-label="Main Navigation">
            {navLinks.map(({ label, path }) => {
              const active = isActive(path);
              const hasActiveDelivery = label === 'My Orders' && activeOrdersCount > 0;
              return (<Link key={path} to={path} className={`px-4 py-2 rounded-full text-xs font-bold transition-all inline-flex items-center gap-1.5 ${active
                ? 'bg-[#D9381E]/10 dark:bg-[#D9381E]/20 text-[#D9381E] dark:text-[#FFDDD4]'
                : 'text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800'}`}>
                <span>{label}</span>
                {hasActiveDelivery && (<span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title={`${activeOrdersCount} active delivery in transit`} />)}
              </Link>);
            })}
            <Link to="/admin" className="ml-2 px-3 py-1.5 rounded-full text-xs font-bold bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 hover:bg-amber-100 transition-colors inline-flex items-center gap-1" title="Restaurant Staff & Admin Area">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Admin</span>
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <div className="relative">
              <button type="button" onClick={() => setUserDropdownOpen((prev) => !prev)} className="flex items-center gap-2 p-2 rounded-full bg-stone-100 dark:bg-stone-800 hover:bg-stone-200/80 dark:hover:bg-stone-700 transition-colors cursor-pointer text-stone-700 dark:text-stone-300 focus:outline-none focus:ring-2 focus:ring-[#D9381E]" aria-label="User account menu">
                <User className="w-5 h-5 text-[#D9381E]" />
                {isAuthenticated && user && (<span className="text-xs font-bold hidden lg:inline max-w-[100px] truncate">
                  {user.name.split(' ')[0]}
                </span>)}
                <ChevronDown className="w-3 h-3 text-stone-400 hidden sm:inline" />
              </button>
              {userDropdownOpen && (<div className="absolute right-0 mt-2 w-64 bg-white dark:bg-stone-900 rounded-2xl shadow-xl border border-stone-200 dark:border-stone-800 p-4 z-50 animate-in fade-in zoom-in-95 duration-150" onMouseLeave={() => setUserDropdownOpen(false)}>
                {isAuthenticated && user ? (<div className="space-y-3">
                  <div className="pb-3 border-b border-stone-100 dark:border-stone-800">
                    <p className="text-xs font-bold text-stone-900 dark:text-stone-100">
                      {user.name}
                    </p>
                    <p className="text-[11px] text-stone-500 truncate">{user.phone}</p>
                    <p className="text-[10px] text-[#D9381E] font-semibold mt-0.5 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#D9381E]" /> {user.area}
                    </p>
                  </div>
                  <Link to="/orders" onClick={() => setUserDropdownOpen(false)} className="block text-xs font-semibold text-stone-700 dark:text-stone-300 hover:text-[#D9381E]">
                    View Past Orders
                  </Link>
                  <Link to="/favorites" onClick={() => setUserDropdownOpen(false)} className="block text-xs font-semibold text-stone-700 dark:text-stone-300 hover:text-[#D9381E]">
                    Saved Favorites
                  </Link>
                  <button onClick={() => {
                    logout();
                    setUserDropdownOpen(false);
                  }} className="w-full text-left text-xs font-semibold text-rose-600 hover:text-rose-700 pt-2 border-t border-stone-100 dark:border-stone-800 flex items-center gap-1.5 cursor-pointer">
                    <LogOut className="w-3.5 h-3.5" /> Sign Out
                  </button>
                </div>) : (<div className="space-y-3 text-center">
                  <p className="text-xs text-stone-500">
                    Sign in to quickly order and save favorites.
                  </p>
                  <div className="space-y-2">
                    <Link to="/login" onClick={() => setUserDropdownOpen(false)} className="block w-full py-2 px-3 rounded-xl bg-[#D9381E] text-white text-xs font-bold hover:bg-[#B82A13] text-center cursor-pointer">
                      Sign In
                    </Link>
                    <Link to="/signup" onClick={() => setUserDropdownOpen(false)} className="block w-full py-2 px-3 rounded-xl border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 text-xs font-bold hover:bg-stone-100 dark:hover:bg-stone-800 text-center cursor-pointer">
                      Create Account
                    </Link>
                  </div>
                </div>)}
              </div>)}
            </div>
            <CartBadge />
            <button type="button" onClick={() => setMobileMenuOpen((prev) => !prev)} className="p-2 md:hidden rounded-full text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer" aria-label="Toggle mobile menu">
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>
      {mobileMenuOpen && (<div className="md:hidden bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800 px-4 pt-2 pb-6 space-y-2 animate-in slide-in-from-top duration-200">
        {navLinks.map(({ label, path, icon: Icon }) => {
          const active = isActive(path);
          const hasActiveDelivery = label === 'My Orders' && activeOrdersCount > 0;
          return (<Link key={path} to={path} onClick={() => setMobileMenuOpen(false)} className={`flex items-center justify-between px-4 py-2.5 rounded-2xl text-xs font-bold ${active
            ? 'bg-[#D9381E] text-white'
            : 'text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'}`}>
            <div className="flex items-center gap-3">
              <Icon className="w-4 h-4" />
              <span>{label}</span>
            </div>
            {hasActiveDelivery && (<span className="text-[10px] bg-emerald-500 text-white px-2 py-0.5 rounded-full font-extrabold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
              Live
            </span>)}
          </Link>);
        })}
        <Link to="/admin" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 rounded-2xl text-xs font-bold text-amber-800 bg-amber-50 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
          <ShieldAlert className="w-4 h-4" />
          <span>Staff & Admin Dashboard</span>
        </Link>
      </div>)}
    </header>
    <main className="flex-1">
      <Outlet />
    </main>
    <footer className="bg-[#19120D] text-stone-400 text-xs py-12 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 pb-8 border-b border-stone-800">
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#D9381E] text-white flex items-center justify-center font-bold">
                AE
              </div>
              <span className="text-white font-extrabold text-lg">Addis Eats</span>
            </div>
            <p className="text-stone-400 text-xs max-w-sm leading-relaxed">
              Order hot meals from local Addis Ababa kitchens. Quick delivery to your home or office.
            </p>
            <div className="flex items-center gap-3 text-stone-400 text-xs">
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#D97706]" /> Addis Ababa, Ethiopia
              </span>
              <span>•</span>
              <span className="inline-flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-[#D97706]" /> +251 91 123 4567
              </span>
            </div>
          </div>
          <div>
            <h4 className="text-white font-bold mb-3 uppercase tracking-wider text-[11px]">
              Customer Routes
            </h4>
            <ul className="space-y-2">
              <li><Link to="/" className="hover:text-white transition-colors">Home & Specials</Link></li>
              <li><Link to="/menu" className="hover:text-white transition-colors">Browse Full Menu</Link></li>
              <li><Link to="/cart" className="hover:text-white transition-colors">Shopping Cart</Link></li>
              <li><Link to="/favorites" className="hover:text-white transition-colors">Saved Wishlist</Link></li>
              <li><Link to="/orders" className="hover:text-white transition-colors">Past Order Tracking</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-3 uppercase tracking-wider text-[11px]">
              Restaurant Admin
            </h4>
            <ul className="space-y-2">
              <li><Link to="/admin" className="text-[#D97706] hover:underline">Analytics Dashboard</Link></li>
              <li><Link to="/admin/menu" className="hover:text-white transition-colors">Dishes CRUD Manager</Link></li>
              <li><Link to="/admin/orders" className="hover:text-white transition-colors">Order Status Management</Link></li>
              <li><Link to="/admin/login" className="hover:text-white transition-colors">Admin Login Portal</Link></li>
            </ul>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
          <p>© {new Date().getFullYear()} Addis Eats. All rights reserved.</p>
        </div>
      </div>
    </footer>
  </div>);
};
