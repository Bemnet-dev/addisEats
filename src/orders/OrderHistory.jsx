import { Link } from 'react-router-dom';
import { useOrders } from './orderHistoryStore';
import { useAuth } from '../auth/useAuth';
import { OrderHistoryItem } from './OrderHistoryItem';
import { Button } from '../ui/Button';
import { Package, ArrowRight } from 'lucide-react';
export const OrderHistory = () => {
  const { orders } = useOrders();
  const { user } = useAuth();

  const userOrders = orders.filter((o) => o.customer.id === user?.id);
  return (<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
    <div>
      <h1 className="text-3xl sm:text-4xl font-black text-stone-900 dark:text-stone-100 font-sans-display tracking-tight">
        My Orders
      </h1>
      <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1 max-w-2xl">
        View all your placed orders.
      </p>
    </div>


    <section className="space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-stone-200/60 dark:border-stone-800">
        <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100 font-sans-display">
          All Orders ({userOrders.length})
        </h2>
      </div>
      {userOrders.length === 0 ? (<div className="text-center py-16 px-4 bg-white dark:bg-stone-900 rounded-3xl border border-dashed border-stone-200 dark:border-stone-800">
        <div className="w-16 h-16 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-400 flex items-center justify-center mx-auto mb-3">
          <Package className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100 mb-1">
          No Orders Placed Yet
        </h3>
        <p className="text-xs text-stone-500 dark:text-stone-400 mb-6 max-w-sm mx-auto">
          Once you place an order for delicious Ethiopian food, pizza, or burgers, you can view your order history right here.
        </p>
        <Link to="/menu">
          <Button>
            Explore Menu & Order <ArrowRight className="w-4 h-4 ml-1.5" />
          </Button>
        </Link>
      </div>) : (<div className="space-y-6">
        {userOrders.map((order) => (<OrderHistoryItem key={order.id} order={order} />))}
      </div>)}
    </section>
  </div>);
};
