const STORAGE_KEY = 'addis_eats_dishes';
export async function fetchDishes() {
    try {
        const local = localStorage.getItem(STORAGE_KEY);
        if (local) {
            try {
                const parsed = JSON.parse(local);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    let changed = false;
                    const sanitized = parsed.map((dish) => {
                        let updatedDish = { ...dish };
                        if (updatedDish.name && updatedDish.name.toLowerCase().includes('swigo')) {
                            updatedDish.name = updatedDish.name.replace(/swigo/gi, 'Addis');
                            changed = true;
                        }
                        if (Array.isArray(updatedDish.ingredients)) {
                            const newIngredients = updatedDish.ingredients.map((ing) => ing.replace(/swigo/gi, 'Special'));
                            if (JSON.stringify(newIngredients) !== JSON.stringify(updatedDish.ingredients)) {
                                updatedDish.ingredients = newIngredients;
                                changed = true;
                            }
                        }
                        return updatedDish;
                    });
                    if (changed) {
                        localStorage.setItem(STORAGE_KEY, JSON.stringify(sanitized));
                    }
                    return sanitized;
                }
            } catch (parseErr) {
                console.warn('Cached menu data corrupted, clearing cache', parseErr);
                localStorage.removeItem(STORAGE_KEY);
            }
        }
        const response = await fetch('/menu-data.json');
        if (!response.ok) {
            throw new Error(`Failed to load menu data: ${response.statusText}`);
        }
        const data = await response.json();
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        return data;
    }
    catch (err) {
        console.warn('Falling back to empty menu', err);
        const local = localStorage.getItem(STORAGE_KEY);
        if (local) {
            try {
                const parsed = JSON.parse(local);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    return parsed;
                }
            } catch (parseErr) {
                console.warn('Cache unrecoverable, returning empty menu', parseErr);
            }
        }
        return [];
    }
}
export async function getDishById(id) {
    const dishes = await fetchDishes();
    return dishes.find((d) => d.id === id);
}
export async function saveDishes(dishes) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dishes));
}
export async function addDish(newDish) {
    const dishes = await fetchDishes();
    const created = {
        ...newDish,
        id: `dish-${Date.now()}`,
    };
    const updated = [created, ...dishes];
    await saveDishes(updated);
    return created;
}
export async function updateDish(id, updates) {
    const dishes = await fetchDishes();
    const index = dishes.findIndex((d) => d.id === id);
    if (index === -1) {
        throw new Error('Dish not found');
    }
    dishes[index] = { ...dishes[index], ...updates };
    await saveDishes(dishes);
    return dishes[index];
}
export async function deleteDish(id) {
    const dishes = await fetchDishes();
    const filtered = dishes.filter((d) => d.id !== id);
    await saveDishes(filtered);
    return true;
}
export async function toggleDishAvailability(id) {
    const dishes = await fetchDishes();
    const index = dishes.findIndex((d) => d.id === id);
    if (index === -1) {
        throw new Error('Dish not found');
    }
    dishes[index].available = dishes[index].available === false ? true : false;
    await saveDishes(dishes);
    return dishes[index];
}
export async function resetMenuSeed() {
    localStorage.removeItem(STORAGE_KEY);
    return await fetchDishes();
}
