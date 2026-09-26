import PropTypes from 'prop-types';
import { Utensils, Flame, Pizza, Sandwich, Coffee } from 'lucide-react';
// eslint-disable-next-line react-refresh/only-export-components
export const CATEGORIES = [
    { id: 'All', label: 'All Dishes', icon: Utensils },
    { id: 'Ethiopian', label: 'Ethiopian', icon: Flame },
    { id: 'Pizza', label: 'Pizza', icon: Pizza },
    { id: 'Burgers', label: 'Burgers', icon: Sandwich },
    { id: 'Drinks', label: 'Drinks', icon: Coffee },
];
export const CategoryBar = ({ selectedCategory, onSelectCategory, counts, }) => {
    return (<div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none py-1">
        {CATEGORIES.map(({ id, label, icon: Icon }) => {
            const isSelected = selectedCategory === id;
            const count = counts ? counts[id] : undefined;
            return (<button key={id} onClick={() => onSelectCategory(id)} className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#D9381E] ${isSelected
                ? 'bg-[#D9381E] text-white shadow-md shadow-[#D9381E]/25 scale-[1.02]'
                : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700/60 border border-stone-200/80 dark:border-stone-700/80'}`} aria-pressed={isSelected} aria-label={`Filter by ${label}`}>
                <Icon className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-[#D9381E]'}`} />
                <span>{label}</span>
                {count !== undefined && (<span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${isSelected
                    ? 'bg-white/20 text-white'
                    : 'bg-stone-100 dark:bg-stone-700 text-stone-600 dark:text-stone-300'}`}>
                    {count}
                </span>)}
            </button>);
        })}
    </div>);
};
CategoryBar.propTypes = {
    selectedCategory: PropTypes.string.isRequired,
    onSelectCategory: PropTypes.func.isRequired,
    counts: PropTypes.objectOf(PropTypes.number),
};
