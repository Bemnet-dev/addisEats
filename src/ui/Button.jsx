import PropTypes from 'prop-types';
import { Loader2 } from 'lucide-react';
export const Button = ({ variant = 'primary', size = 'md', isLoading = false, className = '', disabled, children, ...props }) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none cursor-pointer';
    const sizeStyles = {
        sm: 'text-xs px-3.5 py-1.5 gap-1.5',
        md: 'text-sm px-5 py-2.5 gap-2',
        lg: 'text-base px-7 py-3 gap-2.5',
    };
    const variantStyles = {
        primary: 'bg-[#D9381E] hover:bg-[#B82A13] text-white shadow-sm focus:ring-[#D9381E]',
        secondary: 'bg-[#FDECE8] hover:bg-[#FFDDD4] text-[#2C1A14] dark:bg-stone-800 dark:text-stone-200 dark:hover:bg-stone-700 focus:ring-stone-400',
        outline: 'border-2 border-[#D9381E] text-[#D9381E] hover:bg-[#D9381E]/10 dark:hover:bg-[#D9381E]/20 focus:ring-[#D9381E]',
        ghost: 'text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 focus:ring-stone-400',
        danger: 'bg-red-600 hover:bg-red-700 text-white shadow-sm focus:ring-red-500',
    };
    return (<button className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`} disabled={disabled || isLoading} {...props}>
        {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
        {children}
    </button>);
};
Button.propTypes = {
    variant: PropTypes.oneOf(['primary', 'secondary', 'outline', 'ghost', 'danger']),
    size: PropTypes.oneOf(['sm', 'md', 'lg']),
    isLoading: PropTypes.bool,
    className: PropTypes.string,
    disabled: PropTypes.bool,
    children: PropTypes.node,
};
