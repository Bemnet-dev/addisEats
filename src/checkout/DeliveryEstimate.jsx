import PropTypes from 'prop-types';
import { Clock, MapPin, ShieldCheck, Bike } from 'lucide-react';
import { getDeliveryFee, getEstimatedDeliveryTime } from '../utils/deliveryEstimate';
import { formatCurrency } from '../utils/formatCurrency';
export const DeliveryEstimate = ({ area }) => {
  const fee = getDeliveryFee(area);
  const time = getEstimatedDeliveryTime(area);
  return (<div className="bg-stone-50 dark:bg-stone-800/60 rounded-2xl p-4 border border-stone-200/70 dark:border-stone-700/60 space-y-3">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-[#D9381E]/15 text-[#D9381E] flex items-center justify-center">
          <Bike className="w-4 h-4" />
        </div>
        <div>
          <h4 className="text-xs font-bold text-stone-900 dark:text-stone-100">
            Addis Express Delivery
          </h4>
          <p className="text-[11px] text-stone-500 flex items-center gap-1">
            <MapPin className="w-3 h-3 text-[#D9381E]" /> {area || 'Select subcity'}
          </p>
        </div>
      </div>
      <div className="text-right">
        <span className="text-xs font-bold text-[#D9381E] dark:text-[#FFA085]">
          {formatCurrency(fee)}
        </span>
      </div>
    </div>
    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-stone-200/60 dark:border-stone-700/60 text-xs">
      <div className="flex items-center gap-1.5 text-stone-600 dark:text-stone-300">
        <Clock className="w-3.5 h-3.5 text-stone-400" />
        <span>Estimated: <strong>{time}</strong></span>
      </div>
      <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
        <ShieldCheck className="w-3.5 h-3.5" />
        <span>Hot & Fresh Guarantee</span>
      </div>
    </div>
  </div>);
};
DeliveryEstimate.propTypes = {
  area: PropTypes.string,
};
