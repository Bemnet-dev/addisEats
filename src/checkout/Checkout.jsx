import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { useCart } from '../cart/cartStore';
import { addOrder } from '../orders/orderHistoryStore';
import { ADDIS_DELIVERY_AREAS, getDeliveryFee, getEstimatedDeliveryTime } from '../utils/deliveryEstimate';
import { formatCurrency } from '../utils/formatCurrency';
import { validateCheckoutForm } from './validate';
import { Field } from './Field';
import { DeliveryEstimate } from './DeliveryEstimate';
import { Button } from '../ui/Button';
import confetti from 'canvas-confetti';
import { CheckCircle2, ArrowLeft, Bike, CreditCard, Banknote, Smartphone, ShoppingBag, MapPin, ShieldCheck, } from 'lucide-react';
export const Checkout = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { items, subtotal, specialInstructions, clearCart } = useCart();
  const [formValues, setFormValues] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    area: user?.area || ADDIS_DELIVERY_AREAS[0].name,
    address: user?.address || '',
    paymentMethod: 'Telebirr',
    specialInstructions: specialInstructions || '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState(null);
  const deliveryFee = getDeliveryFee(formValues.area);
  const estimatedTime = getEstimatedDeliveryTime(formValues.area);
  const grandTotal = subtotal + deliveryFee;
  if (items.length === 0 && !confirmedOrder) {
    return (<div className="max-w-xl mx-auto my-16 p-8 text-center bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-sm">
      <ShoppingBag className="w-12 h-12 text-stone-400 mx-auto mb-3" />
      <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100 mb-2">
        Your Cart is Empty
      </h2>
      <p className="text-xs text-stone-500 mb-6">
        You don't have any items to checkout yet.
      </p>
      <Button onClick={() => navigate('/menu')}>Explore Menu</Button>
    </div>);
  }
  if (confirmedOrder) {
    return (<div className="max-w-3xl mx-auto px-4 py-12">
      <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200/80 dark:border-stone-800 shadow-2xl p-8 sm:p-12 text-center animate-in zoom-in-95 duration-300">
        <div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center mx-auto mb-6 shadow-sm">
          <CheckCircle2 className="w-12 h-12" />
        </div>
        <span className="text-xs font-bold uppercase tracking-widest text-[#D9381E] bg-[#D9381E]/10 px-3.5 py-1 rounded-full inline-block mb-3">
          Order Successfully Placed!
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900 dark:text-stone-100 font-sans-display mb-2">
          Your Order is Confirmed!
        </h1>
        <p className="text-stone-600 dark:text-stone-300 text-sm max-w-md mx-auto mb-8">
          Your food is now being prepared with fresh authentic spices. Our courier will contact you upon arrival.
        </p>
        <div className="bg-stone-50 dark:bg-stone-800/60 rounded-2xl p-6 border border-stone-200/60 dark:border-stone-700 text-left max-w-lg mx-auto mb-8 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-stone-700">
            <div>
              <span className="text-[11px] font-bold text-stone-400 uppercase">Order Number</span>
              <p className="text-lg font-black text-[#D9381E]">{confirmedOrder.orderNumber}</p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
              Status: Preparing
            </span>
          </div>
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-stone-400 block mb-0.5">Delivery Destination</span>
              <span className="font-semibold text-stone-800 dark:text-stone-200 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-[#D9381E]" /> {confirmedOrder.customer.area}
              </span>
              <span className="text-[11px] text-stone-500 block truncate">{confirmedOrder.customer.address}</span>
            </div>
            <div>
              <span className="text-stone-400 block mb-0.5">Estimated Delivery Time</span>
              <span className="font-semibold text-stone-800 dark:text-stone-200 flex items-center gap-1">
                <Bike className="w-3.5 h-3.5 text-[#D9381E]" /> {confirmedOrder.estimatedDeliveryTime}
              </span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 text-xs pt-2 border-t border-stone-200 dark:border-stone-700">
            <div>
              <span className="text-stone-400 block mb-0.5">Contact Recipient</span>
              <span className="font-semibold text-stone-800 dark:text-stone-200">
                {confirmedOrder.customer.name} ({confirmedOrder.customer.phone})
              </span>
            </div>
            <div>
              <span className="text-stone-400 block mb-0.5">Payment Method</span>
              <span className="font-semibold text-stone-800 dark:text-stone-200">
                {confirmedOrder.paymentMethod}
              </span>
            </div>
          </div>
          <div className="pt-3 border-t border-dashed border-stone-200 dark:border-stone-700 flex justify-between items-center text-sm font-bold">
            <span>Total Paid / Due</span>
            <span className="text-[#D9381E] text-lg font-extrabold">{formatCurrency(confirmedOrder.total)}</span>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/menu">
            <Button size="lg" className="w-full sm:w-auto">
              Explore More Dishes
            </Button>
          </Link>
        </div>
      </div>
    </div>);
  }
  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateCheckoutForm(formValues);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    setIsSubmitting(true);
    setTimeout(() => {
      const newOrder = addOrder({
        customer: {
          id: user?.id,
          name: formValues.name,
          phone: formValues.phone,
          area: formValues.area,
          address: formValues.address,
        },
        items: items.map((item) => ({
          dishId: item.dish.id,
          dishName: item.dish.name,
          price: item.dish.price,
          quantity: item.quantity,
          image: item.dish.image,
        })),
        subtotal,
        deliveryFee,
        total: grandTotal,
        status: 'preparing',
        estimatedDeliveryTime: estimatedTime,
        specialInstructions: formValues.specialInstructions || undefined,
        paymentMethod: formValues.paymentMethod,
      });
      clearCart();
      setIsSubmitting(false);
      setConfirmedOrder(newOrder);
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#D9381E', '#009B4D', '#FED100', '#D21034'],
        });
      }
      catch {
        void 0;
      }
    }, 600);
  };
  return (<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div className="mb-8">
      <Link to="/cart" className="inline-flex items-center text-xs font-semibold text-stone-500 hover:text-[#D9381E] mb-2">
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Cart
      </Link>
      <h1 className="text-3xl font-extrabold text-stone-900 dark:text-stone-100 font-sans-display">
        Finalize Your Order
      </h1>
      <p className="text-xs text-stone-500">
        Verified delivery to your doorstep in Addis Ababa.
      </p>
    </div>
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 border border-stone-200/80 dark:border-stone-800 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-stone-900 dark:text-stone-100 pb-2 border-b border-stone-100 dark:border-stone-800 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#D9381E]" />
              1. Delivery Details
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field id="checkout-name" label="Full Name *" placeholder="e.g. Almaz Ayana" value={formValues.name} onChange={(e) => setFormValues({ ...formValues, name: e.target.value })} error={errors.name} required />
              <Field id="checkout-phone" label="Phone Number (Ethiopia) *" placeholder="+251 91 123 4567 or 0911234567" value={formValues.phone} onChange={(e) => setFormValues({ ...formValues, phone: e.target.value })} error={errors.phone} helperText="Required for delivery rider contact" required />
            </div>
            <div>
              <label htmlFor="checkout-area" className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1">
                Delivery Subcity (Addis Ababa) *
              </label>
              <select id="checkout-area" value={formValues.area} onChange={(e) => setFormValues({ ...formValues, area: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-sm focus:outline-none focus:ring-2 focus:ring-[#D9381E] cursor-pointer">
                {ADDIS_DELIVERY_AREAS.map((area) => (<option key={area.id} value={area.name}>
                  {area.name} — {formatCurrency(area.fee)} ({area.minMinutes}-{area.maxMinutes} mins)
                </option>))}
              </select>
              {errors.area && (<p className="text-xs text-rose-600 mt-1">{errors.area}</p>)}
            </div>
            <Field id="checkout-address" label="Street Address / Building / Landmark *" placeholder="e.g. Bole Medhanialem next to Edna Mall, 3rd Floor Apt 12" value={formValues.address} onChange={(e) => setFormValues({ ...formValues, address: e.target.value })} error={errors.address} required />
            <DeliveryEstimate area={formValues.area} />
          </div>
          <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 border border-stone-200/80 dark:border-stone-800 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-stone-900 dark:text-stone-100 pb-2 border-b border-stone-100 dark:border-stone-800 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-[#D9381E]" />
              2. Payment Method
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                {
                  id: 'Telebirr',
                  name: 'Telebirr',
                  desc: 'Instant mobile wallet',
                  icon: Smartphone,
                },
                {
                  id: 'Cash on Delivery',
                  name: 'Cash on Delivery',
                  desc: 'Pay cash to rider',
                  icon: Banknote,
                },
                {
                  id: 'CBE Birr',
                  name: 'CBE Birr',
                  desc: 'Commercial Bank of Ethiopia',
                  icon: CreditCard,
                },
              ].map((pm) => {
                const Icon = pm.icon;
                const isSelected = formValues.paymentMethod === pm.id;
                return (<label key={pm.id} className={`flex flex-col p-4 rounded-2xl border-2 cursor-pointer transition-all ${isSelected
                  ? 'border-[#D9381E] bg-[#D9381E]/5 dark:bg-[#D9381E]/10'
                  : 'border-stone-200 dark:border-stone-700 hover:border-stone-300'}`}>
                  <input type="radio" name="paymentMethod" value={pm.id} checked={isSelected} onChange={() => setFormValues({
                    ...formValues,
                    paymentMethod: pm.id,
                  })} className="sr-only" />
                  <div className="flex items-center gap-2 mb-1">
                    <Icon className={`w-4 h-4 ${isSelected ? 'text-[#D9381E]' : 'text-stone-400'}`} />
                    <span className="font-bold text-xs text-stone-900 dark:text-stone-100">
                      {pm.name}
                    </span>
                  </div>
                  <span className="text-[11px] text-stone-500">{pm.desc}</span>
                </label>);
              })}
            </div>
          </div>
          <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 border border-stone-200/80 dark:border-stone-800 shadow-sm">
            <label htmlFor="checkout-special-instructions" className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-2">
              Special Kitchen or Delivery Instructions
            </label>
            <textarea id="checkout-special-instructions" rows={2} placeholder="e.g. Please include extra paper napkins and awaze dip..." value={formValues.specialInstructions} onChange={(e) => setFormValues({ ...formValues, specialInstructions: e.target.value })} className="w-full text-xs p-3 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-[#D9381E] resize-none" />
          </div>
        </div>
        <div className="lg:col-span-4">
          <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200/80 dark:border-stone-800 shadow-xl p-6 sticky top-24 space-y-6">
            <h3 className="text-base font-bold text-stone-900 dark:text-stone-100 pb-3 border-b border-stone-100 dark:border-stone-800">
              Order Review ({items.length} dishes)
            </h3>
            <div className="max-h-60 overflow-y-auto space-y-3 pr-1">
              {items.map((item) => (<div key={item.dish.id} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 truncate pr-2">
                  <span className="font-bold text-[#D9381E]">{item.quantity}x</span>
                  <span className="truncate text-stone-800 dark:text-stone-200 font-medium">
                    {item.dish.name}
                  </span>
                </div>
                <span className="font-bold text-stone-900 dark:text-stone-100 shrink-0">
                  {formatCurrency(item.dish.price * item.quantity)}
                </span>
              </div>))}
            </div>
            <div className="space-y-2 pt-3 border-t border-stone-100 dark:border-stone-800 text-xs">
              <div className="flex justify-between text-stone-500">
                <span>Subtotal</span>
                <span className="font-semibold text-stone-800 dark:text-stone-200">
                  {formatCurrency(subtotal)}
                </span>
              </div>
              <div className="flex justify-between text-stone-500">
                <span>Delivery ({formValues.area.split(' ')[0]})</span>
                <span className="font-semibold text-stone-800 dark:text-stone-200">
                  {formatCurrency(deliveryFee)}
                </span>
              </div>
              <div className="pt-3 border-t border-dashed border-stone-200 dark:border-stone-700 flex justify-between items-baseline">
                <span className="text-sm font-bold text-stone-900 dark:text-stone-100">
                  Grand Total
                </span>
                <span className="text-xl font-black text-[#D9381E] dark:text-[#FFA085]">
                  {formatCurrency(grandTotal)}
                </span>
              </div>
            </div>
            <Button type="submit" size="lg" className="w-full shadow-lg" isLoading={isSubmitting}>
              Place Order Now · {formatCurrency(grandTotal)}
            </Button>
            <div className="text-[11px] text-stone-500 dark:text-stone-400 space-y-1 text-center">
              <p className="flex items-center justify-center gap-1.5 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Quality guaranteed on every delivery</span>
              </p>
              <p>Packed and sealed while still hot</p>
            </div>
          </div>
        </div>
      </div>
    </form>
  </div>);
};
