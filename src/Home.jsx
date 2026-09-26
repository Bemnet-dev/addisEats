import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { fetchDishes } from './api/dishes';
import { DishCard } from './menu/DishCard';
import { Button } from './ui/Button';
import { ArrowRight, MapPin, Phone, Mail, Clock, Send, CheckCircle2, Coffee, Flame, } from 'lucide-react';
export const Home = () => {
  const navigate = useNavigate();
  const [specialDishes, setSpecialDishes] = useState([]);
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  useEffect(() => {
    async function load() {
      try {
        const dishes = await fetchDishes();
        const specials = dishes.filter((d) => d.isSpecial).slice(0, 4);
        setSpecialDishes(specials.length > 0 ? specials : dishes.slice(0, 4));
      }
      catch (err) {
        console.error('Failed to load specials', err);
      }
    }
    load();
  }, []);
  const handleContactSubmit = (e) => {
    e.preventDefault();
    setContactSubmitted(true);
    setTimeout(() => {
      setContactSubmitted(false);
      setContactForm({ name: '', email: '', subject: '', message: '' });
    }, 3000);
  };
  return (<div className="space-y-16 sm:space-y-24">
    <section className="relative overflow-hidden bg-[#FAF6F0] dark:bg-stone-900/90 pt-8 pb-16 sm:pt-14 sm:pb-24 border-b border-[#EAE1D4] dark:border-stone-800">
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none bg-[radial-gradient(#D9381E_1px,transparent_1px)] [background-size:24px_24px]" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <h1 className="text-4xl sm:text-6xl xl:text-7xl font-bold tracking-tight text-stone-900 dark:text-stone-100 leading-[1.1]">
              <span className="font-script text-5xl sm:text-7xl text-stone-800 dark:text-stone-200 block sm:inline font-normal mr-3">
                Good Food,
              </span>{' '}
              <span className="font-sans-display font-extrabold text-[#D9381E] dark:text-[#FFA085]">
                Delivered
              </span>{' '}
              <span className="font-sans-display font-extrabold text-stone-700 dark:text-stone-300">
                Fast
              </span>
            </h1>
            <p className="text-sm sm:text-base text-stone-600 dark:text-stone-400 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Order hot meals from kitchens across Addis Ababa. Traditional Ethiopian dishes, pizza, and burgers delivered straight to your door.
            </p>
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
              <Button onClick={() => navigate('/menu')} size="lg" className="shadow-lg shadow-[#D9381E]/20">
                See Full Menu <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
              <Button onClick={() => {
                const el = document.getElementById('contact-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }} variant="outline" size="lg">
                Contact & Location
              </Button>
            </div>
            <div className="pt-6 grid grid-cols-3 gap-4 border-t border-stone-200/80 dark:border-stone-800 text-left max-w-lg mx-auto lg:mx-0">
              <div>
                <span className="block text-xl font-extrabold text-[#D9381E]">25-35 min</span>
                <span className="text-[11px] text-stone-500 font-medium">Fast Delivery</span>
              </div>
              <div>
                <span className="block text-xl font-extrabold text-[#D9381E]">Fresh</span>
                <span className="text-[11px] text-stone-500 font-medium">Daily Cooked</span>
              </div>
              <div>
                <span className="block text-xl font-extrabold text-[#D9381E]">Easy Pay</span>
                <span className="text-[11px] text-stone-500 font-medium">Telebirr or Cash</span>
              </div>
            </div>
          </div>
          <div className="lg:col-span-5 relative flex justify-center items-center">
            <div className="absolute -top-6 left-6 hidden sm:block pointer-events-none text-[#D9381E] dark:text-[#FFDDD4] opacity-70">
            </div>
            <div className="relative w-72 h-72 sm:w-96 sm:h-96 rounded-full p-3 bg-white dark:bg-stone-800 shadow-2xl border-4 border-[#EFE8DF] dark:border-stone-700 flex items-center justify-center">
              <div className="w-full h-full rounded-full overflow-hidden relative">
                <img src="/assets/shekla-tebs.png" alt="Authentic Addis Feast" className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700" referrerPolicy="no-referrer" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-0 right-0 text-center text-white">
                  <span className="text-xs font-bold uppercase tracking-wider bg-[#D9381E] px-3 py-1 rounded-full shadow-md">
                    Freshly Sizzled Shekla Tibs
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h2 className="font-script text-4xl sm:text-5xl text-stone-900 dark:text-stone-100 font-normal">
          Special Menu
        </h2>
        <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-2 max-w-md mx-auto">
          Popular meals cooked fresh with local ingredients and spices.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {specialDishes.map((dish) => (<DishCard key={dish.id} dish={dish} />))}
      </div>
      <div className="text-center mt-10">
        <Link to="/menu">
          <Button size="lg" variant="secondary" className="px-8 font-bold">
            View All Dishes <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </div>
    </section>
    <section className="bg-white dark:bg-stone-900/60 py-16 border-y border-stone-200/80 dark:border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-[#D9381E]">
            Why Choose Us
          </span>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-stone-100 font-sans-display mt-1">
            Fresh Food, Cooked Daily
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-[#FAF6F0] dark:bg-stone-800 p-8 rounded-3xl border border-[#EAE1D4] dark:border-stone-700 text-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-[#D9381E]/15 text-[#D9381E] flex items-center justify-center mx-auto">
              <Flame className="w-7 h-7" />
            </div>
            <h4 className="text-lg font-bold text-stone-900 dark:text-stone-100">
              Traditional Food
            </h4>
            <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
              Hot wats, sizzling tibs, and soft injera cooked with fresh spices.
            </p>
          </div>
          <div className="bg-[#FAF6F0] dark:bg-stone-800 p-8 rounded-3xl border border-[#EAE1D4] dark:border-stone-700 text-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-[#D9381E]/15 text-[#D9381E] flex items-center justify-center mx-auto">
              <Clock className="w-7 h-7" />
            </div>
            <h4 className="text-lg font-bold text-stone-900 dark:text-stone-100">
              Fast Delivery
            </h4>
            <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
              Motorbike riders bring hot food directly to your address in 30 minutes.
            </p>
          </div>
          <div className="bg-[#FAF6F0] dark:bg-stone-800 p-8 rounded-3xl border border-[#EAE1D4] dark:border-stone-700 text-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-[#D9381E]/15 text-[#D9381E] flex items-center justify-center mx-auto">
              <Coffee className="w-7 h-7" />
            </div>
            <h4 className="text-lg font-bold text-stone-900 dark:text-stone-100">
              Coffee & Drinks
            </h4>
            <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
              Freshly brewed Ethiopian coffee, spiced tea, and fruit juices.
            </p>
          </div>
        </div>
      </div>
    </section>
    <section id="contact-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
      <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-stone-200 dark:border-stone-800 bg-[#1E1510] text-white">
        <div className="absolute inset-0 opacity-15 pointer-events-none bg-cover bg-center" style={{
          backgroundImage: 'url(/assets/beyaynet.png)',
        }} />
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 sm:p-12 items-center">
          <div className="lg:col-span-6 bg-[#B91C1C] text-white p-8 sm:p-10 rounded-3xl shadow-xl">
            <h3 className="font-script text-4xl sm:text-5xl font-normal mb-2">
              Contact us
            </h3>
            <p className="text-xs text-white/80 mb-6 leading-relaxed">
              Have questions about food or orders? Send us a message and we will reply quickly.
            </p>
            {contactSubmitted ? (<div className="p-6 bg-emerald-800/80 rounded-2xl text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-200" />
              <h4 className="text-sm font-bold">Message Sent!</h4>
              <p className="text-xs text-white/80">
                We will call or email you soon.
              </p>
            </div>) : (<form onSubmit={handleContactSubmit} className="space-y-4">
              <div>
                <input type="text" required placeholder="Your Name" value={contactForm.name} onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-white/20 border border-white/30 text-white placeholder:text-white/60 text-xs focus:outline-none focus:ring-2 focus:ring-white" />
              </div>
              <div>
                <input type="email" required placeholder="Email Address" value={contactForm.email} onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-white/20 border border-white/30 text-white placeholder:text-white/60 text-xs focus:outline-none focus:ring-2 focus:ring-white" />
              </div>
              <div>
                <input type="text" placeholder="Subject" value={contactForm.subject} onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-white/20 border border-white/30 text-white placeholder:text-white/60 text-xs focus:outline-none focus:ring-2 focus:ring-white" />
              </div>
              <div>
                <textarea rows={3} required placeholder="Message" value={contactForm.message} onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-white/20 border border-white/30 text-white placeholder:text-white/60 text-xs focus:outline-none focus:ring-2 focus:ring-white resize-none" />
              </div>
              <button type="submit" className="w-full py-3 rounded-xl bg-white text-stone-900 hover:bg-stone-100 font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-md">
                <Send className="w-3.5 h-3.5" /> Send Message
              </button>
            </form>)}
          </div>
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-8 text-xs text-stone-300">
            <div>
              <h4 className="text-sm font-extrabold uppercase tracking-widest text-white mb-4">
                CONTACT
              </h4>
              <div className="space-y-4">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-[#D97706] shrink-0 mt-0.5" />
                  <span>Bole Medhanialem, Next to Edna Mall, Addis Ababa, Ethiopia</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Phone className="w-4 h-4 text-[#D97706] shrink-0 mt-0.5" />
                  <div>
                    <p>+251 91 123 4567</p>
                    <p>+251 11 661 2345</p>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <Mail className="w-4 h-4 text-[#D97706] shrink-0 mt-0.5" />
                  <div>
                    <p>orders@addiseats.et</p>
                    <p>support@addiseats.et</p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-extrabold uppercase tracking-widest text-white mb-4">
                OUR LINKS & HELP
              </h4>
              <ul className="space-y-2.5 text-stone-400">
                <li>
                  <Link to="/menu" className="hover:text-white transition-colors">
                    Browse Menu
                  </Link>
                </li>
                <li>
                  <Link to="/favorites" className="hover:text-white transition-colors">
                    Favorite Wishlist
                  </Link>
                </li>
                <li>
                  <Link to="/orders" className="hover:text-white transition-colors">
                    Order Tracking & History
                  </Link>
                </li>
                <li>
                  <Link to="/cart" className="hover:text-white transition-colors">
                    Shopping Cart
                  </Link>
                </li>
                <li className="pt-2 border-t border-stone-800">
                  <Link to="/admin" className="text-[#D97706] hover:underline font-semibold">
                    Restaurant Admin Portal →
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>);
};
