import { useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { formatCurrency } from '../utils/formatCurrency';
import { FavoriteButton } from '../favorites/FavoriteButton';
import { useCart } from '../cart/cartStore';
import { Clock, Star, Flame, Check, Plus } from 'lucide-react';
export const DishCard = ({ dish }) => {
    const { addToCart } = useCart();
    const [justAdded, setJustAdded] = useState(false);
    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();
        addToCart(dish, 1);
        setJustAdded(true);
        setTimeout(() => setJustAdded(false), 1200);
    };
    return (<div id={`dish-card-${dish.id}`} className="group relative bg-white dark:bg-stone-900 rounded-3xl border border-stone-100 dark:border-stone-800 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden text-center">
      <div className="relative pt-6 pb-2 px-4 flex justify-center items-center">
        <div className="absolute top-0 left-4 right-4 h-24 bg-[#C2410C]/20 dark:bg-[#C2410C]/15 rounded-b-[48px] -z-0 transition-transform duration-300 group-hover:scale-y-105"/>
        <div className="absolute top-3 right-3 z-10">
          <FavoriteButton dishId={dish.id} size="sm"/>
        </div>
        {dish.isSpecial && (<span className="absolute top-3 left-3 z-10 bg-[#D9381E] text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-xs">
            Special
          </span>)}
        <Link to={`/menu/${dish.id}`} className="relative z-1 block focus:outline-none focus:ring-2 focus:ring-[#D9381E] rounded-full" aria-label={`View details for ${dish.name}`}>
          <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-full overflow-hidden border-4 border-white dark:border-stone-900 shadow-md transform transition-transform duration-300 group-hover:scale-105 mx-auto bg-stone-100">
            <img src={dish.image} alt={dish.name} className="w-full h-full object-cover" loading="lazy" referrerPolicy="no-referrer"/>
          </div>
        </Link>
      </div>
      <div className="p-5 pt-3 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-center gap-3 text-xs text-stone-500 dark:text-stone-400 mb-1.5">
            <span className="inline-flex items-center font-medium text-amber-600 dark:text-amber-400">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 mr-1"/>
              {dish.rating.toFixed(1)}
            </span>
            <span>•</span>
            <span className="inline-flex items-center">
              <Clock className="w-3.5 h-3.5 mr-1"/>
              {dish.prepTime}
            </span>
            {dish.spicyLevel && dish.spicyLevel > 0 ? (<>
                <span>•</span>
                <span className="inline-flex items-center text-rose-500 font-medium" title={`Spicy Level: ${dish.spicyLevel}/3`}>
                  <Flame className="w-3.5 h-3.5 mr-0.5 fill-rose-500 text-rose-500"/>
                  <span className="text-[11px]">Spicy</span>
                </span>
              </>) : null}
          </div>
          <Link to={`/menu/${dish.id}`} className="block text-lg font-bold text-stone-900 dark:text-stone-100 hover:text-[#D9381E] dark:hover:text-[#D97706] transition-colors leading-tight line-clamp-1">
            {dish.name}
          </Link>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-1.5 line-clamp-2 leading-relaxed">
            {dish.description}
          </p>
        </div>
        <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-800 flex flex-col items-center gap-2.5">
          <span className="text-base font-extrabold text-[#D9381E] dark:text-[#FFA085]">
            {formatCurrency(dish.price)}
          </span>
          <button type="button" onClick={handleAddToCart} disabled={!dish.available} className={`w-full py-2 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#D9381E] ${!dish.available
            ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
            : justAdded
                ? 'bg-emerald-600 text-white'
                : 'bg-[#D9381E] hover:bg-[#991B1B] text-white shadow-xs'}`} aria-label={`Add ${dish.name} to cart`}>
            {justAdded ? (<>
                <Check className="w-3.5 h-3.5"/> Added!
              </>) : !dish.available ? ('Sold Out') : (<>
                <Plus className="w-3.5 h-3.5"/> Add To Cart
              </>)}
          </button>
        </div>
      </div>
    </div>);
};
DishCard.propTypes = {
    dish: PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        amharicName: PropTypes.string,
        category: PropTypes.string.isRequired,
        price: PropTypes.number.isRequired,
        description: PropTypes.string.isRequired,
        image: PropTypes.string.isRequired,
        rating: PropTypes.number,
        prepTime: PropTypes.string,
        calories: PropTypes.number,
        ingredients: PropTypes.arrayOf(PropTypes.string),
        isSpicy: PropTypes.bool,
        spicyLevel: PropTypes.number,
        isVegetarian: PropTypes.bool,
        isSpecial: PropTypes.bool,
        available: PropTypes.bool,
    }).isRequired,
};
