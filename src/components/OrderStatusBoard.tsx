import React, { useState } from 'react';
import { 
  Tv, 
  CheckCircle2, 
  Clock, 
  Search, 
  Sparkles, 
  Utensils, 
  BellRing,
  ArrowRight,
  PackageCheck
} from 'lucide-react';
import { useOrderSystem } from '../context/OrderSystemContext';

export const OrderStatusBoard: React.FC = () => {
  const { 
    preparingOrders, 
    readyOrders, 
    completedOrders, 
    queue, 
    markOrderCompleted,
    soundEnabled,
    getOrderQueuePosition
  } = useOrderSystem();

  const [lookupQuery, setLookupQuery] = useState<string>('');
  const [selectedTicketNumber, setSelectedTicketNumber] = useState<number | null>(null);

  // Combine all active orders for lookup
  const allKnownOrders = [
    ...readyOrders,
    ...preparingOrders,
    ...queue,
    ...completedOrders
  ];

  const foundOrder = selectedTicketNumber
    ? allKnownOrders.find(o => o.ticketNumber === selectedTicketNumber)
    : lookupQuery.trim()
      ? allKnownOrders.find(o => o.ticketNumber.toString() === lookupQuery.trim() || o.customerName.toLowerCase().includes(lookupQuery.toLowerCase()))
      : null;

  return (
    <div className="space-y-6">
      {/* Top Header & Customer Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 bg-white border border-neutral-200 rounded-xl">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-neutral-900 tracking-tight">
              Live Order Pickup Board
            </h1>
            <span className="text-xs font-mono font-medium text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
              Public Display
            </span>
          </div>
          <p className="text-xs text-neutral-500 mt-0.5">
            Real-time kitchen status · Listen for audio chime when your ticket is ready
          </p>
        </div>

        {/* Ticket Lookup input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Track your ticket # (e.g. 101)..."
            value={lookupQuery}
            onChange={(e) => {
              setLookupQuery(e.target.value);
              setSelectedTicketNumber(null);
            }}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900 font-mono"
          />
        </div>
      </div>

      {/* Customer Ticket Spotlight (if searched or clicked) */}
      {foundOrder && (
        <div className="p-5 bg-neutral-900 text-white rounded-xl shadow-md space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-800 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-neutral-400">STATUS SPOTLIGHT</span>
                <span className="font-mono text-2xl font-black text-amber-400">
                  Ticket #{foundOrder.ticketNumber}
                </span>
              </div>
              <div className="text-xs text-neutral-300 mt-1">
                Customer: <strong>{foundOrder.customerName}</strong> ·{' '}
                <span className="capitalize">{foundOrder.orderType}</span>
                {foundOrder.tableNumber && ` · Table ${foundOrder.tableNumber}`}
              </div>
            </div>

            <div className="text-right">
              <span className={`text-xs uppercase font-mono font-bold px-3 py-1 rounded ${
                foundOrder.status === 'ready'
                  ? 'bg-emerald-500 text-black animate-pulse'
                  : foundOrder.status === 'preparing'
                  ? 'bg-amber-500 text-black'
                  : foundOrder.status === 'completed'
                  ? 'bg-neutral-700 text-neutral-200'
                  : 'bg-neutral-800 text-neutral-300'
              }`}>
                {foundOrder.status === 'ready' ? 'Ready for Pickup!' : foundOrder.status}
              </span>
            </div>
          </div>

          {/* Stepper Progress */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 pt-1">
            {/* Step 1 */}
            <div className={`p-3 rounded-lg border text-xs ${
              queue.some(o => o.id === foundOrder.id)
                ? 'bg-amber-950/40 border-amber-500 text-amber-200'
                : 'bg-neutral-800/80 border-neutral-700 text-neutral-400'
            }`}>
              <div className="font-mono font-bold">1. Enqueued (FIFO)</div>
              <div className="text-[11px] mt-0.5">
                {queue.some(o => o.id === foundOrder.id)
                  ? `Position #${getOrderQueuePosition(foundOrder.id)} in queue`
                  : 'Queue step completed'}
              </div>
            </div>

            {/* Step 2 */}
            <div className={`p-3 rounded-lg border text-xs ${
              foundOrder.status === 'preparing'
                ? 'bg-orange-950/40 border-orange-500 text-orange-200'
                : foundOrder.status === 'ready' || foundOrder.status === 'completed'
                ? 'bg-neutral-800/80 border-neutral-700 text-neutral-400'
                : 'bg-neutral-800/40 border-neutral-800 text-neutral-600'
            }`}>
              <div className="font-mono font-bold">2. Cooking in Kitchen</div>
              <div className="text-[11px] mt-0.5">
                {foundOrder.status === 'preparing'
                  ? `Progress: ${Math.round(foundOrder.prepProgress)}%`
                  : foundOrder.status === 'pending'
                  ? 'Waiting for station'
                  : 'Cooking finished'}
              </div>
            </div>

            {/* Step 3 */}
            <div className={`p-3 rounded-lg border text-xs ${
              foundOrder.status === 'ready'
                ? 'bg-emerald-950/40 border-emerald-500 text-emerald-200 ring-1 ring-emerald-500'
                : foundOrder.status === 'completed'
                ? 'bg-neutral-800/80 border-neutral-700 text-neutral-400'
                : 'bg-neutral-800/40 border-neutral-800 text-neutral-600'
            }`}>
              <div className="font-mono font-bold">3. Ready on Counter</div>
              <div className="text-[11px] mt-0.5">
                {foundOrder.status === 'ready'
                  ? 'Ready for pickup!'
                  : 'Awaiting completion'}
              </div>
            </div>

            {/* Step 4 */}
            <div className={`p-3 rounded-lg border text-xs ${
              foundOrder.status === 'completed'
                ? 'bg-neutral-800 border-neutral-600 text-white'
                : 'bg-neutral-800/40 border-neutral-800 text-neutral-600'
            }`}>
              <div className="font-mono font-bold">4. Picked Up</div>
              <div className="text-[11px] mt-0.5">
                {foundOrder.status === 'completed' ? 'Order cleared' : 'Pending handover'}
              </div>
            </div>
          </div>

          {/* Action button if ready */}
          {foundOrder.status === 'ready' && (
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => markOrderCompleted(foundOrder.id)}
                className="px-4 py-2 text-xs font-bold text-neutral-900 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors inline-flex items-center gap-1.5"
              >
                <PackageCheck className="w-4 h-4" />
                <span>Confirm Order Picked Up</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Split Screen TV Monitor: Preparing (Left) vs Ready (Right) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Left Column: PREPARING (Cooking) */}
        <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-xs">
          <div className="p-4 bg-neutral-900 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" />
              <h2 className="text-sm font-bold tracking-wider uppercase font-mono">
                Now Preparing ({preparingOrders.length})
              </h2>
            </div>
            <span className="text-xs text-neutral-400 font-mono">
              In Kitchen
            </span>
          </div>

          <div className="p-4">
            {preparingOrders.length === 0 ? (
              <div className="text-center py-12 text-neutral-400">
                <p className="text-xs font-mono">No active kitchen orders</p>
                <p className="text-[11px] text-neutral-500 mt-1">
                  Orders will appear here once dequeued from the FIFO queue
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {preparingOrders.map((order) => (
                  <button
                    key={order.id}
                    onClick={() => setSelectedTicketNumber(order.ticketNumber)}
                    className="p-3 bg-neutral-50 hover:bg-amber-50/60 border border-neutral-200 hover:border-amber-300 rounded-xl text-center transition-all group"
                  >
                    <div className="font-mono text-2xl font-black text-neutral-900 group-hover:text-amber-800">
                      #{order.ticketNumber}
                    </div>
                    <div className="text-xs font-medium text-neutral-600 truncate mt-1">
                      {order.customerName}
                    </div>
                    <div className="text-[11px] font-mono text-amber-700 mt-0.5">
                      {Math.round(order.prepProgress)}% cooked
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: READY FOR PICKUP */}
        <div className="bg-white border border-emerald-300 rounded-xl overflow-hidden shadow-xs ring-1 ring-emerald-500/20">
          <div className="p-4 bg-emerald-900 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BellRing className="w-4 h-4 text-emerald-300 animate-bounce" />
              <h2 className="text-sm font-bold tracking-wider uppercase font-mono text-emerald-200">
                Ready for Pickup ({readyOrders.length})
              </h2>
            </div>
            <span className="text-xs text-emerald-300 font-mono">
              Collect at Counter
            </span>
          </div>

          <div className="p-4">
            {readyOrders.length === 0 ? (
              <div className="text-center py-12 text-neutral-400">
                <p className="text-xs font-mono">Counter is clear</p>
                <p className="text-[11px] text-neutral-500 mt-1">
                  Completed dishes will be announced here immediately
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {readyOrders.map((order) => (
                  <div
                    key={order.id}
                    className="relative p-3 bg-emerald-50/80 border-2 border-emerald-400 rounded-xl text-center shadow-xs flex flex-col justify-between"
                  >
                    <div>
                      <div className="font-mono text-3xl font-black text-emerald-950">
                        #{order.ticketNumber}
                      </div>
                      <div className="text-xs font-bold text-neutral-900 truncate mt-1">
                        {order.customerName}
                      </div>
                      <div className="text-[11px] text-emerald-800 capitalize mt-0.5 font-medium">
                        {order.orderType} {order.tableNumber ? `(${order.tableNumber})` : ''}
                      </div>
                    </div>

                    <button
                      onClick={() => markOrderCompleted(order.id)}
                      className="mt-3 w-full py-1 text-[11px] font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded transition-colors"
                    >
                      Picked Up
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Historical Completed Orders Ledger */}
      {completedOrders.length > 0 && (
        <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-xs space-y-3">
          <h3 className="text-sm font-bold text-neutral-900">
            Recently Fulfilled Orders ({completedOrders.length})
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-neutral-200 text-neutral-500 font-mono">
                  <th className="py-2 pr-4">Ticket</th>
                  <th className="py-2 pr-4">Customer</th>
                  <th className="py-2 pr-4">Items</th>
                  <th className="py-2 pr-4">Total</th>
                  <th className="py-2 pr-4">Placed At</th>
                  <th className="py-2">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {completedOrders.slice(0, 10).map((ord) => (
                  <tr key={ord.id} className="hover:bg-neutral-50 font-mono">
                    <td className="py-2 pr-4 font-bold text-neutral-900">#{ord.ticketNumber}</td>
                    <td className="py-2 pr-4 font-sans text-neutral-800">{ord.customerName}</td>
                    <td className="py-2 pr-4 text-neutral-600">{ord.items.length} items</td>
                    <td className="py-2 pr-4 tabular-nums">${ord.totalAmount.toFixed(2)}</td>
                    <td className="py-2 pr-4 text-neutral-500 text-[11px]">
                      {new Date(ord.placedAt).toLocaleTimeString()}
                    </td>
                    <td className="py-2">
                      <span className="text-emerald-700 font-semibold">Picked Up</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
