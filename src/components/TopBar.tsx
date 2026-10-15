import React from 'react';
import { ChefHat, ShoppingBag, Tv, Binary, Download, Volume2, VolumeX, Plus } from 'lucide-react';
import { useOrderSystem } from '../context/OrderSystemContext';

export type ActiveTab = 'kds' | 'menu' | 'display' | 'visualizer' | 'github';

interface TopBarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenQuickOrder: () => void;
  onOpenGithubModal: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  activeTab,
  setActiveTab,
  onOpenQuickOrder,
  onOpenGithubModal
}) => {
  const { queue, preparingOrders, readyOrders, soundEnabled, setSoundEnabled } = useOrderSystem();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Strictly compliant 3-zone layout */}
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single text element wordmark */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xl font-bold tracking-tight text-neutral-900 whitespace-nowrap">
              CulinaryQueue
            </span>
          </div>

          {/* Zone 2: 4-5 clean single-line nav links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-neutral-600">
            <button
              onClick={() => setActiveTab('kds')}
              className={`flex items-center gap-2 py-1 transition-colors whitespace-nowrap shrink-0 border-b-2 ${
                activeTab === 'kds'
                  ? 'text-neutral-950 border-neutral-900 font-semibold'
                  : 'border-transparent hover:text-neutral-900'
              }`}
            >
              <ChefHat className="w-4 h-4" />
              <span>Kitchen KDS</span>
              {queue.length > 0 && (
                <span className="text-xs font-mono tabular-nums text-amber-700 ml-1">
                  ({queue.length})
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('menu')}
              className={`flex items-center gap-2 py-1 transition-colors whitespace-nowrap shrink-0 border-b-2 ${
                activeTab === 'menu'
                  ? 'text-neutral-950 border-neutral-900 font-semibold'
                  : 'border-transparent hover:text-neutral-900'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Place Order</span>
            </button>

            <button
              onClick={() => setActiveTab('display')}
              className={`flex items-center gap-2 py-1 transition-colors whitespace-nowrap shrink-0 border-b-2 ${
                activeTab === 'display'
                  ? 'text-neutral-950 border-neutral-900 font-semibold'
                  : 'border-transparent hover:text-neutral-900'
              }`}
            >
              <Tv className="w-4 h-4" />
              <span>Order Status Board</span>
              {readyOrders.length > 0 && (
                <span className="text-xs font-mono tabular-nums text-emerald-700 ml-1">
                  ({readyOrders.length} Ready)
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('visualizer')}
              className={`flex items-center gap-2 py-1 transition-colors whitespace-nowrap shrink-0 border-b-2 ${
                activeTab === 'visualizer'
                  ? 'text-neutral-950 border-neutral-900 font-semibold'
                  : 'border-transparent hover:text-neutral-900'
              }`}
            >
              <Binary className="w-4 h-4" />
              <span>DSA Queue Visualizer</span>
            </button>
          </nav>

          {/* Zone 3: Primary action button + audio toggle */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              title={soundEnabled ? 'Mute Audio Chime' : 'Enable Audio Chime'}
              className="p-2 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors"
              aria-label="Toggle sound chimes"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            <button
              onClick={onOpenGithubModal}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors whitespace-nowrap shrink-0"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export GitHub ZIP</span>
            </button>

            <button
              onClick={onOpenQuickOrder}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg transition-colors whitespace-nowrap shrink-0 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Order</span>
            </button>
          </div>
        </div>

        {/* Mobile secondary tab strip */}
        <div className="flex md:hidden items-center gap-2 overflow-x-auto py-2 border-t border-neutral-100 text-xs font-medium text-neutral-600">
          <button
            onClick={() => setActiveTab('kds')}
            className={`px-3 py-1.5 rounded-md whitespace-nowrap ${activeTab === 'kds' ? 'bg-neutral-900 text-white' : 'bg-neutral-100'}`}
          >
            Kitchen ({queue.length})
          </button>
          <button
            onClick={() => setActiveTab('menu')}
            className={`px-3 py-1.5 rounded-md whitespace-nowrap ${activeTab === 'menu' ? 'bg-neutral-900 text-white' : 'bg-neutral-100'}`}
          >
            Place Order
          </button>
          <button
            onClick={() => setActiveTab('display')}
            className={`px-3 py-1.5 rounded-md whitespace-nowrap ${activeTab === 'display' ? 'bg-neutral-900 text-white' : 'bg-neutral-100'}`}
          >
            Status Board ({readyOrders.length})
          </button>
          <button
            onClick={() => setActiveTab('visualizer')}
            className={`px-3 py-1.5 rounded-md whitespace-nowrap ${activeTab === 'visualizer' ? 'bg-neutral-900 text-white' : 'bg-neutral-100'}`}
          >
            Queue Visualizer
          </button>
          <button
            onClick={onOpenGithubModal}
            className="px-3 py-1.5 rounded-md whitespace-nowrap bg-neutral-100 text-neutral-800 flex items-center gap-1"
          >
            <Download className="w-3 h-3" /> ZIP
          </button>
        </div>
      </div>
    </header>
  );
};
