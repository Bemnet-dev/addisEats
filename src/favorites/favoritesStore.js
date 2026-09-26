import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const FAVORITES_STORAGE_KEY = 'addis_eats_favorites';

export const useFavoritesStore = create(
    persist(
        (set, get) => ({
            favoriteIds: [],

            toggle: (dishId) => {
                set((state) => ({
                    favoriteIds: state.favoriteIds.includes(dishId)
                        ? state.favoriteIds.filter((id) => id !== dishId)
                        : [...state.favoriteIds, dishId],
                }));
            },

            isFavorite: (dishId) => {
                return get().favoriteIds.includes(dishId);
            },

            addFavorite: (dishId) => {
                set((state) => ({
                    favoriteIds: state.favoriteIds.includes(dishId)
                        ? state.favoriteIds
                        : [...state.favoriteIds, dishId],
                }));
            },

            removeFavorite: (dishId) => {
                set((state) => ({
                    favoriteIds: state.favoriteIds.filter((id) => id !== dishId),
                }));
            },
        }),
        {
            name: FAVORITES_STORAGE_KEY,
            partialize: (state) => ({
                favoriteIds: state.favoriteIds,
            }),
        }
    )
);

export function useFavorites() {
    const state = useFavoritesStore();
    return {
        favoriteIds: state.favoriteIds,
        toggle: state.toggle,
        isFavorite: state.isFavorite,
        addFavorite: state.addFavorite,
        removeFavorite: state.removeFavorite,
    };
}
