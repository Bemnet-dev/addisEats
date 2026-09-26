import PropTypes from 'prop-types';
import { ShoppingBag } from 'lucide-react';
import { useCart } from './cartStore';
import { Link } from 'react-router-dom';
export const CartBadge = ({ className = '' }) => {
    const { totalItemsCount } = useCart();
    return (<Link to="/cart" id="cart-badge-button" className={`relative p-2.5 rounded-full bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-100 shadow-sm border border-stone-200/80 dark:border-stone-700 hover:border-[#D9381E] transition-colors focus:outline-none focus:ring-2 focus:ring-[#D9381E] ${className}`} aria-label={`Shopping cart with ${totalItemsCount} items`} title="View shopping cart">
      <ShoppingBag className="w-5 h-5 text-[#D9381E]"/>
      {totalItemsCount > 0 && (<span id="cart-badge-count" className="absolute -top-1 -right-1 bg-[#D9381E] text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-sm animate-in zoom-in">
          {totalItemsCount > 99 ? '99+' : totalItemsCount}
        </span>)}
    </Link>);
};
CartBadge.propTypes = {
    className: PropTypes.string,
};
