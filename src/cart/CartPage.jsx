import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from './cartStore';
import { formatCurrency } from '../utils/formatCurrency';
import { ADDIS_DELIVERY_AREAS, getDeliveryFee, getEstimatedDeliveryTime } from '../utils/deliveryEstimate';
import { Button } from '../ui/Button';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, ArrowLeft, MapPin, Clock, MessageSquare, } from 'lucide-react';
export const CartPage = () => {
    const { items, updateQuantity, removeFromCart, clearCart, specialInstructions, updateInstructions, subtotal, totalItemsCount, } = useCart();
    const navigate = useNavigate();
    const [selectedArea, setSelectedArea] = useState(ADDIS_DELIVERY_AREAS[0].name);
    const deliveryFee = items.length > 0 ? getDeliveryFee(selectedArea) : 0;
    const estimatedTime = getEstimatedDeliveryTime(selectedArea);
    const grandTotal = subtotal + deliveryFee;
    if (items.length === 0) {
        return (<div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="bg-white dark:bg-stone-900 rounded-3xl p-10 border border-stone-200/80 dark:border-stone-800 shadow-sm">
          <div className="w-20 h-20 rounded-full bg-[#D9381E]/10 text-[#D9381E] flex items-center justify-center mx-auto mb-4">
            <ShoppingBag className="w-10 h-10"/>
          </div>
          <h2 className="text-2xl font-bold text-stone-900 dark:text-stone-100 font-sans-display">
            Your Cart is Empty
          </h2>
          <p className="text-sm text-stone-500 dark:text-stone-400 mt-2 max-w-sm mx-auto">
            Add dishes from the menu to start your order.
          </p>
          <div className="mt-8">
            <Link to="/menu">
              <Button size="lg">
                Explore Menu <ArrowRight className="w-4 h-4 ml-1.5"/>
              </Button>
            </Link>
          </div>
        </div>
      </div>);
    }
    return (<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#D9381E]">
            Order Review
          </span>
          <h1 className="text-3xl font-extrabold text-stone-900 dark:text-stone-100 font-sans-display">
            Shopping Cart ({totalItemsCount} {totalItemsCount === 1 ? 'item' : 'items'})
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={clearCart} className="text-xs text-rose-600 hover:text-rose-700 dark:text-rose-400 font-semibold inline-flex items-center gap-1 cursor-pointer">
            <Trash2 className="w-3.5 h-3.5"/> Clear All Items
          </button>
          <Link to="/menu" className="text-xs font-bold text-[#D9381E] hover:underline inline-flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5"/> Continue Shopping
          </Link>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200/80 dark:border-stone-800 shadow-sm divide-y divide-stone-100 dark:divide-stone-800 overflow-hidden">
            {items.map(({ dish, quantity, notes }) => (<div key={dish.id} id={`cart-line-${dish.id}`} className="p-5 flex flex-col sm:flex-row items-center justify-between gap-4 transition-colors hover:bg-stone-50/50 dark:hover:bg-stone-800/30">
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <div className="w-20 h-20 rounded-2xl overflow-hidden bg-stone-100 shrink-0 border border-stone-200 dark:border-stone-700">
                    <img src={dish.image} alt={dish.name} className="w-full h-full object-cover" referrerPolicy="no-referrer"/>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#D9381E]">
                      {dish.category}
                    </span>
                    <Link to={`/menu/${dish.id}`} className="block text-base font-bold text-stone-900 dark:text-stone-100 hover:text-[#D9381E] transition-colors line-clamp-1">
                      {dish.name}
                    </Link>
                    <div className="text-xs text-stone-500 dark:text-stone-400 font-semibold mt-0.5">
                      {formatCurrency(dish.price)} each
                    </div>
                    {notes && (<p className="text-[11px] text-stone-500 italic mt-1 bg-stone-100 dark:bg-stone-800 px-2 py-0.5 rounded-md inline-block">
                        Note: {notes}
                      </p>)}
                  </div>
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                  <div className="flex items-center bg-stone-100 dark:bg-stone-800 rounded-full p-1 border border-stone-200 dark:border-stone-700">
                    <button onClick={() => updateQuantity(dish.id, -1)} className="w-7 h-7 rounded-full bg-white dark:bg-stone-700 flex items-center justify-center text-stone-700 dark:text-stone-200 hover:bg-stone-200 transition-colors cursor-pointer" aria-label="Decrease quantity">
                      <Minus className="w-3.5 h-3.5"/>
                    </button>
                    <span className="w-9 text-center text-xs font-bold text-stone-800 dark:text-stone-100">
                      {quantity}
                    </span>
                    <button onClick={() => updateQuantity(dish.id, 1)} className="w-7 h-7 rounded-full bg-white dark:bg-stone-700 flex items-center justify-center text-stone-700 dark:text-stone-200 hover:bg-stone-200 transition-colors cursor-pointer" aria-label="Increase quantity">
                      <Plus className="w-3.5 h-3.5"/>
                    </button>
                  </div>
                  <div className="text-right min-w-[90px]">
                    <div className="text-sm font-extrabold text-stone-900 dark:text-stone-100">
                      {formatCurrency(dish.price * quantity)}
                    </div>
                  </div>
                  <button onClick={() => removeFromCart(dish.id)} className="p-2 text-stone-400 hover:text-rose-500 transition-colors cursor-pointer" aria-label={`Remove ${dish.name} from cart`} title="Remove item">
                    <Trash2 className="w-4 h-4"/>
                  </button>
                </div>
              </div>))}
          </div>
          <div className="bg-white dark:bg-stone-900 rounded-3xl p-5 border border-stone-200/80 dark:border-stone-800 shadow-sm">
            <label htmlFor="cart-special-instructions" className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-2">
              <MessageSquare className="w-4 h-4 text-[#D9381E]"/>
              Special Delivery Instructions / Kitchen Notes
            </label>
            <textarea id="cart-special-instructions" rows={2} placeholder="e.g. Please send extra awaze, ring the bell twice, gate code is 1234..." value={specialInstructions} onChange={(e) => updateInstructions(e.target.value)} className="w-full text-xs p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-[#D9381E] resize-none"/>
          </div>
        </div>
        <div className="lg:col-span-4">
          <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200/80 dark:border-stone-800 shadow-xl p-6 sticky top-24 space-y-6">
            <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100 font-sans-display pb-3 border-b border-stone-100 dark:border-stone-800">
              Order Summary
            </h3>
            <div>
              <label htmlFor="cart-delivery-area" className="block text-xs font-bold uppercase tracking-wider text-stone-600 dark:text-stone-300 mb-1.5 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#D9381E]"/>
                Select Delivery Subcity
              </label>
              <select id="cart-delivery-area" value={selectedArea} onChange={(e) => setSelectedArea(e.target.value)} className="w-full text-xs p-3 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-[#D9381E] cursor-pointer">
                {ADDIS_DELIVERY_AREAS.map((area) => (<option key={area.id} value={area.name}>
                    {area.name} (+{area.fee} ETB)
                  </option>))}
              </select>
              <div className="mt-2.5 flex items-center gap-1.5 text-xs text-stone-500 dark:text-stone-400 bg-stone-50 dark:bg-stone-800/60 px-3 py-1.5 rounded-xl border border-stone-200/50 dark:border-stone-700/50">
                <Clock className="w-3.5 h-3.5 text-[#D9381E]"/>
                <span>Estimated Arrival: <strong className="text-stone-800 dark:text-stone-200">{estimatedTime}</strong></span>
              </div>
            </div>
            <div className="space-y-2.5 pt-3 border-t border-stone-100 dark:border-stone-800 text-xs">
              <div className="flex justify-between text-stone-600 dark:text-stone-400">
                <span>Items Subtotal</span>
                <span className="font-semibold text-stone-900 dark:text-stone-100">
                  {formatCurrency(subtotal)}
                </span>
              </div>
              <div className="flex justify-between text-stone-600 dark:text-stone-400">
                <span>Delivery Fee ({selectedArea.split(' ')[0]})</span>
                <span className="font-semibold text-stone-900 dark:text-stone-100">
                  {formatCurrency(deliveryFee)}
                </span>
              </div>
              <div className="pt-3 border-t border-dashed border-stone-200 dark:border-stone-700 flex justify-between items-baseline">
                <span className="text-sm font-bold text-stone-900 dark:text-stone-100">
                  Total (ETB)
                </span>
                <span className="text-xl font-extrabold text-[#D9381E] dark:text-[#FFA085]">
                  {formatCurrency(grandTotal)}
                </span>
              </div>
            </div>
            <Button onClick={() => navigate('/checkout')} size="lg" className="w-full shadow-md">
              Proceed to Checkout <ArrowRight className="w-4 h-4 ml-1.5"/>
            </Button>
            <p className="text-[11px] text-center text-stone-400">
              Safe & fast delivery across Addis Ababa. Payment via Cash or Telebirr upon receipt.
            </p>
          </div>
        </div>
      </div>
    </div>);
};
