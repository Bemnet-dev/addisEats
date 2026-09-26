import PropTypes from 'prop-types';
export const Badge = ({ variant = 'secondary', size = 'md', children, className = '', }) => {
    const sizeStyles = {
        sm: 'text-[11px] px-2 py-0.5',
        md: 'text-xs px-2.5 py-1',
    };
    const variantStyles = {
        primary: 'bg-[#D9381E]/15 text-[#B82A13] dark:bg-[#D9381E]/30 dark:text-[#FFDDD4]',
        secondary: 'bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300',
        success: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200/50 dark:border-emerald-800/50',
        warning: 'bg-amber-50 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300 border border-amber-200/50 dark:border-amber-800/50',
        danger: 'bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 border border-rose-200/50 dark:border-rose-800/50',
        outline: 'border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300',
    };
    return (<span className={`inline-flex items-center font-semibold rounded-full whitespace-nowrap ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}>
        {children}
    </span>);
};
Badge.propTypes = {
    variant: PropTypes.oneOf(['primary', 'secondary', 'success', 'warning', 'danger', 'outline']),
    size: PropTypes.oneOf(['sm', 'md']),
    className: PropTypes.string,
    children: PropTypes.node,
};
