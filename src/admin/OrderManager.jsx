import { useState, useMemo } from 'react';
import { useOrders } from '../orders/orderHistoryStore';
import { formatCurrency } from '../utils/formatCurrency';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { Trash2, Eye, Phone, MapPin, AlertTriangle, User, MessageSquare, } from 'lucide-react';
export const OrderManager = () => {
  const { orders, updateOrderStatus, deleteOrder } = useOrders();
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [deletingOrder, setDeletingOrder] = useState(null);
  const filteredOrders = useMemo(() => {
    if (statusFilter === 'All')
      return orders;
    return orders.filter((o) => o.status === statusFilter);
  }, [orders, statusFilter]);
  const handleStatusChange = (orderId, newStatus) => {
    updateOrderStatus(orderId, newStatus);
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: newStatus });
    }
  };
  const confirmDelete = () => {
    if (!deletingOrder)
      return;
    deleteOrder(deletingOrder.id);
    if (selectedOrder && selectedOrder.id === deletingOrder.id) {
      setSelectedOrder(null);
    }
    setDeletingOrder(null);
  };
  const statusBadgeVariant = (status) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'preparing':
        return 'primary';
      case 'delivering':
        return 'warning';
      case 'delivered':
        return 'success';
      default:
        return 'neutral';
    }
  };
  return (<div className="max-w-7xl mx-auto space-y-6">
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-[#D9381E]">
          Kitchen & Delivery Fulfillment
        </span>
        <h1 className="text-3xl font-extrabold text-stone-900 dark:text-stone-100 font-sans-display">
          Orders Management ({orders.length})
        </h1>
        <p className="text-xs text-stone-500 mt-1">
          Track kitchen preparation, dispatch delivery couriers, and update statuses in real time.
        </p>
      </div>
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {['All', 'pending', 'preparing', 'delivering', 'delivered'].map((s) => (<button key={s} onClick={() => setStatusFilter(s)} className={`px-3 py-1.5 rounded-full text-xs font-bold capitalize cursor-pointer whitespace-nowrap transition-all ${statusFilter === s
          ? 'bg-[#D9381E] text-white shadow-xs'
          : 'bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-700 hover:bg-stone-50'}`}>
          {s}
        </button>))}
      </div>
    </div>
    {filteredOrders.length === 0 ? (<div className="bg-white dark:bg-stone-900 rounded-3xl p-12 text-center border border-dashed border-stone-200 dark:border-stone-800">
      <p className="text-sm font-bold text-stone-700 dark:text-stone-300">
        No orders found in status "{statusFilter}"
      </p>
      <p className="text-xs text-stone-400 mt-1">
        Orders placed in the customer checkout will appear here instantly.
      </p>
    </div>) : (<div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200/80 dark:border-stone-800 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-stone-50 dark:bg-stone-800/60 border-b border-stone-200 dark:border-stone-700 text-[11px] font-bold text-stone-500 uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4">Order # / Date</th>
              <th className="px-6 py-4">Customer</th>
              <th className="px-6 py-4">Destination</th>
              <th className="px-6 py-4">Items</th>
              <th className="px-6 py-4">Total (ETB)</th>
              <th className="px-6 py-4">Status & Action</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
            {filteredOrders.map((order) => (<tr key={order.id} className="hover:bg-stone-50/60 dark:hover:bg-stone-800/40 transition-colors">
              <td className="px-6 py-4">
                <span className="font-extrabold text-stone-900 dark:text-stone-100 block text-sm">
                  {order.orderNumber}
                </span>
                <span className="text-[11px] text-stone-400">
                  {new Date(order.createdAt).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </td>
              <td className="px-6 py-4">
                <span className="font-bold text-stone-900 dark:text-stone-100 block">
                  {order.customer.name}
                </span>
                <span className="text-[11px] text-stone-400 flex items-center gap-1">
                  <Phone className="w-3 h-3 text-[#D9381E]" /> {order.customer.phone}
                </span>
              </td>
              <td className="px-6 py-4">
                <span className="font-semibold text-stone-800 dark:text-stone-200 block">
                  {order.customer.area}
                </span>
                <span className="text-[11px] text-stone-400 truncate max-w-[150px] block">
                  {order.customer.address}
                </span>
              </td>
              <td className="px-6 py-4">
                <span className="font-bold text-stone-700 dark:text-stone-300">
                  {order.items.reduce((s, i) => s + i.quantity, 0)} dishes
                </span>
                <span className="text-[11px] text-stone-400 block truncate max-w-[160px]">
                  {order.items.map((i) => `${i.quantity}x ${i.dishName}`).join(', ')}
                </span>
              </td>
              <td className="px-6 py-4 font-black text-stone-900 dark:text-stone-100 text-sm">
                {formatCurrency(order.total)}
              </td>
              <td className="px-6 py-4">
                <select value={order.status} onChange={(e) => handleStatusChange(order.id, e.target.value)} className={`text-xs font-bold py-1 px-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#D9381E] cursor-pointer ${order.status === 'delivered'
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300'
                  : order.status === 'delivering'
                    ? 'bg-purple-50 text-purple-800 border-purple-300 dark:bg-purple-950/40 dark:text-purple-300'
                    : order.status === 'preparing'
                      ? 'bg-blue-50 text-blue-800 border-blue-300 dark:bg-blue-950/40 dark:text-blue-300'
                      : 'bg-amber-50 text-amber-800 border-amber-300 dark:bg-amber-950/40 dark:text-amber-300'}`}>
                  <option value="pending">Pending</option>
                  <option value="preparing">Preparing (Kitchen)</option>
                  <option value="delivering">Out for Delivery</option>
                  <option value="delivered">Delivered</option>
                </select>
              </td>
              <td className="px-6 py-4 text-right">
                <div className="flex items-center justify-end gap-1.5">
                  <button onClick={() => setSelectedOrder(order)} className="p-1.5 rounded-lg text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 hover:text-[#D9381E] transition-colors cursor-pointer" title="View order breakdown">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button onClick={() => setDeletingOrder(order)} className="p-1.5 rounded-lg text-stone-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 hover:text-rose-600 transition-colors cursor-pointer" title="Cancel/Delete Order">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>))}
          </tbody>
        </table>
      </div>
    </div>)}
    {selectedOrder && (<Modal isOpen={!!selectedOrder} onClose={() => setSelectedOrder(null)} title={`Order #${selectedOrder.orderNumber} Details`}>
      <div className="space-y-6">
        <div className="flex items-center justify-between p-4 bg-stone-50 dark:bg-stone-800/60 rounded-2xl border border-stone-200 dark:border-stone-700">
          <div>
            <span className="text-[11px] font-bold text-stone-400 uppercase block">
              Current Status
            </span>
            <Badge variant={statusBadgeVariant(selectedOrder.status)}>
              {selectedOrder.status}
            </Badge>
          </div>
          <div>
            <span className="text-[11px] font-bold text-stone-400 uppercase block mb-1">
              Change Status
            </span>
            <select value={selectedOrder.status} onChange={(e) => handleStatusChange(selectedOrder.id, e.target.value)} className="text-xs font-bold py-1.5 px-3 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 cursor-pointer">
              <option value="pending">Pending</option>
              <option value="preparing">Preparing</option>
              <option value="delivering">Out for Delivery</option>
              <option value="delivered">Delivered</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 bg-stone-50 dark:bg-stone-800/40 rounded-2xl space-y-1.5">
            <span className="text-[11px] font-bold text-stone-400 uppercase flex items-center gap-1">
              <User className="w-3 h-3 text-[#D9381E]" /> Customer Info
            </span>
            <p className="font-bold text-stone-900 dark:text-stone-100 text-sm">
              {selectedOrder.customer.name}
            </p>
            <p className="text-stone-500">Phone: {selectedOrder.customer.phone}</p>
            <p className="text-stone-500">
              Payment: <strong>{selectedOrder.paymentMethod}</strong>
            </p>
          </div>
          <div className="p-4 bg-stone-50 dark:bg-stone-800/40 rounded-2xl space-y-1.5">
            <span className="text-[11px] font-bold text-stone-400 uppercase flex items-center gap-1">
              <MapPin className="w-3 h-3 text-[#D9381E]" /> Delivery Destination
            </span>
            <p className="font-bold text-stone-900 dark:text-stone-100">
              {selectedOrder.customer.area}
            </p>
            <p className="text-stone-500">{selectedOrder.customer.address}</p>
            <p className="text-stone-400 text-[11px]">
              Estimated: {selectedOrder.estimatedDeliveryTime}
            </p>
          </div>
        </div>
        {selectedOrder.specialInstructions && (<div className="p-3.5 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/40 rounded-xl text-xs space-y-1">
          <span className="font-bold text-amber-900 dark:text-amber-200 flex items-center gap-1">
            <MessageSquare className="w-3.5 h-3.5" /> Customer Kitchen Note:
          </span>
          <p className="text-amber-800 dark:text-amber-300 italic">
            "{selectedOrder.specialInstructions}"
          </p>
        </div>)}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
            Ordered Dishes
          </h4>
          <div className="divide-y divide-stone-100 dark:divide-stone-800 border border-stone-200 dark:border-stone-700 rounded-2xl overflow-hidden">
            {selectedOrder.items.map((item, idx) => (<div key={idx} className="p-3 flex items-center justify-between text-xs bg-white dark:bg-stone-900">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg overflow-hidden bg-stone-100 shrink-0">
                  <img src={item.image} alt={item.dishName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
                <div>
                  <span className="font-bold text-stone-900 dark:text-stone-100">
                    {item.dishName}
                  </span>
                  <span className="text-[11px] text-stone-400 block">
                    {item.quantity} × {formatCurrency(item.price)}
                  </span>
                </div>
              </div>
              <span className="font-extrabold text-stone-900 dark:text-stone-100">
                {formatCurrency(item.price * item.quantity)}
              </span>
            </div>))}
          </div>
        </div>
        <div className="space-y-1.5 pt-3 border-t border-stone-200 dark:border-stone-700 text-xs">
          <div className="flex justify-between text-stone-500">
            <span>Items Subtotal</span>
            <span className="font-bold">{formatCurrency(selectedOrder.subtotal)}</span>
          </div>
          <div className="flex justify-between text-stone-500">
            <span>Delivery Fee</span>
            <span className="font-bold">{formatCurrency(selectedOrder.deliveryFee)}</span>
          </div>
          <div className="flex justify-between text-stone-900 dark:text-stone-100 text-sm font-black pt-2 border-t border-dashed border-stone-200 dark:border-stone-700">
            <span>Grand Total</span>
            <span className="text-[#D9381E]">{formatCurrency(selectedOrder.total)}</span>
          </div>
        </div>
      </div>
    </Modal>)}
    {deletingOrder && (<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 max-w-sm w-full border border-stone-200 dark:border-stone-800 shadow-2xl space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center mx-auto">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <div className="text-center">
          <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
            Cancel Order #{deletingOrder.orderNumber}?
          </h3>
          <p className="text-xs text-stone-500 mt-1">
            Are you sure you want to cancel or remove this order from the system?
          </p>
        </div>
        <div className="flex items-center gap-3 pt-2">
          <Button variant="outline" size="sm" className="w-full" onClick={() => setDeletingOrder(null)}>
            Keep Order
          </Button>
          <Button variant="danger" size="sm" className="w-full" onClick={confirmDelete}>
            Cancel Order
          </Button>
        </div>
      </div>
    </div>)}
  </div>);
};
