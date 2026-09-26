import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { AlertCircle, Flame, Leaf, Star } from 'lucide-react';
export const DishForm = ({ isOpen, onClose, onSave, initialDish, }) => {
  const [name, setName] = useState('');
  const [amharicName, setAmharicName] = useState('');
  const [category, setCategory] = useState('Ethiopian');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [prepTime, setPrepTime] = useState('20-30 min');
  const [isSpicy, setIsSpicy] = useState(false);
  const [isVegetarian, setIsVegetarian] = useState(false);
  const [isSpecial, setIsSpecial] = useState(false);
  const [available, setAvailable] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  useEffect(() => {
    if (initialDish) {
      setName(initialDish.name);
      setAmharicName(initialDish.amharicName || '');
      setCategory(initialDish.category);
      setPrice(initialDish.price.toString());
      setDescription(initialDish.description);
      setImage(initialDish.image);
      setPrepTime(initialDish.prepTime || '20-30 min');
      setIsSpicy(!!initialDish.isSpicy);
      setIsVegetarian(!!initialDish.isVegetarian);
      setIsSpecial(!!initialDish.isSpecial);
      setAvailable(initialDish.available !== false);
    }
    else {
      setName('');
      setAmharicName('');
      setCategory('Ethiopian');
      setPrice('');
      setDescription('');
      setImage('/assets/pizza.png');
      setPrepTime('20-30 min');
      setIsSpicy(false);
      setIsVegetarian(false);
      setIsSpecial(false);
      setAvailable(true);
    }
    setError('');
  }, [initialDish]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Dish name is required.');
      return;
    }
    const numPrice = parseFloat(price);
    if (isNaN(numPrice) || numPrice <= 0) {
      setError('Please provide a valid price in ETB.');
      return;
    }
    if (!description.trim()) {
      setError('Description is required.');
      return;
    }
    if (!image.trim()) {
      setError('Image URL is required.');
      return;
    }
    setSaving(true);
    try {
      await onSave({
        name: name.trim(),
        amharicName: amharicName.trim() || undefined,
        category,
        price: numPrice,
        description: description.trim(),
        image: image.trim(),
        prepTime,
        isSpicy,
        isVegetarian,
        isSpecial,
        available,
        rating: initialDish?.rating || 4.8,
        ingredients: initialDish?.ingredients || [],
      }, initialDish?.id);
      onClose();
    }
    catch (err) {
      setError(err.message || 'Failed to save dish');
    }
    finally {
      setSaving(false);
    }
  };
  return (<Modal isOpen={isOpen} onClose={onClose} title={initialDish ? `Edit ${initialDish.name}` : 'Add New Menu Dish'}>
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (<div className="p-3 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 rounded-xl text-xs flex items-center gap-2">
        <AlertCircle className="w-4 h-4 shrink-0" />
        <span>{error}</span>
      </div>)}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1">
            Dish Name (English) *
          </label>
          <input type="text" required placeholder="e.g. Shekla Tibs" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3.5 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-xs focus:outline-none focus:ring-2 focus:ring-[#D9381E]" />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1">
            Amharic Name (Optional)
          </label>
          <input type="text" placeholder="e.g. የሸክላ ጥብስ" value={amharicName} onChange={(e) => setAmharicName(e.target.value)} className="w-full px-3.5 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-xs focus:outline-none focus:ring-2 focus:ring-[#D9381E]" />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1">
            Category *
          </label>
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-xs focus:outline-none focus:ring-2 focus:ring-[#D9381E]">
            <option value="Ethiopian">Ethiopian</option>
            <option value="Pizza">Pizza</option>
            <option value="Burgers">Burgers</option>
            <option value="Beverages">Beverages</option>
            <option value="Desserts">Desserts</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1">
            Price (ETB) *
          </label>
          <input type="number" required min="1" step="1" placeholder="e.g. 450" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-xs focus:outline-none focus:ring-2 focus:ring-[#D9381E]" />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1">
            Prep Time
          </label>
          <input type="text" placeholder="e.g. 25 min" value={prepTime} onChange={(e) => setPrepTime(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-xs focus:outline-none focus:ring-2 focus:ring-[#D9381E]" />
        </div>
      </div>
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1">
          Image URL *
        </label>
        <input type="url" required placeholder="/assets/pizza.png" value={image} onChange={(e) => setImage(e.target.value)} className="w-full px-3.5 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-xs focus:outline-none focus:ring-2 focus:ring-[#D9381E]" />
      </div>
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1">
          Description *
        </label>
        <textarea rows={3} required placeholder="A mouthwatering description of spices, ingredients, and preparation style..." value={description} onChange={(e) => setDescription(e.target.value)} className="w-full p-3 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-xs focus:outline-none focus:ring-2 focus:ring-[#D9381E] resize-none" />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-stone-100 dark:border-stone-800">
        <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold">
          <input type="checkbox" checked={isSpicy} onChange={(e) => setIsSpicy(e.target.checked)} className="rounded text-[#D9381E] focus:ring-[#D9381E]" />
          <span className="flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 text-rose-500" /> Spicy
          </span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold">
          <input type="checkbox" checked={isVegetarian} onChange={(e) => setIsVegetarian(e.target.checked)} className="rounded text-[#D9381E] focus:ring-[#D9381E]" />
          <span className="flex items-center gap-1">
            <Leaf className="w-3.5 h-3.5 text-emerald-600" /> Vegetarian
          </span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold">
          <input type="checkbox" checked={isSpecial} onChange={(e) => setIsSpecial(e.target.checked)} className="rounded text-[#D9381E] focus:ring-[#D9381E]" />
          <span className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 text-amber-500" /> Special
          </span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold">
          <input type="checkbox" checked={available} onChange={(e) => setAvailable(e.target.checked)} className="rounded text-[#D9381E] focus:ring-[#D9381E]" />
          <span>In Stock</span>
        </label>
      </div>
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-100 dark:border-stone-800">
        <Button type="button" variant="outline" size="sm" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" size="sm" isLoading={saving}>
          {initialDish ? 'Save Changes' : 'Create Dish'}
        </Button>
      </div>
    </form>
  </Modal>);
};
DishForm.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  initialDish: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    amharicName: PropTypes.string,
    category: PropTypes.string,
    price: PropTypes.number,
    description: PropTypes.string,
    image: PropTypes.string,
    prepTime: PropTypes.string,
    rating: PropTypes.number,
    ingredients: PropTypes.arrayOf(PropTypes.string),
    isSpicy: PropTypes.bool,
    isVegetarian: PropTypes.bool,
    isSpecial: PropTypes.bool,
    available: PropTypes.bool,
  }),
};
