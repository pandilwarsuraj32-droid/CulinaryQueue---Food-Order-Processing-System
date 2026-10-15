import React, { useState } from 'react';
import { OrderSystemProvider, useOrderSystem } from './context/OrderSystemContext';
import { TopBar, ActiveTab } from './components/TopBar';
import { KitchenDisplaySystem } from './components/KitchenDisplaySystem';
import { CustomerOrdering } from './components/CustomerOrdering';
import { OrderStatusBoard } from './components/OrderStatusBoard';
import { QueueVisualizer } from './components/QueueVisualizer';
import { GitHubExportModal } from './components/GitHubExportModal';
import { 
  ChefHat, 
  ShoppingBag, 
  Tv, 
  Binary, 
  Download, 
  ArrowRight,
  Layers,
  Clock,
  Sparkles,
  GitBranch
} from 'lucide-react';

const MainAppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('kds');
  const [isGithubModalOpen, setIsGithubModalOpen] = useState<boolean>(false);
  const { queue, preparingOrders, readyOrders, averageWaitMinutes } = useOrderSystem();

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col justify-between">
      <div>
        {/* Top Navigation Bar adhering to the Top Bar contract */}
        <TopBar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenQuickOrder={() => setActiveTab('menu')}
          onOpenGithubModal={() => setIsGithubModalOpen(true)}
        />

        {/* Global Operational Status Banner */}
        <div className="bg-white border-b border-neutral-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex flex-wrap items-center justify-between gap-4 text-xs">
              <div className="flex flex-wrap items-center gap-3 text-neutral-600">
                <span className="font-semibold text-neutral-900">System Pipeline:</span>
                <span className="flex items-center gap-1 font-mono">
                  <span>Enqueued (Pending):</span>
                  <strong className="text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                    {queue.length}
                  </strong>
                </span>
                <span className="text-neutral-300">/</span>
                <span className="flex items-center gap-1 font-mono">
                  <span>Cooking Stations:</span>
                  <strong className="text-orange-800 bg-orange-50 px-1.5 py-0.5 rounded border border-orange-200">
                    {preparingOrders.length}
                  </strong>
                </span>
                <span className="text-neutral-300">/</span>
                <span className="flex items-center gap-1 font-mono">
                  <span>Ready at Counter:</span>
                  <strong className="text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                    {readyOrders.length}
                  </strong>
                </span>
              </div>

              {/* Quick links & GitHub indicator */}
              <div className="flex items-center gap-3">
                <span className="text-neutral-500 font-mono text-[11px] hidden sm:inline">
                  FIFO Queue: O(1) Push · O(1) Pop
                </span>
                <button
                  onClick={() => setIsGithubModalOpen(true)}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-neutral-800 hover:text-neutral-950 font-mono"
                >
                  <GitBranch className="w-3 h-3 text-neutral-500" />
                  <span>GitHub Ready (.ZIP)</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {activeTab === 'kds' && <KitchenDisplaySystem />}
          {activeTab === 'menu' && (
            <CustomerOrdering onOrderPlacedSuccess={() => setActiveTab('kds')} />
          )}
          {activeTab === 'display' && <OrderStatusBoard />}
          {activeTab === 'visualizer' && <QueueVisualizer />}
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-neutral-200 mt-16 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <div>
            <span className="font-semibold text-neutral-800">CulinaryQueue</span> · Online Food Order Processing System
            <div className="text-[11px] text-neutral-400 mt-0.5">
              Strict FIFO Queue Data Structure Implementation for Commercial Kitchens & Digital Ordering
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setActiveTab('visualizer')}
              className="hover:text-neutral-800 transition-colors"
            >
              DSA Visualizer
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => setIsGithubModalOpen(true)}
              className="font-medium text-neutral-900 hover:underline flex items-center gap-1"
            >
              <Download className="w-3 h-3" />
              <span>Download Project ZIP</span>
            </button>
          </div>
        </div>
      </footer>

      {/* GitHub Export Modal */}
      <GitHubExportModal
        isOpen={isGithubModalOpen}
        onClose={() => setIsGithubModalOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <OrderSystemProvider>
      <MainAppContent />
    </OrderSystemProvider>
  );
}
