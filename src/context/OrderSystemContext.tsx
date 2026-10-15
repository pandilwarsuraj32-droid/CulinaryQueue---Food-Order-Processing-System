import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { Order, OrderItem, OrderStatus, QueueOperationLog } from '../types/order';
import { FifoQueue } from '../models/FifoQueue';
import { MENU_ITEMS } from '../data/menuData';
import { soundEffects } from '../utils/audio';

interface OrderSystemContextType {
  // Queue state
  queue: Order[];
  preparingOrders: Order[];
  readyOrders: Order[];
  completedOrders: Order[];
  logs: QueueOperationLog[];
  
  // Stats
  ticketCounter: number;
  averageWaitMinutes: number;
  totalCompletedCount: number;

  // Actions
  placeOrder: (data: {
    customerName: string;
    orderType: Order['orderType'];
    tableNumber?: string;
    items: OrderItem[];
  }) => Order;
  dequeueNextToKitchen: () => Order | null;
  advanceOrderToReady: (orderId: string) => void;
  markOrderCompleted: (orderId: string) => void;
  cancelOrder: (orderId: string) => void;
  addQuickSampleOrder: () => void;
  
  // Simulation controls
  isAutoSimulating: boolean;
  toggleAutoSimulating: () => void;
  simSpeed: number;
  setSimSpeed: (speed: number) => void;
  autoProcessKitchen: boolean;
  toggleAutoProcessKitchen: () => void;

  // Audio mute
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  
  // Active customer tracking helper
  selectedOrderId: string | null;
  setSelectedOrderId: (id: string | null) => void;
  getOrderQueuePosition: (orderId: string) => number; // 1-indexed, or 0 if not in pending queue
}

const OrderSystemContext = createContext<OrderSystemContextType | undefined>(undefined);

// Initial seed orders for realistic initial viewport
const INITIAL_SEED_ORDERS: Order[] = [
  {
    id: 'ord-101',
    ticketNumber: 101,
    customerName: 'Marcus Vance',
    orderType: 'dine-in',
    tableNumber: 'T-04',
    items: [
      { menuItem: MENU_ITEMS[0], quantity: 1, specialInstructions: 'Extra sharp cheddar' },
      { menuItem: MENU_ITEMS[4], quantity: 1 },
      { menuItem: MENU_ITEMS[3], quantity: 1 }
    ],
    totalAmount: 32.50,
    placedAt: new Date(Date.now() - 4 * 60 * 1000),
    startedPrepAt: new Date(Date.now() - 2 * 60 * 1000),
    status: 'preparing',
    estimatedPrepSeconds: 22,
    prepProgress: 65,
    assignedStation: 'Grill Station',
    assignedChef: 'Chef Marco'
  },
  {
    id: 'ord-102',
    ticketNumber: 102,
    customerName: 'Elena Rostova',
    orderType: 'takeout',
    items: [
      { menuItem: MENU_ITEMS[1], quantity: 1, specialInstructions: 'Well done crust' },
      { menuItem: MENU_ITEMS[7], quantity: 2 }
    ],
    totalAmount: 28.50,
    placedAt: new Date(Date.now() - 3 * 60 * 1000),
    status: 'pending',
    estimatedPrepSeconds: 25,
    prepProgress: 0,
    assignedStation: 'Pizza Oven',
  },
  {
    id: 'ord-103',
    ticketNumber: 103,
    customerName: 'David Chen',
    orderType: 'dine-in',
    tableNumber: 'T-09',
    items: [
      { menuItem: MENU_ITEMS[2], quantity: 1 },
      { menuItem: MENU_ITEMS[3], quantity: 1 }
    ],
    totalAmount: 24.25,
    placedAt: new Date(Date.now() - 1 * 60 * 1000),
    status: 'pending',
    estimatedPrepSeconds: 20,
    prepProgress: 0,
    assignedStation: 'Wok & Assembly',
  }
];

const INITIAL_READY_ORDER: Order = {
  id: 'ord-100',
  ticketNumber: 100,
  customerName: 'Sarah Jenkins',
  orderType: 'takeout',
  items: [
    { menuItem: MENU_ITEMS[0], quantity: 1 },
    { menuItem: MENU_ITEMS[7], quantity: 1 }
  ],
  totalAmount: 21.75,
  placedAt: new Date(Date.now() - 8 * 60 * 1000),
  startedPrepAt: new Date(Date.now() - 5 * 60 * 1000),
  completedAt: new Date(Date.now() - 1 * 60 * 1000),
  status: 'ready',
  estimatedPrepSeconds: 20,
  prepProgress: 100,
  assignedStation: 'Grill Station',
  assignedChef: 'Chef Marco'
};

