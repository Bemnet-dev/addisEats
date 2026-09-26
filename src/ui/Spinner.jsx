import PropTypes from 'prop-types';
export const Spinner = ({ size = 'md', className = '', label = 'Loading...', }) => {
    const sizeMap = {
        sm: 'w-5 h-5 border-2',
        md: 'w-8 h-8 border-3',
        lg: 'w-12 h-12 border-4',
    };
    return (<div className={`flex flex-col items-center justify-center p-6 ${className}`} role="status" aria-label={label}>
        <div className={`${sizeMap[size]} border-stone-200 border-t-[#D9381E] rounded-full animate-spin`} />
        {label && <p className="mt-3 text-sm text-stone-500 font-medium">{label}</p>}
    </div>);
};
Spinner.propTypes = {
    size: PropTypes.oneOf(['sm', 'md', 'lg']),
    className: PropTypes.string,
    label: PropTypes.string,
};
