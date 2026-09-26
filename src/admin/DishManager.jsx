import { useState, useEffect, useMemo, useCallback } from 'react';
import { fetchDishes, addDish, updateDish, deleteDish, toggleDishAvailability, } from '../api/dishes';
import { formatCurrency } from '../utils/formatCurrency';
import { DishForm } from './DishForm';
import { Button } from '../ui/Button';
import { Spinner } from '../ui/Spinner';
import { Badge } from '../ui/Badge';
import { Search, Plus, Edit2, Trash2, AlertTriangle, Check, X, Filter, Flame, Leaf, } from 'lucide-react';
export const DishManager = () => {
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingDish, setEditingDish] = useState(null);
  const [deletingDish, setDeletingDish] = useState(null);
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchDishes();
      setDishes(data);
    }
    catch (err) {
      console.error('Failed to load dishes', err);
    }
    finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadData();
  }, [loadData]);
  const filteredDishes = useMemo(() => {
    return dishes.filter((d) => {
      const matchesCategory = categoryFilter === 'All' || d.category.toLowerCase() === categoryFilter.toLowerCase();
      const matchesSearch = d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (d.amharicName && d.amharicName.includes(searchQuery)) ||
        d.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [dishes, categoryFilter, searchQuery]);
  const handleSave = async (dishData, id) => {
    if (id) {
      await updateDish(id, dishData);
    }
    else {
      await addDish(dishData);
    }
    await loadData();
  };
  const confirmDelete = async () => {
    if (!deletingDish)
      return;
    try {
      await deleteDish(deletingDish.id);
      setDeletingDish(null);
      await loadData();
    }
    catch (err) {
      console.error('Failed to delete dish', err);
    }
  };
  const handleToggleAvailability = async (id) => {
    try {
      await toggleDishAvailability(id);
      setDishes((prev) => prev.map((d) => (d.id === id ? { ...d, available: !d.available } : d)));
    }
    catch (err) {
      console.error('Failed to toggle availability', err);
    }
  };
  return (<div className="max-w-7xl mx-auto space-y-6">
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-[#D9381E]">
          Menu Operations
        </span>
        <h1 className="text-3xl font-extrabold text-stone-900 dark:text-stone-100 font-sans-display">
          Dishes Management ({dishes.length})
        </h1>
        <p className="text-xs text-stone-500 mt-1">
          Add new Ethiopian or modern recipes, edit prices in ETB, and toggle stock availability.
        </p>
      </div>
      <Button onClick={() => {
        setEditingDish(null);
        setIsFormOpen(true);
      }} size="sm" className="shadow-md">
        <Plus className="w-4 h-4 mr-1.5" /> Add New Dish
      </Button>
    </div>
    <div className="bg-white dark:bg-stone-900 rounded-2xl p-4 border border-stone-200/80 dark:border-stone-800 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
      <div className="relative w-full sm:w-80">
        <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input type="text" placeholder="Search dish by name or description..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-[#D9381E]" />
      </div>
      <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
        <Filter className="w-3.5 h-3.5 text-stone-400 shrink-0" />
        {['All', 'Ethiopian', 'Pizza', 'Burgers', 'Beverages', 'Desserts'].map((cat) => (<button key={cat} onClick={() => setCategoryFilter(cat)} className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap cursor-pointer transition-all ${categoryFilter === cat
          ? 'bg-[#D9381E] text-white shadow-xs'
          : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200'}`}>
          {cat}
        </button>))}
      </div>
    </div>
    {loading ? (<div className="py-20 flex items-center justify-center">
      <Spinner size="lg" label="Loading dishes..." />
    </div>) : filteredDishes.length === 0 ? (<div className="bg-white dark:bg-stone-900 rounded-3xl p-12 text-center border border-dashed border-stone-200 dark:border-stone-800">
      <p className="text-sm font-bold text-stone-700 dark:text-stone-300">
        No dishes match your filter
      </p>
      <p className="text-xs text-stone-400 mt-1">Try clearing your search query or add a new dish.</p>
    </div>) : (<div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200/80 dark:border-stone-800 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-stone-50 dark:bg-stone-800/60 border-b border-stone-200 dark:border-stone-700 text-[11px] font-bold text-stone-500 uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4">Dish</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Price (ETB)</th>
              <th className="px-6 py-4">Prep Time</th>
              <th className="px-6 py-4">Availability</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
            {filteredDishes.map((dish) => (<tr key={dish.id} className="hover:bg-stone-50/60 dark:hover:bg-stone-800/40 transition-colors">
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-stone-100 shrink-0 border border-stone-200 dark:border-stone-700">
                    <img src={dish.image} alt={dish.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <div>
                    <span className="font-bold text-stone-900 dark:text-stone-100 text-sm block">
                      {dish.name}
                    </span>
                    {dish.amharicName && (<span className="text-[11px] text-[#D9381E] font-semibold block">
                      {dish.amharicName}
                    </span>)}
                    <div className="flex items-center gap-1 mt-1">
                      {dish.isSpicy && (<span className="p-0.5 rounded bg-rose-50 dark:bg-rose-950/50 text-rose-500" title="Spicy">
                        <Flame className="w-3 h-3" />
                      </span>)}
                      {dish.isVegetarian && (<span className="p-0.5 rounded bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600" title="Vegetarian">
                        <Leaf className="w-3 h-3" />
                      </span>)}
                      {dish.isSpecial && <Badge variant="primary" size="sm">Special</Badge>}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <Badge variant="neutral" size="sm">{dish.category}</Badge>
              </td>
              <td className="px-6 py-4 font-extrabold text-stone-900 dark:text-stone-100 text-sm">
                {formatCurrency(dish.price)}
              </td>
              <td className="px-6 py-4 text-stone-500">
                {dish.prepTime || '20 min'}
              </td>
              <td className="px-6 py-4">
                <button onClick={() => handleToggleAvailability(dish.id)} className={`px-3 py-1 rounded-full text-[11px] font-bold inline-flex items-center gap-1.5 transition-all cursor-pointer ${dish.available !== false
                  ? 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300'
                  : 'bg-rose-100 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300'}`} title="Click to toggle availability">
                  {dish.available !== false ? (<>
                    <Check className="w-3 h-3" /> In Stock
                  </>) : (<>
                    <X className="w-3 h-3" /> Sold Out
                  </>)}
                </button>
              </td>
              <td className="px-6 py-4 text-right">
                <div className="flex items-center justify-end gap-2">
                  <button onClick={() => {
                    setEditingDish(dish);
                    setIsFormOpen(true);
                  }} className="p-1.5 rounded-lg text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 hover:text-[#D9381E] transition-colors cursor-pointer" title="Edit Dish">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => setDeletingDish(dish)} className="p-1.5 rounded-lg text-stone-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 hover:text-rose-600 transition-colors cursor-pointer" title="Delete Dish">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>))}
          </tbody>
        </table>
      </div>
    </div>)}
    <DishForm isOpen={isFormOpen} onClose={() => {
      setIsFormOpen(false);
      setEditingDish(null);
    }} onSave={handleSave} initialDish={editingDish} />
    {deletingDish && (<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 max-w-sm w-full border border-stone-200 dark:border-stone-800 shadow-2xl space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center mx-auto">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <div className="text-center">
          <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
            Delete "{deletingDish.name}"?
          </h3>
          <p className="text-xs text-stone-500 mt-1">
            Are you sure you want to remove this dish from the menu? This action cannot be undone.
          </p>
        </div>
        <div className="flex items-center gap-3 pt-2">
          <Button variant="outline" size="sm" className="w-full" onClick={() => setDeletingDish(null)}>
            Cancel
          </Button>
          <Button variant="danger" size="sm" className="w-full" onClick={confirmDelete}>
            Delete Dish
          </Button>
        </div>
      </div>
    </div>)}
  </div>);
};
