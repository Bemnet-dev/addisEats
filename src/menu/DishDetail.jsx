import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getDishById } from '../api/dishes';
import { formatCurrency } from '../utils/formatCurrency';
import { useCart } from '../cart/cartStore';
import { FavoriteButton } from '../favorites/FavoriteButton';
import { Spinner } from '../ui/Spinner';
import { Button } from '../ui/Button';
import { ArrowLeft, Clock, Flame, Star, Plus, Minus, Check, ShoppingBag, Sparkles, Utensils, Leaf, } from 'lucide-react';
export const DishDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const [dish, setDish] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [itemNote, setItemNote] = useState('');
    const [addedSuccess, setAddedSuccess] = useState(false);
    useEffect(() => {
        async function load() {
            if (!id)
                return;
            setLoading(true);
            setError(null);
            try {
                const found = await getDishById(id);
                if (found) {
                    setDish(found);
                }
                else {
                    setError('Dish not found in menu.');
                }
            }
            catch (err) {
                setError(err.message || 'Failed to fetch dish details.');
            }
            finally {
                setLoading(false);
            }
        }
        load();
    }, [id]);
    if (loading) {
        return (<div className="min-h-[60vh] flex items-center justify-center">
        <Spinner size="lg" label="Loading dish details..."/>
      </div>);
    }
    if (error || !dish) {
        return (<div className="max-w-md mx-auto my-16 text-center p-8 bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-sm">
        <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100 mb-2">
          Dish Not Found
        </h2>
        <p className="text-xs text-stone-500 mb-6">{error || 'This dish does not exist or has been removed.'}</p>
        <Button onClick={() => navigate('/menu')}>
          <ArrowLeft className="w-4 h-4 mr-1.5"/> Back to Menu
        </Button>
      </div>);
    }
    const handleAddToCart = () => {
        addToCart(dish, quantity, itemNote.trim() || undefined);
        setAddedSuccess(true);
        setTimeout(() => setAddedSuccess(false), 2000);
    };
    return (<div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6 flex items-center justify-between">
        <Link to="/menu" className="inline-flex items-center text-xs font-semibold text-stone-600 dark:text-stone-400 hover:text-[#D9381E] dark:hover:text-[#D9381E] transition-colors">
          <ArrowLeft className="w-4 h-4 mr-1.5"/> Back to Menu
        </Link>
        <span className="text-xs text-stone-400 uppercase tracking-widest font-bold">
          Category / {dish.category}
        </span>
      </div>
      <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200/80 dark:border-stone-800 shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-0">
        <div className="lg:col-span-6 bg-stone-100 dark:bg-stone-950 p-6 sm:p-10 flex flex-col items-center justify-center relative">
          <div className="absolute top-4 right-4 z-10">
            <FavoriteButton dishId={dish.id} size="md"/>
          </div>
          {dish.isSpecial && (<div className="absolute top-4 left-4 z-10 bg-[#D9381E] text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5"/> Chef Special
            </div>)}
          <div className="w-64 h-64 sm:w-80 sm:h-80 rounded-full overflow-hidden border-8 border-white dark:border-stone-900 shadow-2xl relative bg-stone-200">
            <img src={dish.image} alt={dish.name} className="w-full h-full object-cover" referrerPolicy="no-referrer"/>
          </div>
          <div className="mt-8 flex items-center gap-6 bg-white/80 dark:bg-stone-900/80 backdrop-blur-md px-6 py-3 rounded-full border border-stone-200/60 dark:border-stone-800 text-xs">
            <div className="flex items-center gap-1.5 font-bold text-amber-600">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400"/>
              <span>{dish.rating.toFixed(1)} / 5.0</span>
            </div>
            <div className="w-px h-4 bg-stone-200 dark:bg-stone-700"/>
            <div className="flex items-center gap-1.5 text-stone-600 dark:text-stone-300">
              <Clock className="w-4 h-4 text-stone-400"/>
              <span>{dish.prepTime}</span>
            </div>
            {dish.calories && (<>
                <div className="w-px h-4 bg-stone-200 dark:bg-stone-700"/>
                <div className="text-stone-600 dark:text-stone-300">
                  <span>{dish.calories} kcal</span>
                </div>
              </>)}
          </div>
        </div>
        <div className="lg:col-span-6 p-6 sm:p-10 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold text-[#D9381E] uppercase tracking-wider">
                {dish.category}
              </span>
              {dish.isVegetarian && (<span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">
                  <Leaf className="w-3 h-3"/> Vegetarian
                </span>)}
              {dish.spicyLevel && dish.spicyLevel > 0 ? (<span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/60 px-2 py-0.5 rounded-full">
                  <Flame className="w-3 h-3 fill-rose-500 text-rose-500"/>
                  Spicy (Level {dish.spicyLevel}/3)
                </span>) : null}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-stone-100 font-sans-display leading-snug">
              {dish.name}
            </h1>
            <div className="mt-3 text-2xl font-black text-[#D9381E] dark:text-[#FFA085]">
              {formatCurrency(dish.price)}
            </div>
            <p className="mt-4 text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
              {dish.description}
            </p>
            <div className="mt-6 pt-5 border-t border-stone-100 dark:border-stone-800">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-2.5 flex items-center gap-1.5">
                <Utensils className="w-3.5 h-3.5"/> Ingredients & Fresh Prep
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {dish.ingredients.map((ing, idx) => (<span key={idx} className="text-xs bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 px-3 py-1 rounded-full font-medium">
                    {ing}
                  </span>))}
              </div>
            </div>
            <div className="mt-5">
              <label htmlFor="dish-note" className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                Special Request for this Dish (optional)
              </label>
              <input id="dish-note" type="text" placeholder="e.g. Extra awaze sauce, no onions, well-done" value={itemNote} onChange={(e) => setItemNote(e.target.value)} className="w-full text-xs px-3.5 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-[#D9381E]"/>
            </div>
          </div>
          <div className="mt-8 pt-5 border-t border-stone-100 dark:border-stone-800 flex flex-col sm:flex-row items-center gap-4">
            <div className="flex items-center bg-stone-100 dark:bg-stone-800 rounded-full p-1 border border-stone-200 dark:border-stone-700">
              <button type="button" onClick={() => setQuantity((q) => Math.max(1, q - 1))} disabled={quantity <= 1} className="w-9 h-9 rounded-full bg-white dark:bg-stone-700 flex items-center justify-center text-stone-700 dark:text-stone-200 hover:bg-stone-200 transition-colors disabled:opacity-40 cursor-pointer" aria-label="Decrease quantity">
                <Minus className="w-4 h-4"/>
              </button>
              <span className="w-12 text-center text-sm font-bold text-stone-800 dark:text-stone-100">
                {quantity}
              </span>
              <button type="button" onClick={() => setQuantity((q) => q + 1)} className="w-9 h-9 rounded-full bg-white dark:bg-stone-700 flex items-center justify-center text-stone-700 dark:text-stone-200 hover:bg-stone-200 transition-colors cursor-pointer" aria-label="Increase quantity">
                <Plus className="w-4 h-4"/>
              </button>
            </div>
            <div className="flex-1 w-full flex items-center gap-2">
              <Button onClick={handleAddToCart} disabled={!dish.available} className="flex-1 py-3">
                {addedSuccess ? (<>
                    <Check className="w-5 h-5 mr-1.5"/> Added to Cart!
                  </>) : (<>
                    <ShoppingBag className="w-5 h-5 mr-1.5"/> Add To Cart ·{' '}
                    {formatCurrency(dish.price * quantity)}
                  </>)}
              </Button>
              <Link to="/cart">
                <Button variant="secondary" className="py-3 px-4" title="View Cart">
                  View Cart
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>);
};
