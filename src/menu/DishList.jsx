import PropTypes from 'prop-types';
import { DishCard } from './DishCard';
import { AlertCircle, RefreshCw, UtensilsCrossed } from 'lucide-react';
import { Button } from '../ui/Button';
export const DishList = ({ dishes, loading, error, onRetry, emptyMessage = 'No dishes found matching your criteria.', }) => {
    if (loading) {
        return (<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (<div key={i} className="bg-white dark:bg-stone-900 rounded-3xl p-5 border border-stone-100 dark:border-stone-800 animate-pulse text-center">
            <div className="w-32 h-32 rounded-full bg-stone-200 dark:bg-stone-800 mx-auto mb-4"/>
            <div className="h-4 bg-stone-200 dark:bg-stone-800 rounded-md w-3/4 mx-auto mb-2"/>
            <div className="h-3 bg-stone-100 dark:bg-stone-800/60 rounded-md w-1/2 mx-auto mb-4"/>
            <div className="h-6 bg-stone-200 dark:bg-stone-800 rounded-md w-1/3 mx-auto mb-4"/>
            <div className="h-9 bg-stone-200 dark:bg-stone-800 rounded-xl w-full"/>
          </div>))}
      </div>);
    }
    if (error) {
        return (<div className="p-8 my-8 text-center bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900 rounded-3xl max-w-lg mx-auto">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-3"/>
        <h3 className="text-lg font-bold text-rose-900 dark:text-rose-200 mb-1">
          Unable to Load Menu
        </h3>
        <p className="text-xs text-rose-700 dark:text-rose-400 mb-4">
          {error.message || 'An error occurred while fetching the menu items.'}
        </p>
        {onRetry && (<Button onClick={onRetry} variant="outline" size="sm">
            <RefreshCw className="w-3.5 h-3.5 mr-1.5"/> Try Again
          </Button>)}
      </div>);
    }
    if (dishes.length === 0) {
        return (<div className="text-center py-16 px-4 bg-white/50 dark:bg-stone-900/50 rounded-3xl border border-dashed border-stone-200 dark:border-stone-800 my-6">
        <div className="w-16 h-16 rounded-full bg-[#D9381E]/10 text-[#D9381E] flex items-center justify-center mx-auto mb-3">
          <UtensilsCrossed className="w-8 h-8"/>
        </div>
        <h3 className="text-base font-bold text-stone-800 dark:text-stone-200">
          No Dishes Found
        </h3>
        <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 max-w-sm mx-auto">
          {emptyMessage}
        </p>
      </div>);
    }
    return (<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {dishes.map((dish) => (<DishCard key={dish.id} dish={dish}/>))}
    </div>);
};
DishList.propTypes = {
    dishes: PropTypes.arrayOf(PropTypes.object).isRequired,
    loading: PropTypes.bool,
    error: PropTypes.shape({
        message: PropTypes.string,
    }),
    onRetry: PropTypes.func,
    emptyMessage: PropTypes.string,
};
