import { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fetchDishes } from '../api/dishes';
import { CategoryBar } from './CategoryBar';
import { DishList } from './DishList';
import { useDebounce } from '../hooks/useDebounce';
import { Search, X, Leaf, ArrowUpDown } from 'lucide-react';
export const Menu = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const categoryParam = searchParams.get('category') || 'All';
    const [dishes, setDishes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchInput, setSearchInput] = useState('');
    const debouncedSearch = useDebounce(searchInput, 250);
    const [onlyVegetarian, setOnlyVegetarian] = useState(false);
    const [sortBy, setSortBy] = useState('featured');
    const loadData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchDishes();
            setDishes(data);
        }
        catch (err) {
            setError(err);
        }
        finally {
            setLoading(false);
        }
    }, []);
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        loadData();
    }, [loadData]);
    const handleCategorySelect = (category) => {
        if (category === 'All') {
            searchParams.delete('category');
            setSearchParams(searchParams);
        }
        else {
            setSearchParams({ ...Object.fromEntries(searchParams.entries()), category });
        }
    };
    const categoryCounts = useMemo(() => {
        const counts = { All: dishes.length };
        dishes.forEach((d) => {
            counts[d.category] = (counts[d.category] || 0) + 1;
        });
        return counts;
    }, [dishes]);
    const filteredDishes = useMemo(() => {
        return dishes
            .filter((dish) => {
                if (categoryParam !== 'All' && dish.category.toLowerCase() !== categoryParam.toLowerCase()) {
                    return false;
                }
                if (onlyVegetarian && !dish.isVegetarian) {
                    return false;
                }
                if (debouncedSearch.trim()) {
                    const q = debouncedSearch.toLowerCase().trim();
                    const matchName = dish.name.toLowerCase().includes(q);
                    const matchDesc = dish.description.toLowerCase().includes(q);
                    const matchCat = dish.category.toLowerCase().includes(q);
                    const matchIng = dish.ingredients.some((ing) => ing.toLowerCase().includes(q));
                    if (!matchName && !matchDesc && !matchCat && !matchIng) {
                        return false;
                    }
                }
                return true;
            })
            .sort((a, b) => {
                if (sortBy === 'price-asc')
                    return a.price - b.price;
                if (sortBy === 'price-desc')
                    return b.price - a.price;
                if (sortBy === 'rating')
                    return b.rating - a.rating;
                if (a.isSpecial && !b.isSpecial)
                    return -1;
                if (!a.isSpecial && b.isSpecial)
                    return 1;
                return b.rating - a.rating;
            });
    }, [dishes, categoryParam, onlyVegetarian, debouncedSearch, sortBy]);
    return (<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
            <span className="text-xs font-bold uppercase tracking-widest text-[#D9381E] bg-[#D9381E]/10 px-3.5 py-1 rounded-full inline-block mb-2">
                Addis Ababa Menu
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-stone-900 dark:text-stone-100 font-sans-display">
                Food & <span className="font-script font-normal text-[#D9381E] text-4xl sm:text-5xl">Drinks</span>
            </h1>
            <p className="text-stone-600 dark:text-stone-400 text-sm max-w-xl mx-auto mt-2">
                Fresh Ethiopian meals, pizza, burgers, and drinks delivered to you.
            </p>
        </div>
        <div className="bg-white dark:bg-stone-900 rounded-3xl p-5 shadow-sm border border-stone-200/80 dark:border-stone-800 mb-8 space-y-4">
            <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
                <div className="relative w-full md:w-96">
                    <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input type="text" id="menu-live-search" placeholder="Search dishes, ingredients (e.g. Tibs, Berbere, Mozzarella)..." value={searchInput} onChange={(e) => setSearchInput(e.target.value)} className="w-full pl-10 pr-9 py-2.5 rounded-full bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs sm:text-sm text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-[#D9381E]" aria-label="Search dishes" />
                    {searchInput && (<button onClick={() => setSearchInput('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 cursor-pointer" aria-label="Clear search">
                        <X className="w-4 h-4" />
                    </button>)}
                </div>
                <div className="flex items-center gap-2.5 w-full md:w-auto justify-between md:justify-end flex-wrap">
                    <button type="button" onClick={() => setOnlyVegetarian((prev) => !prev)} className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold border transition-colors cursor-pointer ${onlyVegetarian
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                        : 'border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'}`}>
                        <Leaf className="w-3.5 h-3.5" />
                        <span>Veg Only</span>
                    </button>
                    <div className="flex items-center gap-1.5 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-full px-3 py-1.5 text-xs">
                        <ArrowUpDown className="w-3.5 h-3.5 text-stone-400" />
                        <select id="menu-sort-selector" value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="bg-transparent text-stone-700 dark:text-stone-300 font-medium focus:outline-none cursor-pointer text-xs" aria-label="Sort dishes">
                            <option value="featured">Featured / Specials</option>
                            <option value="price-asc">Price: Low to High</option>
                            <option value="price-desc">Price: High to Low</option>
                            <option value="rating">Top Rated</option>
                        </select>
                    </div>
                </div>
            </div>
            <div className="pt-2 border-t border-stone-100 dark:border-stone-800">
                <CategoryBar selectedCategory={categoryParam} onSelectCategory={handleCategorySelect} counts={categoryCounts} />
            </div>
        </div>
        <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400 mb-4 px-1">
            <span>
                Showing <strong className="text-stone-800 dark:text-stone-200">{filteredDishes.length}</strong>{' '}
                {categoryParam === 'All' ? 'items' : `${categoryParam} dishes`}
            </span>
            {(searchInput || categoryParam !== 'All' || onlyVegetarian) && (<button onClick={() => {
                setSearchInput('');
                setOnlyVegetarian(false);
                handleCategorySelect('All');
            }} className="text-[#D9381E] hover:underline font-semibold cursor-pointer flex items-center gap-1">
                Reset Filters
            </button>)}
        </div>
        <DishList dishes={filteredDishes} loading={loading} error={error} onRetry={loadData} emptyMessage={searchInput
            ? `No meals found matching "${searchInput}". Try adjusting your keywords or category filter.`
            : 'No dishes found in this category.'} />
    </div>);
};
