import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useOrders } from '../orders/orderHistoryStore';
import { formatCurrency } from '../utils/formatCurrency';
import { DollarSign, ShoppingBag, TrendingUp, Clock, CheckCircle2, Bike, Flame, ArrowRight, Utensils, } from 'lucide-react';
import { Button } from '../ui/Button';
export const Dashboard = () => {
  const { orders } = useOrders();
  const totalRevenue = useMemo(() => {
    return orders.reduce((sum, o) => sum + o.total, 0);
  }, [orders]);
  const totalOrdersCount = orders.length;
  const averageOrderValue = useMemo(() => {
    if (totalOrdersCount === 0)
      return 0;
    return totalRevenue / totalOrdersCount;
  }, [totalRevenue, totalOrdersCount]);
  const statusCounts = useMemo(() => {
    const counts = {
      pending: 0,
      preparing: 0,
      delivering: 0,
      delivered: 0,
    };
    orders.forEach((o) => {
      if (counts[o.status] !== undefined) {
        counts[o.status] += 1;
      }
    });
    return counts;
  }, [orders]);
  const topDishes = useMemo(() => {
    const map = {};
    orders.forEach((order) => {
      order.items.forEach((item) => {
        if (!map[item.dishId]) {
          map[item.dishId] = {
            name: item.dishName,
            quantity: 0,
            revenue: 0,
            image: item.image,
          };
        }
        map[item.dishId].quantity += item.quantity;
        map[item.dishId].revenue += item.price * item.quantity;
      });
    });
    return Object.values(map)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);
  }, [orders]);
  return (<div className="max-w-7xl mx-auto space-y-8">
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-[#D9381E]">
          Operations Overview
        </span>
        <h1 className="text-3xl font-extrabold text-stone-900 dark:text-stone-100 font-sans-display">
          Restaurant Dashboard
        </h1>
        <p className="text-xs text-stone-500 mt-1">
          Real-time analytics for Addis Eats food orders, delivery statuses, and revenue.
        </p>
      </div>
      <div className="flex items-center gap-3">
        <Link to="/admin/menu">
          <Button size="sm" variant="outline">
            <Utensils className="w-4 h-4 mr-1.5" /> Manage Menu
          </Button>
        </Link>
        <Link to="/admin/orders">
          <Button size="sm">
            <ShoppingBag className="w-4 h-4 mr-1.5" /> View Orders
          </Button>
        </Link>
      </div>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
      <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 border border-stone-200/80 dark:border-stone-800 shadow-sm flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-[#D9381E]/15 text-[#D9381E] flex items-center justify-center shrink-0">
          <DollarSign className="w-7 h-7" />
        </div>
        <div>
          <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
            Total Revenue
          </span>
          <div className="text-2xl font-black text-stone-900 dark:text-stone-100 mt-0.5">
            {formatCurrency(totalRevenue)}
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold">
            Live calculated across orders
          </span>
        </div>
      </div>
      <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 border border-stone-200/80 dark:border-stone-800 shadow-sm flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 flex items-center justify-center shrink-0">
          <ShoppingBag className="w-7 h-7" />
        </div>
        <div>
          <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
            Total Orders
          </span>
          <div className="text-2xl font-black text-stone-900 dark:text-stone-100 mt-0.5">
            {totalOrdersCount} orders
          </div>
          <span className="text-[11px] text-stone-400">
            Customer bookings
          </span>
        </div>
      </div>
      <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 border border-stone-200/80 dark:border-stone-800 shadow-sm flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0">
          <TrendingUp className="w-7 h-7" />
        </div>
        <div>
          <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
            Average Order Value
          </span>
          <div className="text-2xl font-black text-stone-900 dark:text-stone-100 mt-0.5">
            {formatCurrency(averageOrderValue)}
          </div>
          <span className="text-[11px] text-stone-400">
            Per placed delivery
          </span>
        </div>
      </div>
    </div>
    <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 border border-stone-200/80 dark:border-stone-800 shadow-sm">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-stone-100 dark:border-stone-800">
        <div>
          <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100">
            Order Status Breakdown
          </h2>
          <p className="text-xs text-stone-500">
            Current lifecycle distribution of customer orders.
          </p>
        </div>
        <Link to="/admin/orders" className="text-xs font-bold text-[#D9381E] hover:underline inline-flex items-center gap-1">
          Manage Statuses <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900/40 rounded-2xl p-4 text-center">
          <div className="w-8 h-8 rounded-full bg-amber-200/70 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300 flex items-center justify-center mx-auto mb-2">
            <Clock className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold text-amber-900 dark:text-amber-200">Pending</span>
          <div className="text-2xl font-extrabold text-amber-800 dark:text-amber-300 mt-1">
            {statusCounts.pending}
          </div>
        </div>
        <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200/60 dark:border-blue-900/40 rounded-2xl p-4 text-center">
          <div className="w-8 h-8 rounded-full bg-blue-200/70 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 flex items-center justify-center mx-auto mb-2">
            <Flame className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold text-blue-900 dark:text-blue-200">Kitchen / Prep</span>
          <div className="text-2xl font-extrabold text-blue-800 dark:text-blue-300 mt-1">
            {statusCounts.preparing}
          </div>
        </div>
        <div className="bg-purple-50 dark:bg-purple-950/30 border border-purple-200/60 dark:border-purple-900/40 rounded-2xl p-4 text-center">
          <div className="w-8 h-8 rounded-full bg-purple-200/70 dark:bg-purple-900/50 text-purple-800 dark:text-purple-300 flex items-center justify-center mx-auto mb-2">
            <Bike className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold text-purple-900 dark:text-purple-200">Out for Delivery</span>
          <div className="text-2xl font-extrabold text-purple-800 dark:text-purple-300 mt-1">
            {statusCounts.delivering}
          </div>
        </div>
        <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-900/40 rounded-2xl p-4 text-center">
          <div className="w-8 h-8 rounded-full bg-emerald-200/70 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300 flex items-center justify-center mx-auto mb-2">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold text-emerald-900 dark:text-emerald-200">Delivered</span>
          <div className="text-2xl font-extrabold text-emerald-800 dark:text-emerald-300 mt-1">
            {statusCounts.delivered}
          </div>
        </div>
      </div>
      {totalOrdersCount > 0 && (<div className="mt-6 pt-4 border-t border-stone-100 dark:border-stone-800">
        <div className="w-full h-3 bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden flex">
          <div style={{ width: `${(statusCounts.pending / totalOrdersCount) * 100}%` }} className="bg-amber-400 h-full" title={`Pending: ${statusCounts.pending}`} />
          <div style={{ width: `${(statusCounts.preparing / totalOrdersCount) * 100}%` }} className="bg-blue-500 h-full" title={`Preparing: ${statusCounts.preparing}`} />
          <div style={{ width: `${(statusCounts.delivering / totalOrdersCount) * 100}%` }} className="bg-purple-500 h-full" title={`Delivering: ${statusCounts.delivering}`} />
          <div style={{ width: `${(statusCounts.delivered / totalOrdersCount) * 100}%` }} className="bg-emerald-500 h-full" title={`Delivered: ${statusCounts.delivered}`} />
        </div>
      </div>)}
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <div className="lg:col-span-6 bg-white dark:bg-stone-900 rounded-3xl p-6 border border-stone-200/80 dark:border-stone-800 shadow-sm">
        <h3 className="text-base font-bold text-stone-900 dark:text-stone-100 mb-1">
          Top Selling Dishes
        </h3>
        <p className="text-xs text-stone-500 mb-4">
          Most popular choices ordered by customers across Addis.
        </p>
        {topDishes.length === 0 ? (<p className="text-xs text-stone-400 py-6 text-center">No order data yet.</p>) : (<div className="space-y-3">
          {topDishes.map((dish, i) => (<div key={i} className="flex items-center justify-between p-3 rounded-2xl bg-stone-50 dark:bg-stone-800/50 border border-stone-100 dark:border-stone-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl overflow-hidden bg-stone-200 shrink-0">
                <img src={dish.image} alt={dish.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
              <div>
                <span className="font-bold text-xs text-stone-900 dark:text-stone-100 block">
                  {dish.name}
                </span>
                <span className="text-[11px] text-stone-500">
                  {dish.quantity} orders placed
                </span>
              </div>
            </div>
            <span className="text-xs font-black text-[#D9381E] dark:text-[#FFA085]">
              {formatCurrency(dish.revenue)}
            </span>
          </div>))}
        </div>)}
      </div>
      <div className="lg:col-span-6 bg-white dark:bg-stone-900 rounded-3xl p-6 border border-stone-200/80 dark:border-stone-800 shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
                Recent Orders
              </h3>
              <p className="text-xs text-stone-500">Live feed from customer checkouts.</p>
            </div>
            <Link to="/admin/orders" className="text-xs font-bold text-[#D9381E] hover:underline">
              View All →
            </Link>
          </div>
          <div className="space-y-2.5">
            {orders.slice(0, 4).map((o) => (<div key={o.id} className="flex items-center justify-between p-3 rounded-xl border border-stone-100 dark:border-stone-800 text-xs">
              <div>
                <span className="font-bold text-stone-900 dark:text-stone-100">
                  {o.orderNumber}
                </span>
                <span className="text-stone-400 block text-[11px]">
                  {o.customer.name} · {o.customer.area.split(' ')[0]}
                </span>
              </div>
              <div className="text-right">
                <span className="font-bold text-stone-800 dark:text-stone-200 block">
                  {formatCurrency(o.total)}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#D9381E]">
                  {o.status}
                </span>
              </div>
            </div>))}
          </div>
        </div>
        <div className="mt-6 pt-4 border-t border-stone-100 dark:border-stone-800 flex justify-end">
          <Link to="/admin/orders">
            <Button size="sm" variant="secondary">
              Manage Order Deliveries <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  </div>);
};
