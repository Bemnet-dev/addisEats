import PropTypes from 'prop-types';
import { Heart } from 'lucide-react';
import { useFavorites } from './favoritesStore';
export const FavoriteButton = ({ dishId, className = '', size = 'md', }) => {
    const { isFavorite, toggle } = useFavorites();
    const favorite = isFavorite(dishId);
    const iconSizes = {
        sm: 'w-4 h-4',
        md: 'w-5 h-5',
    };
    return (<button type="button" onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggle(dishId);
        }} className={`p-2 rounded-full backdrop-blur-md transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#D9381E] ${favorite
            ? 'bg-rose-50 text-rose-500 hover:bg-rose-100 dark:bg-rose-950/60 dark:text-rose-400'
            : 'bg-white/80 dark:bg-stone-800/80 text-stone-400 hover:text-rose-500 hover:bg-white dark:hover:bg-stone-800'} ${className}`} aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'} title={favorite ? 'Remove from favorites' : 'Add to favorites'}>
      <Heart className={`${iconSizes[size]} transition-transform active:scale-125 ${favorite ? 'fill-rose-500 text-rose-500' : ''}`}/>
    </button>);
};
FavoriteButton.propTypes = {
    dishId: PropTypes.string.isRequired,
    className: PropTypes.string,
    size: PropTypes.oneOf(['sm', 'md']),
};
