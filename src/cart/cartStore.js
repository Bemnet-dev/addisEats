import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const CART_STORAGE_KEY = 'addis_eats_cart';
const INSTRUCTIONS_STORAGE_KEY = 'addis_eats_special_instructions';

export const useCartStore = create(
    persist(
        (set, get) => ({
            items: [],
            specialInstructions: '',

            addToCart: (dish, quantity = 1, notes = '') => {
                set((state) => {
                    const existingItem = state.items.find((item) => item.dish.id === dish.id);
                    if (existingItem) {
                        return {
                            items: state.items.map((item) =>
                                item.dish.id === dish.id
                                    ? { ...item, quantity: item.quantity + quantity, notes: notes || item.notes }
                                    : item
                            ),
                        };
                    }
                    return {
                        items: [...state.items, { dish, quantity, notes }],
                    };
                });
            },

            updateQuantity: (dishId, delta) => {
                set((state) => ({
                    items: state.items
                        .map((item) =>
                            item.dish.id === dishId
                                ? { ...item, quantity: item.quantity + delta }
                                : item
                        )
                        .filter((item) => item.quantity > 0),
                }));
            },

            setItemQuantity: (dishId, quantity) => {
                set((state) => ({
                    items: state.items
                        .map((item) =>
                            item.dish.id === dishId
                                ? { ...item, quantity }
                                : item
                        )
                        .filter((item) => item.quantity > 0),
                }));
            },

            removeFromCart: (dishId) => {
                set((state) => ({
                    items: state.items.filter((item) => item.dish.id !== dishId),
                }));
            },

            clearCart: () => {
                set({ items: [], specialInstructions: '' });
            },

            updateInstructions: (instructions) => {
                set({ specialInstructions: instructions });
            },
        }),
        {
            name: CART_STORAGE_KEY,
            partialize: (state) => ({
                items: state.items,
                specialInstructions: state.specialInstructions,
            }),
        }
    )
);

export function useCart() {
    const state = useCartStore();
    const totalItemsCount = state.items.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = state.items.reduce(
        (sum, item) => sum + item.dish.price * item.quantity,
        0
    );
    return {
        items: state.items,
        specialInstructions: state.specialInstructions,
        totalItemsCount,
        subtotal,
        addToCart: state.addToCart,
        updateQuantity: state.updateQuantity,
        setItemQuantity: state.setItemQuantity,
        removeFromCart: state.removeFromCart,
        clearCart: state.clearCart,
        updateInstructions: state.updateInstructions,
    };
}
