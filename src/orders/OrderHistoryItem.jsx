import { useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { formatCurrency } from '../utils/formatCurrency';
import { useCart } from '../cart/cartStore';
import { fetchDishes } from '../api/dishes';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { RotateCcw, Clock, Calendar, MapPin, CheckCircle2, Bike, ChefHat, ClipboardCheck, } from 'lucide-react';
export const OrderHistoryItem = ({ order }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [reordering, setReordering] = useState(false);
  const statusBadgeMap = {
    pending: { label: 'Pending Confirmation', variant: 'warning' },
    preparing: { label: 'In Kitchen (Preparing)', variant: 'primary' },
    delivering: { label: 'Rider Out for Delivery', variant: 'warning' },
    delivered: { label: 'Delivered', variant: 'success' },
  };
  const handleReorder = async () => {
    setReordering(true);
    try {
      const allDishes = await fetchDishes();
      for (const item of order.items) {
        const fullDish = allDishes.find((d) => d.id === item.dishId) || {
          id: item.dishId,
          name: item.dishName,
          category: 'Ethiopian',
          price: item.price,
          description: 'Special dish from past order',
          image: item.image,
          rating: 4.8,
          prepTime: '20 min',
          ingredients: [],
          available: true,
        };
        addToCart(fullDish, item.quantity);
      }
      navigate('/cart');
    }
    catch (err) {
      console.error('Failed to reorder', err);
    }
    finally {
      setReordering(false);
    }
  };
  const formattedDate = new Date(order.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
  const stepIndex = order.status === 'pending'
    ? 0
    : order.status === 'preparing'
      ? 1
      : order.status === 'delivering'
        ? 2
        : 3;
  return (<div id={`order-${order.id}`} className="bg-white dark:bg-stone-900 rounded-3xl p-6 border border-stone-200/80 dark:border-stone-800 shadow-sm space-y-4">
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-100 dark:border-stone-800">
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-base font-extrabold text-stone-900 dark:text-stone-100">
            Order #{order.orderNumber}
          </span>
          <Badge variant={statusBadgeMap[order.status].variant} size="sm">
            {statusBadgeMap[order.status].label}
          </Badge>
        </div>
        <div className="flex items-center gap-2 text-xs text-stone-400 mt-1">
          <Calendar className="w-3.5 h-3.5" />
          <span>{formattedDate}</span>
        </div>
      </div>
      <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
        <Button onClick={handleReorder} variant="outline" size="sm" isLoading={reordering} className="text-xs">
          <RotateCcw className="w-3.5 h-3.5 mr-1" /> Reorder
        </Button>
      </div>
    </div>
    <div className="bg-stone-50 dark:bg-stone-800/40 p-3 rounded-2xl border border-stone-100 dark:border-stone-800">
      <div className="flex items-center justify-between text-[11px] font-semibold text-stone-500 dark:text-stone-400 mb-1.5">
        <span className="flex items-center gap-1">
          <ClipboardCheck className={`w-3 h-3 ${stepIndex >= 0 ? 'text-[#D9381E]' : ''}`} />
          Confirmed
        </span>
        <span className="flex items-center gap-1">
          <ChefHat className={`w-3 h-3 ${stepIndex >= 1 ? 'text-[#D9381E]' : ''}`} />
          Kitchen
        </span>
        <span className="flex items-center gap-1">
          <Bike className={`w-3 h-3 ${stepIndex >= 2 ? 'text-[#D9381E]' : ''}`} />
          En Route
        </span>
        <span className="flex items-center gap-1">
          <CheckCircle2 className={`w-3 h-3 ${stepIndex >= 3 ? 'text-emerald-500' : ''}`} />
          Delivered
        </span>
      </div>
      <div className="w-full bg-stone-200 dark:bg-stone-700 h-1.5 rounded-full overflow-hidden">
        <div className="bg-[#D9381E] h-full rounded-full transition-all duration-500" style={{
          width: stepIndex === 0
            ? '15%'
            : stepIndex === 1
              ? '45%'
              : stepIndex === 2
                ? '75%'
                : '100%',
        }} />
      </div>
    </div>
    <div className="space-y-3">
      {order.items.map((item, idx) => (<div key={idx} className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl overflow-hidden bg-stone-100 shrink-0 border border-stone-200 dark:border-stone-700">
            <img src={item.image} alt={item.dishName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          </div>
          <div>
            <span className="font-bold text-stone-900 dark:text-stone-100">
              {item.dishName}
            </span>
            <span className="text-stone-400 block">
              Qty: {item.quantity} × {formatCurrency(item.price)}
            </span>
          </div>
        </div>
        <span className="font-bold text-stone-800 dark:text-stone-200">
          {formatCurrency(item.price * item.quantity)}
        </span>
      </div>))}
    </div>
    <div className="pt-4 border-t border-stone-100 dark:border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
      <div className="space-y-1 text-stone-500 dark:text-stone-400">
        <div className="flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-[#D9381E]" />
          <span>Delivered to: <strong>{order.customer.area}</strong> ({order.customer.address})</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-[#D9381E]" />
          <span>Payment: <strong>{order.paymentMethod}</strong></span>
        </div>
      </div>
      <div className="text-right sm:text-right">
        <span className="text-[11px] text-stone-400 block">Total (incl. delivery)</span>
        <span className="text-base font-extrabold text-[#D9381E] dark:text-[#FFA085]">
          {formatCurrency(order.total)}
        </span>
      </div>
    </div>
  </div>);
};
OrderHistoryItem.propTypes = {
  order: PropTypes.shape({
    id: PropTypes.string.isRequired,
    orderNumber: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    status: PropTypes.oneOf(['pending', 'preparing', 'delivering', 'delivered']).isRequired,
    createdAt: PropTypes.string.isRequired,
    customer: PropTypes.shape({
      area: PropTypes.string,
      address: PropTypes.string,
    }),
    paymentMethod: PropTypes.string,
    total: PropTypes.number.isRequired,
    items: PropTypes.arrayOf(PropTypes.shape({
      dishId: PropTypes.string,
      dishName: PropTypes.string,
      price: PropTypes.number,
      quantity: PropTypes.number,
      image: PropTypes.string,
    })).isRequired,
  }).isRequired,
};