export const OrderSystemProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Underlying FIFO Queue data structure instance
  const fifoQueueRef = useRef<FifoQueue<Order>>(
    new FifoQueue<Order>([INITIAL_SEED_ORDERS[1], INITIAL_SEED_ORDERS[2]])
  );

  const [queue, setQueue] = useState<Order[]>(fifoQueueRef.current.toArray());
  const [preparingOrders, setPreparingOrders] = useState<Order[]>([INITIAL_SEED_ORDERS[0]]);
  const [readyOrders, setReadyOrders] = useState<Order[]>([INITIAL_READY_ORDER]);
  const [completedOrders, setCompletedOrders] = useState<Order[]>([]);
  const [ticketCounter, setTicketCounter] = useState<number>(104);
  const [logs, setLogs] = useState<QueueOperationLog[]>([
    {
      id: 'log-1',
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      operation: 'ENQUEUE',
      ticketNumber: 101,
      description: 'Order #101 enqueued at tail of queue.',
      complexity: 'O(1)',
      queueLengthAfter: 1
    },
    {
      id: 'log-2',
      timestamp: new Date(Date.now() - 4 * 60 * 1000),
      operation: 'DEQUEUE',
      ticketNumber: 101,
      description: 'Order #101 dequeued from head to Grill Station.',
      complexity: 'O(1)',
      queueLengthAfter: 0
    },
    {
      id: 'log-3',
      timestamp: new Date(Date.now() - 3 * 60 * 1000),
      operation: 'ENQUEUE',
      ticketNumber: 102,
      description: 'Order #102 enqueued at tail of queue.',
      complexity: 'O(1)',
      queueLengthAfter: 1
    },
    {
      id: 'log-4',
      timestamp: new Date(Date.now() - 1 * 60 * 1000),
      operation: 'ENQUEUE',
      ticketNumber: 103,
      description: 'Order #103 enqueued at tail of queue.',
      complexity: 'O(1)',
      queueLengthAfter: 2
    }
  ]);

  const [isAutoSimulating, setIsAutoSimulating] = useState<boolean>(false);
  const [autoProcessKitchen, setAutoProcessKitchen] = useState<boolean>(true);
  const [simSpeed, setSimSpeed] = useState<number>(1);
  const [soundEnabled, setSoundEnabledState] = useState<boolean>(true);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  const setSoundEnabled = (enabled: boolean) => {
    soundEffects.enabled = enabled;
    setSoundEnabledState(enabled);
  };

  const syncQueueState = useCallback(() => {
    setQueue(fifoQueueRef.current.toArray());
  }, []);

  const addLog = useCallback((
    operation: QueueOperationLog['operation'],
    description: string,
    ticketNumber?: number,
    complexity: string = 'O(1)'
  ) => {
    const newLog: QueueOperationLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: new Date(),
      operation,
      ticketNumber,
      description,
      complexity,
      queueLengthAfter: fifoQueueRef.current.size()
    };
    setLogs(prev => [newLog, ...prev.slice(0, 49)]); // Keep last 50 logs
  }, []);

  /**
   * Enqueue: Customer places an order
   */
  const placeOrder = useCallback((data: {
    customerName: string;
    orderType: Order['orderType'];
    tableNumber?: string;
    items: OrderItem[];
  }): Order => {
    const currentTicket = ticketCounter;
    setTicketCounter(prev => prev + 1);

    const totalAmount = data.items.reduce(
      (sum, item) => sum + item.menuItem.price * item.quantity,
      0
    );

    // Calculate max prep time from selected items
    const maxPrep = Math.max(
      ...data.items.map(item => item.menuItem.prepTimeSeconds),
      15
    );

    // Determine primary station
    let primaryStation: Order['assignedStation'] = 'Grill Station';
    const firstCat = data.items[0]?.menuItem.category;
    if (firstCat === 'pizza') primaryStation = 'Pizza Oven';
    else if (firstCat === 'bowls') primaryStation = 'Wok & Assembly';
    else if (firstCat === 'drinks') primaryStation = 'Beverage Bar';

    const newOrder: Order = {
      id: `ord-${currentTicket}-${Date.now().toString(36)}`,
      ticketNumber: currentTicket,
      customerName: data.customerName.trim() || `Customer #${currentTicket}`,
      orderType: data.orderType,
      tableNumber: data.tableNumber,
      items: data.items,
      totalAmount,
      placedAt: new Date(),
      status: 'pending',
      estimatedPrepSeconds: maxPrep,
      prepProgress: 0,
      assignedStation: primaryStation
    };

    // FIFO ENQUEUE
    fifoQueueRef.current.enqueue(newOrder);
    syncQueueState();
    
    soundEffects.playEnqueueChime();
    addLog(
      'ENQUEUE',
      `Order #${currentTicket} (${newOrder.customerName}) enqueued at rear. Items: ${data.items.length}`,
      currentTicket,
      'O(1)'
    );

    setSelectedOrderId(newOrder.id);
    return newOrder;
  }, [ticketCounter, syncQueueState, addLog]);

  /**
   * Dequeue: Kitchen pulls the next ticket in line (strictly from Head of Queue)
   */
  const dequeueNextToKitchen = useCallback((): Order | null => {
    const dequeuedOrder = fifoQueueRef.current.dequeue();
    if (!dequeuedOrder) return null;

    const preparingOrder: Order = {
      ...dequeuedOrder,
      status: 'preparing',
      startedPrepAt: new Date(),
      prepProgress: 5,
      assignedChef: ['Chef Marco', 'Chef Siobhan', 'Chef Kenji', 'Chef Amara'][
        Math.floor(Math.random() * 4)
      ]
    };

    syncQueueState();
    setPreparingOrders(prev => [...prev, preparingOrder]);

    addLog(
      'DEQUEUE',
      `Order #${dequeuedOrder.ticketNumber} dequeued from front. Assigned to ${preparingOrder.assignedStation}.`,
      dequeuedOrder.ticketNumber,
      'O(1)'
    );

    return preparingOrder;
  }, [syncQueueState, addLog]);

  /**
   * Advance Order from Preparing to Ready
   */
  const advanceOrderToReady = useCallback((orderId: string) => {
    setPreparingOrders(prev => {
      const order = prev.find(o => o.id === orderId);
      if (!order) return prev;

      const readyOrder: Order = {
        ...order,
        status: 'ready',
        prepProgress: 100,
        completedAt: new Date()
      };

      setReadyOrders(r => [readyOrder, ...r]);
      soundEffects.playOrderReadyChime();
      addLog('PREP_COMPLETE', `Order #${order.ticketNumber} is ready for customer pickup!`, order.ticketNumber);

      return prev.filter(o => o.id !== orderId);
    });
  }, [addLog]);

  /**
   * Complete Order (Customer picked up)
   */
  const markOrderCompleted = useCallback((orderId: string) => {
    setReadyOrders(prev => {
      const order = prev.find(o => o.id === orderId);
      if (!order) return prev;

      const completedOrder: Order = {
        ...order,
        status: 'completed',
        pickedUpAt: new Date()
      };

      setCompletedOrders(c => [completedOrder, ...c]);
      addLog('PICKED_UP', `Order #${order.ticketNumber} picked up and cleared.`, order.ticketNumber);

      return prev.filter(o => o.id !== orderId);
    });
  }, [addLog]);

  /**
   * Cancel Order
   */
  const cancelOrder = useCallback((orderId: string) => {
    // If in pending queue, we reconstruct queue without this item
    const currentArray = fifoQueueRef.current.toArray();
    const itemToCancel = currentArray.find(o => o.id === orderId);

    if (itemToCancel) {
      fifoQueueRef.current.clear();
      currentArray.forEach(item => {
        if (item.id !== orderId) {
          fifoQueueRef.current.enqueue(item);
        }
      });
      syncQueueState();
      addLog('DEQUEUE', `Order #${itemToCancel.ticketNumber} cancelled from queue.`, itemToCancel.ticketNumber);
      return;
    }

    // If in preparing
    setPreparingOrders(prev => prev.filter(o => o.id !== orderId));
    setReadyOrders(prev => prev.filter(o => o.id !== orderId));
  }, [syncQueueState, addLog]);

  /**
   * Quick Sample Order Generator for Testing & Demos
   */
  const addQuickSampleOrder = useCallback(() => {
    const customerNames = [
      'Aria Sterling', 'Leo Nakamura', 'Priya Sharma', 'Maya Lin',
      'Carlos Mendez', 'Sophie Dupont', 'Tariq Al-Mansoor', 'Chloe Bennett'
    ];
    const types: Order['orderType'][] = ['dine-in', 'takeout', 'delivery'];
    const chosenName = customerNames[Math.floor(Math.random() * customerNames.length)];
    const chosenType = types[Math.floor(Math.random() * types.length)];
    
    // Pick 1-2 random items
    const randomItem1 = MENU_ITEMS[Math.floor(Math.random() * MENU_ITEMS.length)];
    const randomItem2 = MENU_ITEMS[Math.floor(Math.random() * MENU_ITEMS.length)];
    
    const items: OrderItem[] = [
      { menuItem: randomItem1, quantity: 1 }
    ];
    if (Math.random() > 0.4 && randomItem1.id !== randomItem2.id) {
      items.push({ menuItem: randomItem2, quantity: 1 });
    }

    placeOrder({
      customerName: chosenName,
      orderType: chosenType,
      tableNumber: chosenType === 'dine-in' ? `T-0${Math.floor(Math.random() * 8) + 1}` : undefined,
      items
    });
  }, [placeOrder]);

  const toggleAutoSimulating = () => setIsAutoSimulating(p => !p);
  const toggleAutoProcessKitchen = () => setAutoProcessKitchen(p => !p);

  /**
   * Kitchen Auto-Cooking Timer & Auto-Dequeue Interval
   */
  useEffect(() => {
    const intervalTime = 1000 / simSpeed;

    const timer = setInterval(() => {
      // 1. Progress cooking for in-prep orders
      setPreparingOrders(prev => {
        if (prev.length === 0) return prev;
        const updated: Order[] = [];
        const toMoveReady: Order[] = [];

        prev.forEach(order => {
          const step = (100 / Math.max(order.estimatedPrepSeconds, 10)) * 1.5;
          const nextProgress = Math.min(order.prepProgress + step, 100);

          if (nextProgress >= 100 && autoProcessKitchen) {
            toMoveReady.push({
              ...order,
              status: 'ready',
              prepProgress: 100,
              completedAt: new Date()
            });
          } else {
            updated.push({
              ...order,
              prepProgress: nextProgress
            });
          }
        });

        if (toMoveReady.length > 0) {
          setReadyOrders(readyPrev => [...toMoveReady, ...readyPrev]);
          soundEffects.playOrderReadyChime();
          toMoveReady.forEach(ord => {
            addLog('PREP_COMPLETE', `Order #${ord.ticketNumber} cooking complete, ready for collection!`, ord.ticketNumber);
          });
        }

        return updated;
      });

      // 2. If kitchen has capacity (< 4 active orders) and pending queue has orders, auto dequeue if autoProcessKitchen is true
      if (autoProcessKitchen && preparingOrders.length < 3 && !fifoQueueRef.current.isEmpty()) {
        dequeueNextToKitchen();
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, [simSpeed, autoProcessKitchen, preparingOrders.length, dequeueNextToKitchen, addLog]);

  /**
   * Customer Traffic Simulation Interval
   */
  useEffect(() => {
    if (!isAutoSimulating) return;

    const trafficInterval = setInterval(() => {
      addQuickSampleOrder();
    }, 6000 / simSpeed);

    return () => clearInterval(trafficInterval);
  }, [isAutoSimulating, simSpeed, addQuickSampleOrder]);

  // Queue position calculation
  const getOrderQueuePosition = useCallback((orderId: string): number => {
    const list = fifoQueueRef.current.toArray();
    const index = list.findIndex(o => o.id === orderId);
    return index !== -1 ? index + 1 : 0;
  }, []);

  const averageWaitMinutes = Math.max(
    Math.round(((fifoQueueRef.current.size() * 3.5) + (preparingOrders.length * 2)) * 10) / 10,
    2
  );

  return (
    <OrderSystemContext.Provider
      value={{
        queue,
        preparingOrders,
        readyOrders,
        completedOrders,
        logs,
        ticketCounter,
        averageWaitMinutes,
        totalCompletedCount: completedOrders.length,
        placeOrder,
        dequeueNextToKitchen,
        advanceOrderToReady,
        markOrderCompleted,
        cancelOrder,
        addQuickSampleOrder,
        isAutoSimulating,
        toggleAutoSimulating,
        simSpeed,
        setSimSpeed,
        autoProcessKitchen,
        toggleAutoProcessKitchen,
        soundEnabled,
        setSoundEnabled,
        selectedOrderId,
        setSelectedOrderId,
        getOrderQueuePosition
      }}
    >
      {children}
    </OrderSystemContext.Provider>
  );
};

export const useOrderSystem = () => {
  const context = useContext(OrderSystemContext);
  if (!context) {
    throw new Error('useOrderSystem must be used within an OrderSystemProvider');
  }
  return context;
};
