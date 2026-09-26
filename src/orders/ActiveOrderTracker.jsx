import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useOrders } from './orderHistoryStore';
import { formatCurrency } from '../utils/formatCurrency';
import { Button } from '../ui/Button';
import { MapPin, Bike, ChefHat, ClipboardCheck, CheckCircle2, Phone, Radio, FastForward, RotateCcw, Sparkles, } from 'lucide-react';
const STEPS = [
    {
        status: 'pending',
        label: 'Order Confirmed',
        subLabel: 'Ticket received by restaurant',
        timeEstimate: '0 - 5 min',
        icon: ClipboardCheck,
    },
    {
        status: 'preparing',
        label: 'In Kitchen',
        subLabel: 'Freshly cooking & packaging',
        timeEstimate: '10 - 15 min',
        icon: ChefHat,
    },
    {
        status: 'delivering',
        label: 'Out for Delivery',
        subLabel: 'Rider en route to your address',
        timeEstimate: '15 - 25 min',
        icon: Bike,
    },
    {
        status: 'delivered',
        label: 'Delivered',
        subLabel: 'Arrived at your location',
        timeEstimate: 'Completed',
        icon: CheckCircle2,
    },
];
const STATUS_PROGRESS_MAP = {
    pending: 12,
    preparing: 45,
    delivering: 78,
    delivered: 100,
};
const STATUS_INDEX_MAP = {
    pending: 0,
    preparing: 1,
    delivering: 2,
    delivered: 3,
};
export const ActiveOrderTracker = ({ order, onSelectOrder, availableActiveOrders = [], }) => {
    const { updateOrderStatus } = useOrders();
    const [lastUpdated, setLastUpdated] = useState('Just now');
    const [isSimulating, setIsSimulating] = useState(false);
    const currentStepIndex = STATUS_INDEX_MAP[order.status] ?? 0;
    const progressPercent = STATUS_PROGRESS_MAP[order.status] ?? 12;
    useEffect(() => {
        const timer = setInterval(() => {
            setLastUpdated('Just now');
        }, 10000);
        return () => clearInterval(timer);
    }, []);
    const handleAdvanceStatus = () => {
        setIsSimulating(true);
        const orderFlow = ['pending', 'preparing', 'delivering', 'delivered'];
        const nextIndex = (currentStepIndex + 1) % orderFlow.length;
        const nextStatus = orderFlow[nextIndex];
        updateOrderStatus(order.id, nextStatus);
        setTimeout(() => setIsSimulating(false), 400);
    };
    const handleResetToPending = () => {
        updateOrderStatus(order.id, 'pending');
    };
    return (<div id="active-order-tracking-card" className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 border-2 border-[#D9381E]/30 dark:border-[#D9381E]/40 shadow-xl shadow-[#D9381E]/5 space-y-6 transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-stone-100 dark:border-stone-800">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-[#D9381E]/10 dark:bg-[#D9381E]/20 text-[#D9381E] flex items-center justify-center shrink-0">
            <Radio className="w-5 h-5 animate-pulse"/>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-0.5 rounded-full flex items-center gap-1.5 border border-emerald-200 dark:border-emerald-800">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"/>
                Live Tracking Active
              </span>
              <span className="text-xs text-stone-400 font-medium">
                • {lastUpdated}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-stone-100 tracking-tight mt-0.5 font-sans-display">
              Order #{order.orderNumber}
            </h2>
          </div>
        </div>
        {availableActiveOrders.length > 1 && onSelectOrder && (<div className="flex items-center gap-2 bg-stone-100 dark:bg-stone-800 p-1 rounded-xl self-start sm:self-auto">
            <span className="text-[11px] font-bold text-stone-500 dark:text-stone-400 px-2">
              Tracking:
            </span>
            {availableActiveOrders.map((activeOrd) => (<button key={activeOrd.id} type="button" onClick={() => onSelectOrder(activeOrd.id)} className={`text-xs font-bold px-2.5 py-1 rounded-lg transition-colors ${activeOrd.id === order.id
                    ? 'bg-[#D9381E] text-white shadow-xs'
                    : 'text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white'}`}>
                #{activeOrd.orderNumber}
              </button>))}
          </div>)}
      </div>
      <div className="p-4 rounded-2xl bg-[#FAF6F0] dark:bg-stone-800/60 border border-stone-200/80 dark:border-stone-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start sm:items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
            {order.status === 'pending' && <ClipboardCheck className="w-5 h-5"/>}
            {order.status === 'preparing' && <ChefHat className="w-5 h-5"/>}
            {order.status === 'delivering' && <Bike className="w-5 h-5"/>}
            {order.status === 'delivered' && <CheckCircle2 className="w-5 h-5 text-emerald-600"/>}
          </div>
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#D9381E] dark:text-[#FFA085] block">
              Current Stage
            </span>
            <p className="text-sm sm:text-base font-bold text-stone-900 dark:text-stone-100">
              {order.status === 'pending' && 'Order received! Kitchen is preparing to accept ticket.'}
              {order.status === 'preparing' && 'Our Addis kitchen is cooking and packaging your order.'}
              {order.status === 'delivering' && 'Courier is on the road! Your food is on its way.'}
              {order.status === 'delivered' && 'Order delivered! We hope you enjoy your delicious meal.'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0 self-start sm:self-center">
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-stone-400 block tracking-wider">
              Est. Arrival
            </span>
            <span className="text-sm font-extrabold text-[#D9381E] dark:text-[#FFA085]">
              {order.status === 'delivered' ? 'Completed' : order.estimatedDeliveryTime}
            </span>
          </div>
        </div>
      </div>
      <div className="py-3 px-1 sm:px-3">
        <div className="flex items-center justify-between text-xs font-bold text-stone-500 dark:text-stone-400 mb-2">
          <span>Delivery Progress</span>
          <span className="text-[#D9381E] dark:text-[#FFA085] font-extrabold">
            {progressPercent}% Complete
          </span>
        </div>
        <div className="relative w-full h-2.5 bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden mb-6">
          <div className="h-full bg-linear-to-r from-[#D9381E] via-[#F59E0B] to-[#D9381E] rounded-full transition-all duration-700 ease-out" style={{ width: `${progressPercent}%` }}/>
        </div>
        <div className="grid grid-cols-4 gap-2 relative">
          {STEPS.map((step, idx) => {
            const isCompleted = currentStepIndex > idx;
            const isCurrent = currentStepIndex === idx;
            const StepIcon = step.icon;
            return (<div key={step.status} className="flex flex-col items-center text-center group">
                <div className="relative mb-2">
                  {isCurrent && (<span className="absolute -inset-1 rounded-full bg-[#D9381E]/20 dark:bg-[#D9381E]/40 animate-ping"/>)}
                  <div className={`w-9 h-9 sm:w-11 sm:h-11 rounded-full flex items-center justify-center transition-all duration-300 relative z-10 ${isCompleted
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                    : isCurrent
                        ? 'bg-[#D9381E] text-white shadow-lg shadow-[#D9381E]/30 ring-4 ring-[#D9381E]/20'
                        : 'bg-stone-100 dark:bg-stone-800 text-stone-400 border border-stone-200 dark:border-stone-700'}`}>
                    {isCompleted ? (<CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6"/>) : (<StepIcon className="w-4 h-4 sm:w-5 sm:h-5"/>)}
                  </div>
                </div>
                <div className="space-y-0.5 max-w-[120px]">
                  <span className={`block text-xs font-bold leading-tight ${isCurrent
                    ? 'text-[#D9381E] dark:text-[#FFA085]'
                    : isCompleted
                        ? 'text-stone-800 dark:text-stone-200'
                        : 'text-stone-400 dark:text-stone-500'}`}>
                    {step.label}
                  </span>
                  <span className="hidden sm:block text-[11px] text-stone-400 dark:text-stone-500 leading-snug">
                    {step.subLabel}
                  </span>
                </div>
              </div>);
        })}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-stone-100 dark:border-stone-800 text-xs">
        <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200/60 dark:border-stone-700/60 space-y-1.5">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-stone-400 block">
            Destination Address
          </span>
          <div className="flex items-start gap-2 text-stone-800 dark:text-stone-200 font-semibold">
            <MapPin className="w-4 h-4 text-[#D9381E] shrink-0 mt-0.5"/>
            <div>
              <p className="font-bold text-stone-900 dark:text-stone-100">
                {order.customer.area}
              </p>
              <p className="text-stone-500 dark:text-stone-400 font-normal">
                {order.customer.address || 'Address registered on checkout'}
              </p>
            </div>
          </div>
          {order.specialInstructions && (<p className="text-[11px] text-stone-500 dark:text-stone-400 italic pt-1 border-t border-stone-200/50 dark:border-stone-700/50">
              Note: &quot;{order.specialInstructions}&quot;
            </p>)}
        </div>
        <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200/60 dark:border-stone-700/60 space-y-1.5">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-stone-400 block">
            Assigned Courier
          </span>
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#D9381E] text-white flex items-center justify-center font-bold text-xs">
                AB
              </div>
              <div>
                <p className="font-bold text-stone-900 dark:text-stone-100">
                  Abebe T. (Addis Express)
                </p>
                <p className="text-stone-400 text-[11px]">
                  Motorbike Dispatch • Bole Route
                </p>
              </div>
            </div>
            <a href="tel:+251911234567" className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-bold text-[11px] hover:bg-emerald-100 transition-colors">
              <Phone className="w-3 h-3"/> Call
            </a>
          </div>
          <div className="flex items-center justify-between text-[11px] text-stone-500 dark:text-stone-400 pt-1 border-t border-stone-200/50 dark:border-stone-700/50">
            <span>Payment: <strong>{order.paymentMethod}</strong></span>
            <span>Total: <strong className="text-[#D9381E]">{formatCurrency(order.total)}</strong></span>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-dashed border-stone-200 dark:border-stone-800 text-xs">
        <div className="flex items-center gap-2 text-stone-500 dark:text-stone-400">
          <Sparkles className="w-3.5 h-3.5 text-[#D9381E]"/>
          <span>Real-time status updates automatically sync with the restaurant dashboard.</span>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" onClick={handleAdvanceStatus} isLoading={isSimulating} className="text-xs" title="Advance status to test real-time progress bar stages">
            <FastForward className="w-3.5 h-3.5 mr-1"/>
            {order.status === 'delivered' ? 'Restart Status Cycle' : 'Simulate Next Stage'}
          </Button>
          {order.status !== 'pending' && (<button type="button" onClick={handleResetToPending} className="text-[11px] text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 flex items-center gap-1 px-2 py-1" title="Reset order to pending">
              <RotateCcw className="w-3 h-3"/> Reset
            </button>)}
        </div>
      </div>
    </div>);
};
ActiveOrderTracker.propTypes = {
    order: PropTypes.shape({
        id: PropTypes.string.isRequired,
        orderNumber: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        status: PropTypes.oneOf(['pending', 'preparing', 'delivering', 'delivered']).isRequired,
        createdAt: PropTypes.string,
        estimatedDeliveryTime: PropTypes.string,
        customer: PropTypes.shape({
            name: PropTypes.string,
            phone: PropTypes.string,
            area: PropTypes.string,
            address: PropTypes.string,
        }),
        specialInstructions: PropTypes.string,
        paymentMethod: PropTypes.string,
        total: PropTypes.number,
        items: PropTypes.arrayOf(PropTypes.object),
    }).isRequired,
    onSelectOrder: PropTypes.func,
    availableActiveOrders: PropTypes.arrayOf(PropTypes.object),
};
