import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Plus, 
  Minus, 
  Clock, 
  Utensils, 
  Check, 
  Flame, 
  Sparkles, 
  ArrowRight,
  Search,
  User,
  Coffee,
  Receipt
} from 'lucide-react';
import { MENU_ITEMS, CATEGORIES } from '../data/menuData';
import { MenuItem, OrderItem, OrderType, Order } from '../types/order';
import { useOrderSystem } from '../context/OrderSystemContext';

interface CustomerOrderingProps {
  onOrderPlacedSuccess?: (order: Order) => void;
}

export const CustomerOrdering: React.FC<CustomerOrderingProps> = ({ onOrderPlacedSuccess }) => {
  const { placeOrder, queue, averageWaitMinutes } = useOrderSystem();

  // Filter & Search
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Cart State
  const [cart, setCart] = useState<{ [itemId: string]: { item: MenuItem; quantity: number; notes: string } }>({
    'm1': { item: MENU_ITEMS[0], quantity: 1, notes: '' },
    'm4': { item: MENU_ITEMS[3], quantity: 1, notes: '' }
  });

  // Customer details
  const [customerName, setCustomerName] = useState<string>('Alex Rivera');
  const [orderType, setOrderType] = useState<OrderType>('dine-in');
  const [tableNumber, setTableNumber] = useState<string>('T-05');
  const [lastPlacedOrder, setLastPlacedOrder] = useState<Order | null>(null);

  const filteredItems = MENU_ITEMS.filter(item => {
    const matchesCat = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const cartList = Object.values(cart);
  const cartSubtotal = cartList.reduce((sum, entry) => sum + entry.item.price * entry.quantity, 0);
  const tax = cartSubtotal * 0.0825;
  const cartTotal = cartSubtotal + tax;
  const totalItemCount = cartList.reduce((sum, entry) => sum + entry.quantity, 0);

  const addToCart = (item: MenuItem) => {
    setCart(prev => {
      const existing = prev[item.id];
      if (existing) {
        return {
          ...prev,
          [item.id]: { ...existing, quantity: existing.quantity + 1 }
        };
      }
      return {
        ...prev,
        [item.id]: { item, quantity: 1, notes: '' }
      };
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart(prev => {
      const existing = prev[itemId];
      if (!existing) return prev;
      if (existing.quantity <= 1) {
        const copy = { ...prev };
        delete copy[itemId];
        return copy;
      }
      return {
        ...prev,
        [itemId]: { ...existing, quantity: existing.quantity - 1 }
      };
    });
  };

  const updateNotes = (itemId: string, notes: string) => {
    setCart(prev => {
      const existing = prev[itemId];
      if (!existing) return prev;
      return {
        ...prev,
        [itemId]: { ...existing, notes }
      };
    });
  };

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (cartList.length === 0) return;

    const orderItems: OrderItem[] = cartList.map(entry => ({
      menuItem: entry.item,
      quantity: entry.quantity,
      specialInstructions: entry.notes.trim() || undefined
    }));

    const newOrder = placeOrder({
      customerName: customerName.trim() || 'Guest Customer',
      orderType,
      tableNumber: orderType === 'dine-in' ? tableNumber : undefined,
      items: orderItems
    });

    setLastPlacedOrder(newOrder);
    setCart({}); // clear cart
    if (onOrderPlacedSuccess) {
      onOrderPlacedSuccess(newOrder);
    }
  };

  return (
    <div className="space-y-6">
      {/* Success Notification Modal / Card if order was just placed */}
      {lastPlacedOrder && (
        <div className="p-5 bg-amber-50 border border-amber-300 rounded-xl shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-lg font-bold text-neutral-950 bg-white border border-amber-200 px-2 py-0.5 rounded">
                Ticket #{lastPlacedOrder.ticketNumber}
              </span>
              <span className="text-xs font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                Enqueued at Queue Tail (FIFO O(1))
              </span>
            </div>
            <p className="text-xs text-neutral-700">
              Thank you, <strong>{lastPlacedOrder.customerName}</strong>! Your order has been registered in the kitchen queue.
              You are currently <strong>#{queue.findIndex(o => o.id === lastPlacedOrder.id) + 1 || 'next'}</strong> in line.
            </p>
          </div>

          <button
            onClick={() => setLastPlacedOrder(null)}
            className="px-3 py-1.5 text-xs font-medium text-neutral-800 bg-white hover:bg-neutral-100 border border-neutral-300 rounded-lg transition-colors whitespace-nowrap"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main Layout: Menu Catalog & Interactive Cart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Food Menu Catalog (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Header & Search */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
                Artisan Kitchen Menu
              </h1>
              <p className="text-xs text-neutral-500 mt-0.5">
                Freshly prepared to order · Strict FIFO kitchen queue sequence
              </p>
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search dishes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900"
              />
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap shrink-0 ${
                  selectedCategory === cat.id
                    ? 'bg-neutral-900 text-white shadow-xs'
                    : 'bg-white text-neutral-600 border border-neutral-200 hover:text-neutral-900 hover:bg-neutral-50'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Menu Items Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredItems.map((item) => {
              const inCart = cart[item.id]?.quantity || 0;

              return (
                <div
                  key={item.id}
                  className="group bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-xs hover:border-neutral-300 transition-all flex flex-col justify-between"
                >
                  {/* Food Image with Fallback Container */}
                  <div className="relative aspect-[4/3] w-full bg-neutral-100 overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                      onError={(e) => {
                        // Resilient fallback container if image fails
                        const target = e.currentTarget;
                        target.style.display = 'none';
                        const parent = target.parentElement;
                        if (parent) {
                          parent.classList.add('flex', 'items-center', 'justify-center', 'bg-neutral-800', 'text-neutral-300');
                          parent.innerHTML = `<span class="text-xs font-mono">${item.name}</span>`;
                        }
                      }}
                    />
                    <div className="absolute top-2.5 right-2.5 bg-neutral-900/80 backdrop-blur-xs text-white text-xs font-mono font-semibold px-2 py-0.5 rounded">
                      ${item.price.toFixed(2)}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-sm font-bold text-neutral-900 leading-tight">
                          {item.name}
                        </h3>
                      </div>

                      <p className="text-xs text-neutral-600 mt-1 line-clamp-2">
                        {item.description}
                      </p>

                      {/* Unboxed Metadata with separators */}
                      <div className="flex items-center gap-2 text-[11px] text-neutral-500 mt-2 font-mono">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-neutral-400" />
                          ~{item.prepTimeSeconds}s cook
                        </span>
                        {item.calories && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span>{item.calories} kcal</span>
                          </>
                        )}
                        {item.dietary && item.dietary.length > 0 && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span className="capitalize">{item.dietary[0]}</span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Add to Cart Actions */}
                    <div className="pt-2 border-t border-neutral-100 flex items-center justify-between">
                      {inCart > 0 ? (
                        <div className="flex items-center gap-2 bg-neutral-100 rounded-lg p-0.5">
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="p-1 hover:bg-white rounded transition-colors text-neutral-700"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="font-mono text-xs font-bold text-neutral-900 px-2">
                            {inCart}
                          </span>
                          <button
                            onClick={() => addToCart(item)}
                            className="p-1 hover:bg-white rounded transition-colors text-neutral-700"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-neutral-500 font-medium">Ready to cook</span>
                      )}

                      <button
                        onClick={() => addToCart(item)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-neutral-900 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Cart & Queue Enqueue Checkout (4 cols) */}
        <div className="lg:col-span-4 bg-white border border-neutral-200 rounded-xl p-5 shadow-xs sticky top-20 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
            <h2 className="text-base font-bold text-neutral-900 flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-amber-600" />
              <span>Current Order</span>
            </h2>
            <span className="text-xs font-mono font-medium text-neutral-600 bg-neutral-100 px-2 py-0.5 rounded">
              {totalItemCount} {totalItemCount === 1 ? 'item' : 'items'}
            </span>
          </div>

          {/* Queue Wait Time Estimator Banner */}
          <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-lg space-y-1 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-neutral-600">Pending Queue Ahead:</span>
              <strong className="font-mono text-neutral-900">{queue.length} orders</strong>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-neutral-600">Your Enqueue Position:</span>
              <strong className="font-mono text-amber-700">#{queue.length + 1} (Rear)</strong>
            </div>
            <div className="flex items-center justify-between pt-1 border-t border-neutral-200">
              <span className="text-neutral-600">Estimated Total Wait:</span>
              <strong className="font-mono text-neutral-900">~{averageWaitMinutes} mins</strong>
            </div>
          </div>

          {/* Cart Items List */}
          <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
            {cartList.length === 0 ? (
              <div className="text-center py-8 text-neutral-400">
                <Coffee className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-xs font-medium">Your tray is empty</p>
                <p className="text-[11px] text-neutral-500 mt-0.5">
                  Select dishes from the menu to enqueue
                </p>
              </div>
            ) : (
              cartList.map(({ item, quantity, notes }) => (
                <div key={item.id} className="p-3 bg-neutral-50 rounded-lg border border-neutral-100 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="text-xs font-bold text-neutral-900">{item.name}</div>
                      <div className="text-[11px] text-neutral-500 font-mono">
                        ${item.price.toFixed(2)} each
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1.5 bg-white rounded border border-neutral-200 p-0.5">
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-0.5 hover:bg-neutral-100 rounded text-neutral-600"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="font-mono text-xs font-bold px-1.5">{quantity}</span>
                      <button
                        onClick={() => addToCart(item)}
                        className="p-0.5 hover:bg-neutral-100 rounded text-neutral-600"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {/* Special instruction notes */}
                  <input
                    type="text"
                    placeholder="Add special notes (e.g. extra spicy)..."
                    value={notes}
                    onChange={(e) => updateNotes(item.id, e.target.value)}
                    className="w-full text-[11px] px-2 py-1 bg-white border border-neutral-200 rounded focus:outline-none focus:ring-1 focus:ring-neutral-900"
                  />
                </div>
              ))
            )}
          </div>

          {/* Checkout Form */}
          <form onSubmit={handleCheckout} className="space-y-4 pt-2 border-t border-neutral-100">
            {/* Customer Name */}
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">
                Customer Name
              </label>
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="e.g. Sarah Connor"
                className="w-full px-3 py-1.5 text-xs bg-white border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900"
              />
            </div>

            {/* Dining Options */}
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">
                Dining Option
              </label>
              <div className="grid grid-cols-3 gap-1.5 text-xs">
                {(['dine-in', 'takeout', 'delivery'] as OrderType[]).map((type) => (
                  <button
                    type="button"
                    key={type}
                    onClick={() => setOrderType(type)}
                    className={`py-1.5 rounded-lg border text-center capitalize transition-colors font-medium ${
                      orderType === type
                        ? 'bg-neutral-900 text-white border-neutral-900'
                        : 'bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-50'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Table Number if Dine-in */}
            {orderType === 'dine-in' && (
              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">
                  Table Number
                </label>
                <select
                  value={tableNumber}
                  onChange={(e) => setTableNumber(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900"
                >
                  <option value="T-01">Table 01 (Patio)</option>
                  <option value="T-02">Table 02 (Window)</option>
                  <option value="T-03">Table 03 (Booth)</option>
                  <option value="T-04">Table 04 (Main Hall)</option>
                  <option value="T-05">Table 05 (Bar Counter)</option>
                </select>
              </div>
            )}

            {/* Price Breakdown */}
            <div className="space-y-1 pt-2 border-t border-neutral-100 text-xs">
              <div className="flex justify-between text-neutral-600">
                <span>Subtotal:</span>
                <span className="font-mono tabular-nums">${cartSubtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-neutral-600">
                <span>Tax (8.25%):</span>
                <span className="font-mono tabular-nums">${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-neutral-900 pt-1 border-t border-neutral-100">
                <span>Total:</span>
                <span className="font-mono tabular-nums">${cartTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Submit Primary CTA */}
            <button
              type="submit"
              disabled={cartList.length === 0}
              className="w-full py-2.5 px-4 text-xs font-bold text-white bg-neutral-900 hover:bg-neutral-800 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg shadow-sm transition-all flex items-center justify-center gap-2"
            >
              <Receipt className="w-3.5 h-3.5" />
              <span>Confirm & Enqueue Order (FIFO O(1))</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
