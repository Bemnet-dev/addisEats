import PropTypes from 'prop-types';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from './ThemeContext';
export const ThemeToggle = ({ className = '', showLabel = false, }) => {
    const { theme, toggleTheme } = useTheme();
    return (<button type="button" onClick={toggleTheme} className={`p-2 rounded-full text-stone-700 dark:text-stone-300 hover:bg-stone-200/60 dark:hover:bg-[#221812] transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#D9381E] flex items-center gap-1.5 ${className}`} aria-label={`Current: ${theme === 'light' ? 'Berbere Cream Light' : 'Velvet Roast Dark'} mode. Click to toggle.`} title={`Theme: ${theme === 'light' ? 'Berbere Cream (Light)' : 'Velvet Roast (Dark)'}. Click to switch.`}>
        {theme === 'light' ? (<Moon className="w-5 h-5 text-stone-700 transition-transform hover:-rotate-12" />) : (<Sun className="w-5 h-5 text-amber-400 transition-transform hover:rotate-90" />)}
        {showLabel && (<span className="text-xs font-semibold">
            {theme === 'light' ? 'Berbere Cream' : 'Velvet Roast'}
        </span>)}
    </button>);
};
ThemeToggle.propTypes = {
    className: PropTypes.string,
    showLabel: PropTypes.bool,
};
