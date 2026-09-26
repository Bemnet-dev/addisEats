import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useFavorites } from './favoritesStore';
import { fetchDishes } from '../api/dishes';
import { DishCard } from '../menu/DishCard';
import { Spinner } from '../ui/Spinner';
import { Button } from '../ui/Button';
import { Heart, ArrowRight } from 'lucide-react';
export const Favorites = () => {
    const { favoriteIds } = useFavorites();
    const [dishes, setDishes] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        async function load() {
            setLoading(true);
            try {
                const all = await fetchDishes();
                setDishes(all.filter((d) => favoriteIds.includes(d.id)));
            }
            finally {
                setLoading(false);
            }
        }
        load();
    }, [favoriteIds]);
    return (<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <span className="text-xs font-bold uppercase tracking-widest text-[#D9381E] bg-[#D9381E]/10 px-3 py-1 rounded-full inline-block mb-2">
          Your Saved Dishes
        </span>
        <h1 className="text-3xl font-extrabold text-stone-900 dark:text-stone-100 font-sans-display">
          Favorite Meals ({favoriteIds.length})
        </h1>
        <p className="text-xs text-stone-500 mt-1">
          Quickly re-order the dishes you love with one tap.
        </p>
      </div>
      {loading ? (<div className="min-h-[40vh] flex items-center justify-center">
          <Spinner size="md" label="Loading favorites..."/>
        </div>) : dishes.length === 0 ? (<div className="text-center py-16 px-4 bg-white dark:bg-stone-900 rounded-3xl border border-dashed border-stone-200 dark:border-stone-800 max-w-xl mx-auto">
          <div className="w-16 h-16 rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-500 flex items-center justify-center mx-auto mb-3">
            <Heart className="w-8 h-8"/>
          </div>
          <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100 mb-1">
            No Saved Favorites Yet
          </h3>
          <p className="text-xs text-stone-500 dark:text-stone-400 mb-6 max-w-sm mx-auto">
            Click the heart icon on any dish card in our menu to save it here for quick ordering.
          </p>
          <Link to="/menu">
            <Button>
              Browse Menu <ArrowRight className="w-4 h-4 ml-1.5"/>
            </Button>
          </Link>
        </div>) : (<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {dishes.map((dish) => (<DishCard key={dish.id} dish={dish}/>))}
        </div>)}
    </div>);
};
