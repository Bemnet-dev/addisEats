import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const ORDERS_STORAGE_KEY = 'addis_eats_orders';

export const useOrdersStore = create(
    persist(
        (set, get) => ({
            orders: [],

            addOrder: (newOrder) => {
                const created = {
                    ...newOrder,
                    id: `ord-${Date.now()}`,
                    orderNumber: `AE-${Math.floor(1000 + Math.random() * 9000)}`,
                    createdAt: new Date().toISOString(),
                };
                set((state) => ({
                    orders: [created, ...state.orders],
                }));
                return created;
            },

            updateOrderStatus: (orderId, status) => {
                set((state) => ({
                    orders: state.orders.map((order) =>
                        order.id === orderId ? { ...order, status } : order
                    ),
                }));
            },

            deleteOrder: (orderId) => {
                set((state) => ({
                    orders: state.orders.filter((order) => order.id !== orderId),
                }));
            },

            getOrderById: (orderId) => {
                return get().orders.find((order) => order.id === orderId);
            },
        }),
        {
            name: ORDERS_STORAGE_KEY,
            partialize: (state) => ({
                orders: state.orders,
            }),
        }
    )
);

export function useOrders() {
    const state = useOrdersStore();
    return {
        orders: state.orders,
        addOrder: state.addOrder,
        updateOrderStatus: state.updateOrderStatus,
        deleteOrder: state.deleteOrder,
        getOrderById: state.getOrderById,
    };
}

export function addOrder(newOrder) {
    return useOrdersStore.getState().addOrder(newOrder);
}

export function updateOrderStatus(orderId, status) {
    useOrdersStore.getState().updateOrderStatus(orderId, status);
}

export function deleteOrder(orderId) {
    useOrdersStore.getState().deleteOrder(orderId);
}
