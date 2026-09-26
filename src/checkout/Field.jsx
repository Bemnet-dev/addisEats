import PropTypes from 'prop-types';
export const Field = ({ label, error, helperText, id, className = '', ...props }) => {
  return (<div className="space-y-1">
    <label htmlFor={id} className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300">
      {label}
    </label>
    <input id={id} className={`w-full px-4 py-2.5 rounded-xl border bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-sm transition-colors focus:outline-none focus:ring-2 ${error
      ? 'border-rose-400 focus:ring-rose-400 bg-rose-50/30'
      : 'border-stone-200 dark:border-stone-700 focus:ring-[#D9381E]'} ${className}`} aria-invalid={!!error} aria-describedby={error ? `${id}-error` : undefined} {...props} />
    {error ? (<p id={`${id}-error`} className="text-xs text-rose-600 dark:text-rose-400 font-medium">
      {error}
    </p>) : helperText ? (<p className="text-[11px] text-stone-400">{helperText}</p>) : null}
  </div>);
};
Field.propTypes = {
  label: PropTypes.string.isRequired,
  error: PropTypes.string,
  helperText: PropTypes.string,
  id: PropTypes.string.isRequired,
  className: PropTypes.string,
};
