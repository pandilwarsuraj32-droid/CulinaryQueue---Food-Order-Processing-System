import React from 'react';
import { 
  Flame, 
  Clock, 
  ArrowRight, 
  CheckCircle2, 
  Play, 
  Pause, 
  FastForward, 
  UtensilsCrossed, 
  Zap, 
  AlertCircle,
  Timer,
  ChefHat
} from 'lucide-react';
import { useOrderSystem } from '../context/OrderSystemContext';
import { Order } from '../types/order';

export const KitchenDisplaySystem: React.FC = () => {
  const {
    queue,
    preparingOrders,
    readyOrders,
    dequeueNextToKitchen,
    advanceOrderToReady,
    markOrderCompleted,
    cancelOrder,
    isAutoSimulating,
    toggleAutoSimulating,
    autoProcessKitchen,
    toggleAutoProcessKitchen,
    simSpeed,
    setSimSpeed,
    addQuickSampleOrder,
    averageWaitMinutes,
    totalCompletedCount
  } = useOrderSystem();

  const headOrder: Order | undefined = queue[0];
  const tailOrder: Order | undefined = queue[queue.length - 1];

  return (
    <div className="space-y-6">
      {/* KDS Header & Operations Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-5 bg-white border border-neutral-200 rounded-xl">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-neutral-900 tracking-tight">
              Kitchen Display System (KDS)
            </h1>
            <span className="text-xs font-mono font-medium text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
              FIFO Strict Mode
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-neutral-500 mt-1">
            <span>Enqueued: <strong className="font-mono text-neutral-800">{queue.length}</strong></span>
            <span aria-hidden="true">·</span>
            <span>In Kitchen: <strong className="font-mono text-neutral-800">{preparingOrders.length}</strong></span>
            <span aria-hidden="true">·</span>
            <span>Ready for Pickup: <strong className="font-mono text-neutral-800">{readyOrders.length}</strong></span>
            <span aria-hidden="true">·</span>
            <span>Est. Wait: <strong className="font-mono text-neutral-800">~{averageWaitMinutes}m</strong></span>
          </div>
        </div>

        {/* Operational Controls & Rush Simulation */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Rush Hour Auto Traffic Toggle */}
          <button
            onClick={toggleAutoSimulating}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
              isAutoSimulating
                ? 'bg-amber-50 text-amber-900 border-amber-300 shadow-xs'
                : 'bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-50'
            }`}
            title="Automatically generates customer incoming traffic"
          >
            {isAutoSimulating ? <Pause className="w-3.5 h-3.5 text-amber-600" /> : <Play className="w-3.5 h-3.5 text-neutral-500" />}
            <span>Rush Traffic: {isAutoSimulating ? 'Active' : 'Off'}</span>
          </button>

          {/* Kitchen Auto-Cook Cooker Toggle */}
          <button
            onClick={toggleAutoProcessKitchen}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
              autoProcessKitchen
                ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                : 'bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-50'
            }`}
            title="Auto-cooks and advances tickets when kitchen has capacity"
          >
            <ChefHat className={`w-3.5 h-3.5 ${autoProcessKitchen ? 'text-emerald-600' : 'text-neutral-500'}`} />
            <span>Auto-Cook: {autoProcessKitchen ? 'On' : 'Manual'}</span>
          </button>

          {/* Speed Selector */}
          <div className="inline-flex items-center bg-neutral-100 rounded-lg p-0.5 text-xs font-medium text-neutral-600">
            {[1, 2, 5].map((speed) => (
              <button
                key={speed}
                onClick={() => setSimSpeed(speed)}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  simSpeed === speed
                    ? 'bg-white text-neutral-900 shadow-xs font-semibold'
                    : 'hover:text-neutral-900'
                }`}
              >
                {speed}x
              </button>
            ))}
          </div>

          {/* Quick Order Injection */}
          <button
            onClick={addQuickSampleOrder}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-800 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors border border-neutral-200"
          >
            <Zap className="w-3.5 h-3.5 text-amber-600" />
            <span>+ Random Customer Order</span>
          </button>
        </div>
      </div>

      {/* Main Grid: FIFO Pending Queue vs Active Kitchen Stations */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left: FIFO Incoming Queue Runway (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-neutral-900">
                Incoming Order Queue (FIFO)
              </h2>
              <p className="text-xs text-neutral-500">
                Front order is processed first · Enqueue at Rear, Dequeue at Head
              </p>
            </div>

            {headOrder && (
              <button
                onClick={() => dequeueNextToKitchen()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-lg shadow-xs transition-colors shrink-0"
              >
                <span>Dequeue Next</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Queue Items Container */}
          <div className="space-y-3">
            {queue.length === 0 ? (
              <div className="p-8 text-center bg-white border border-dashed border-neutral-300 rounded-xl">
                <UtensilsCrossed className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
                <h3 className="text-sm font-semibold text-neutral-800">Queue is Currently Empty</h3>
                <p className="text-xs text-neutral-500 mt-1 max-w-xs mx-auto">
                  No orders waiting in line. Submit a new order or click below to simulate incoming orders.
                </p>
                <button
                  onClick={addQuickSampleOrder}
                  className="mt-4 px-3 py-1.5 text-xs font-medium text-neutral-800 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors"
                >
                  Enqueue Sample Order
                </button>
              </div>
            ) : (
              queue.map((order, index) => {
                const isHead = index === 0;
                const isTail = index === queue.length - 1;

                return (
                  <div
                    key={order.id}
                    className={`relative p-4 rounded-xl border transition-all ${
                      isHead
                        ? 'bg-amber-50/60 border-amber-300 shadow-xs ring-2 ring-amber-400/20'
                        : 'bg-white border-neutral-200 hover:border-neutral-300'
                    }`}
                  >
                    {/* Head / Tail badges */}
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-base font-bold text-neutral-900">
                          #{order.ticketNumber}
                        </span>
                        {isHead && (
                          <span className="text-[10px] font-mono uppercase tracking-wider font-bold bg-amber-200 text-amber-900 px-1.5 py-0.5 rounded">
                            HEAD / NEXT UP
                          </span>
                        )}
                        {isTail && queue.length > 1 && (
                          <span className="text-[10px] font-mono uppercase tracking-wider font-semibold bg-neutral-100 text-neutral-600 px-1.5 py-0.5 rounded">
                            TAIL / REAR
                          </span>
                        )}
                      </div>

                      <div className="text-right">
                        <span className="text-xs font-semibold text-neutral-800">
                          ${order.totalAmount.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {/* Customer & Dining Meta */}
                    <div className="flex items-center gap-2 text-xs text-neutral-600 mb-2">
                      <span className="font-medium text-neutral-900">{order.customerName}</span>
                      <span aria-hidden="true">·</span>
                      <span className="capitalize">{order.orderType}</span>
                      {order.tableNumber && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="font-mono font-medium">{order.tableNumber}</span>
                        </>
                      )}
                      <span aria-hidden="true">·</span>
                      <span>Pos: #{index + 1}</span>
                    </div>

                    {/* Items List */}
                    <div className="space-y-1 my-2 bg-neutral-50/80 p-2.5 rounded-lg border border-neutral-100">
                      {order.items.map((it, idx) => (
                        <div key={idx} className="flex items-start justify-between text-xs">
                          <span className="text-neutral-800">
                            <strong className="font-mono">{it.quantity}x</strong> {it.menuItem.name}
                          </span>
                          {it.specialInstructions && (
                            <span className="text-[11px] text-amber-800 italic ml-2">
                              "{it.specialInstructions}"
                            </span>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Card Actions & Wait Timer */}
                    <div className="flex items-center justify-between text-xs pt-1">
                      <span className="text-neutral-500 font-mono flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Est. {order.estimatedPrepSeconds}s prep
                      </span>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => cancelOrder(order.id)}
                          className="text-neutral-400 hover:text-red-600 text-xs transition-colors"
                        >
                          Cancel
                        </button>
                        {isHead && (
                          <button
                            onClick={() => dequeueNextToKitchen()}
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-md transition-colors"
                          >
                            <span>Send to Cook</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right: Active Kitchen Stations & Ready Counters (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Active Cooking Stations */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-neutral-900 flex items-center gap-2">
                  <Flame className="w-4 h-4 text-orange-500" />
                  <span>In Preparation (Active Stations)</span>
                </h2>
                <p className="text-xs text-neutral-500">
                  Orders dequeued from FIFO queue currently being prepared by chefs
                </p>
              </div>
              <span className="text-xs font-mono font-medium text-neutral-600 bg-neutral-100 px-2 py-0.5 rounded">
                Active: {preparingOrders.length}
              </span>
            </div>

            {preparingOrders.length === 0 ? (
              <div className="p-8 text-center bg-white border border-neutral-200 rounded-xl">
                <ChefHat className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
                <h3 className="text-sm font-semibold text-neutral-800">All Kitchen Stations Idle</h3>
                <p className="text-xs text-neutral-500 mt-1">
                  Dequeue the next ticket from the pending queue to assign to a station.
                </p>
                {headOrder && (
                  <button
                    onClick={() => dequeueNextToKitchen()}
                    className="mt-3 px-3.5 py-1.5 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-lg transition-colors inline-flex items-center gap-1.5"
                  >
                    <span>Dequeue Ticket #{headOrder.ticketNumber} Now</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {preparingOrders.map((order) => (
                  <div
                    key={order.id}
                    className="p-4 bg-white border border-neutral-200 rounded-xl shadow-xs space-y-3 flex flex-col justify-between"
                  >
                    <div>
                      {/* Station & Ticket Header */}
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-base font-bold text-neutral-900">
                          #{order.ticketNumber}
                        </span>
                        <span className="text-xs font-medium text-orange-800 bg-orange-50 border border-orange-200 px-2 py-0.5 rounded">
                          {order.assignedStation || 'Chef Line'}
                        </span>
                      </div>

                      {/* Customer info */}
                      <div className="text-xs text-neutral-600 mt-1">
                        <strong className="text-neutral-900">{order.customerName}</strong> ·{' '}
                        <span className="capitalize">{order.orderType}</span>
                        {order.assignedChef && (
                          <span className="text-neutral-500 ml-1">· {order.assignedChef}</span>
                        )}
                      </div>

                      {/* Items */}
                      <div className="my-2 space-y-1">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="text-xs text-neutral-800 flex justify-between">
                            <span>{item.quantity}x {item.menuItem.name}</span>
                            <span className="text-neutral-400 font-mono text-[11px]">
                              {item.menuItem.category}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Progress Bar & Actions */}
                    <div className="space-y-2 pt-2 border-t border-neutral-100">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-neutral-500 flex items-center gap-1">
                          <Timer className="w-3 h-3 text-neutral-400" />
                          Cooking Progress
                        </span>
                        <span className="font-mono font-semibold text-neutral-800">
                          {Math.round(order.prepProgress)}%
                        </span>
                      </div>

                      {/* Progress Bar Track */}
                      <div className="w-full bg-neutral-100 rounded-full h-2 overflow-hidden">
                        <div
                          className="h-full bg-orange-500 rounded-full transition-all duration-300"
                          style={{ width: `${Math.min(order.prepProgress, 100)}%` }}
                        />
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <button
                          onClick={() => cancelOrder(order.id)}
                          className="text-xs text-neutral-400 hover:text-red-600 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => advanceOrderToReady(order.id)}
                          className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-md transition-colors"
                        >
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Mark Cooked</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Ready for Customer Collection Shelf */}
          <div className="p-4 bg-emerald-50/50 border border-emerald-200 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-emerald-950 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Ready for Customer Collection ({readyOrders.length})</span>
                </h3>
                <p className="text-xs text-emerald-800/80">
                  Dishes completed and awaiting customer handover at pickup counter
                </p>
              </div>
            </div>

            {readyOrders.length === 0 ? (
              <p className="text-xs text-neutral-500 py-3 text-center italic">
                No orders waiting on pickup counter.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {readyOrders.map((order) => (
                  <div
                    key={order.id}
                    className="p-3 bg-white border border-emerald-200 rounded-lg shadow-xs flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-base font-bold text-neutral-900">
                          #{order.ticketNumber}
                        </span>
                        <span className="text-xs font-semibold text-emerald-700">
                          {order.customerName}
                        </span>
                      </div>
                      <div className="text-[11px] text-neutral-500 mt-0.5">
                        {order.items.length} items · ${order.totalAmount.toFixed(2)}
                      </div>
                    </div>

                    <button
                      onClick={() => markOrderCompleted(order.id)}
                      className="px-2.5 py-1 text-xs font-medium text-emerald-800 bg-emerald-100 hover:bg-emerald-200 rounded-md transition-colors whitespace-nowrap"
                    >
                      Hand Over
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
