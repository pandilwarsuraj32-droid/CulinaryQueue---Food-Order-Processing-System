export type OrderStatus = 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled';

export type OrderType = 'dine-in' | 'takeout' | 'delivery';

export interface MenuItem {
  id: string;
  name: string;
  category: 'mains' | 'pizza' | 'bowls' | 'sides' | 'drinks';
  description: string;
  price: number;
  prepTimeSeconds: number; // e.g. 15-40s in simulation time
  image: string;
  dietary?: ('vegetarian' | 'vegan' | 'gluten-free' | 'chef-special')[];
  calories?: number;
}

export interface OrderItem {
  menuItem: MenuItem;
  quantity: number;
  specialInstructions?: string;
}

export interface Order {
  id: string;
  ticketNumber: number; // e.g. 101, 102...
  customerName: string;
  orderType: OrderType;
  tableNumber?: string;
  contactPhone?: string;
  items: OrderItem[];
  totalAmount: number;
  placedAt: Date;
  startedPrepAt?: Date;
  completedAt?: Date;
  pickedUpAt?: Date;
  status: OrderStatus;
  estimatedPrepSeconds: number;
  prepProgress: number; // 0 to 100
  assignedStation?: 'Grill Station' | 'Pizza Oven' | 'Wok & Assembly' | 'Beverage Bar';
  assignedChef?: string;
}

export interface QueueOperationLog {
  id: string;
  timestamp: Date;
  operation: 'ENQUEUE' | 'DEQUEUE' | 'PEEK' | 'PREP_START' | 'PREP_COMPLETE' | 'PICKED_UP';
  ticketNumber?: number;
  description: string;
  complexity: string; // e.g. 'O(1)'
  queueLengthAfter: number;
}
