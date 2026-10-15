import React, { useState } from 'react';
import { 
  Binary, 
  ArrowRight, 
  Clock, 
  Activity, 
  Layers, 
  Code2, 
  CheckCircle2, 
  Database,
  Info,
  Zap
} from 'lucide-react';
import { useOrderSystem } from '../context/OrderSystemContext';

export const QueueVisualizer: React.FC = () => {
  const { queue, logs, dequeueNextToKitchen, addQuickSampleOrder } = useOrderSystem();
  const [selectedLang, setSelectedLang] = useState<'ts' | 'python' | 'java'>('ts');

  const codeSnippets = {
    ts: `// TypeScript O(1) Doubly-Linked Node Queue Implementation
export class QueueNode<T> {
  value: T;
  next: QueueNode<T> | null = null;
  previous: QueueNode<T> | null = null;
  constructor(value: T) { this.value = value; }
}

export class FifoOrderQueue<T> {
  private head: QueueNode<T> | null = null; // Front pointer
  private tail: QueueNode<T> | null = null; // Rear pointer
  private count: number = 0;

  // Enqueue: Appends to rear -> O(1)
  enqueue(item: T): void {
    const node = new QueueNode(item);
    if (!this.tail) {
      this.head = this.tail = node;
    } else {
      this.tail.next = node;
      node.previous = this.tail;
      this.tail = node;
    }
    this.count++;
  }

  // Dequeue: Removes from front -> O(1)
  dequeue(): T | null {
    if (!this.head) return null;
    const value = this.head.value;
    this.head = this.head.next;
    if (this.head) this.head.previous = null;
    else this.tail = null;
    this.count--;
    return value;
  }

  // Peek: Read front without removing -> O(1)
  peek(): T | null {
    return this.head ? this.head.value : null;
  }
}`,
    python: `# Python FIFO Queue implementation using collections.deque or Node
class Node:
    def __init__(self, order):
        self.order = order
        self.next = None

class FifoOrderQueue:
    def __init__(self):
        self.head = None  # Front of queue
        self.tail = None  # Rear of queue
        self.size = 0

    def enqueue(self, order):
        """Append to rear: O(1) time complexity"""
        node = Node(order)
        if not self.tail:
            self.head = self.tail = node
        else:
            self.tail.next = node
            self.tail = node
        self.size += 1

    def dequeue(self):
        """Extract from front: O(1) time complexity"""
        if not self.head:
            return None
        dequeued_order = self.head.order
        self.head = self.head.next
        if not self.head:
            self.tail = None
        self.size -= 1
        return dequeued_order

    def peek(self):
        """Inspect front: O(1) time complexity"""
        return self.head.order if self.head else None`,
    java: `// Java Queue Implementation for Kitchen Order Dispatch
public class FifoOrderQueue<T> {
    private static class Node<T> {
        T data;
        Node<T> next;
        Node(T data) { this.data = data; }
    }

    private Node<T> head; // Front pointer (Dequeue)
    private Node<T> tail; // Rear pointer (Enqueue)
    private int size = 0;

    // Enqueue: O(1) constant time
    public void enqueue(T order) {
        Node<T> node = new Node<>(order);
        if (tail == null) {
            head = tail = node;
        } else {
            tail.next = node;
            tail = node;
        }
        size++;
    }

    // Dequeue: O(1) constant time
    public T dequeue() {
        if (head == null) return null;
        T data = head.data;
        head = head.next;
        if (head == null) tail = null;
        size--;
        return data;
    }
}`
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 bg-white border border-neutral-200 rounded-xl">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-neutral-900 tracking-tight">
              FIFO Queue Data Structure Studio
            </h1>
            <span className="text-xs font-mono font-medium text-blue-800 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
              DSA Architecture
            </span>
          </div>
          <p className="text-xs text-neutral-500 mt-0.5">
            Real-time memory representation of the queue pointers and operations
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={addQuickSampleOrder}
            className="px-3 py-1.5 text-xs font-medium text-neutral-800 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors border border-neutral-200 inline-flex items-center gap-1.5"
          >
            <Zap className="w-3.5 h-3.5 text-amber-600" />
            <span>Enqueue Node (O(1))</span>
          </button>

          {queue.length > 0 && (
            <button
              onClick={() => dequeueNextToKitchen()}
              className="px-3 py-1.5 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-lg transition-colors inline-flex items-center gap-1.5"
            >
              <span>Dequeue Head (O(1))</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Visual Memory Buffer & Pointers */}
      <div className="p-6 bg-neutral-900 text-white rounded-xl shadow-md space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-800 pb-3">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-amber-400" />
            <h2 className="text-sm font-bold font-mono tracking-wider text-neutral-200 uppercase">
              Live Memory Buffer Visualization (Linked Nodes)
            </h2>
          </div>
          <div className="flex items-center gap-3 text-xs font-mono text-neutral-400">
            <span>Size: <strong className="text-amber-400 font-bold">{queue.length}</strong></span>
            <span>Head Pointer: <strong className="text-blue-400">{queue.length > 0 ? `#${queue[0].ticketNumber}` : 'null'}</strong></span>
            <span>Tail Pointer: <strong className="text-emerald-400">{queue.length > 0 ? `#${queue[queue.length - 1].ticketNumber}` : 'null'}</strong></span>
          </div>
        </div>

        {/* Visual Node Runway */}
        <div className="overflow-x-auto py-4">
          {queue.length === 0 ? (
            <div className="text-center py-10 text-neutral-500 font-mono text-xs">
              <div>[EMPTY QUEUE: head == null, tail == null]</div>
              <p className="text-[11px] text-neutral-600 mt-1">
                Enqueue an order above to observe pointer allocation.
              </p>
            </div>
          ) : (
            <div className="flex items-center gap-3 min-w-max pb-2">
              {queue.map((order, idx) => {
                const isFront = idx === 0;
                const isRear = idx === queue.length - 1;
                // Fake hex pointer address for educational clarity
                const memAddress = `0x${(0x7ff000 + order.ticketNumber * 16).toString(16)}`;
                const nextMem = isRear ? '0x000000 (null)' : `0x${(0x7ff000 + (queue[idx + 1]?.ticketNumber || 0) * 16).toString(16)}`;

                return (
                  <React.Fragment key={order.id}>
                    {/* Node Box */}
                    <div className={`relative p-3.5 rounded-xl border-2 transition-all w-56 flex-shrink-0 ${
                      isFront
                        ? 'bg-blue-950/40 border-blue-400 text-blue-100 ring-2 ring-blue-500/30'
                        : isRear
                        ? 'bg-emerald-950/40 border-emerald-400 text-emerald-100 ring-2 ring-emerald-500/30'
                        : 'bg-neutral-800/80 border-neutral-700 text-neutral-200'
                    }`}>
                      {/* Pointer Tag */}
                      <div className="flex items-center justify-between text-[10px] font-mono mb-2">
                        <span className="text-neutral-400">{memAddress}</span>
                        {isFront && (
                          <span className="font-bold bg-blue-500 text-neutral-950 px-1.5 py-0.2 rounded">
                            [F] FRONT / HEAD
                          </span>
                        )}
                        {isRear && (
                          <span className="font-bold bg-emerald-500 text-neutral-950 px-1.5 py-0.2 rounded">
                            [R] REAR / TAIL
                          </span>
                        )}
                      </div>

                      {/* Ticket Content */}
                      <div className="font-mono text-lg font-black text-white">
                        Ticket #{order.ticketNumber}
                      </div>
                      <div className="text-xs truncate font-medium text-neutral-300">
                        {order.customerName}
                      </div>

                      {/* Internal fields */}
                      <div className="text-[11px] font-mono text-neutral-400 mt-2 space-y-0.5 border-t border-neutral-800 pt-1.5">
                        <div className="flex justify-between">
                          <span>Items:</span>
                          <span className="text-neutral-200">{order.items.length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Next Ptr:</span>
                          <span className="text-amber-300 truncate max-w-[100px]">{nextMem}</span>
                        </div>
                      </div>
                    </div>

                    {/* Arrow between nodes */}
                    {!isRear && (
                      <div className="flex flex-col items-center px-1 text-neutral-500 font-mono text-xs">
                        <ArrowRight className="w-5 h-5 text-neutral-400" />
                        <span className="text-[9px] text-neutral-500">.next</span>
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          )}
        </div>

        {/* Informational Callout */}
        <div className="flex items-start gap-2.5 p-3 bg-neutral-800/60 border border-neutral-700 rounded-lg text-xs text-neutral-300">
          <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
          <div>
            <strong className="text-white">Why Linked List Queue over JavaScript Array.shift()?</strong>
            <p className="text-neutral-400 mt-0.5 leading-relaxed">
              In standard arrays, removing an element from the front requires shifting every remaining item in memory by one index, costing <strong>O(N)</strong> linear time. By utilizing a linked-list queue with explicit <code className="text-blue-300">head</code> and <code className="text-emerald-300">tail</code> pointers, both <strong>Enqueue</strong> and <strong>Dequeue</strong> execute in deterministic <strong>O(1)</strong> constant time.
            </p>
          </div>
        </div>
      </div>

      {/* Two Column Section: Big-O Complexity Table + Realtime Queue Operations Log */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left: Complexity Matrix & Code Inspector (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-neutral-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-neutral-700" />
              <span>Algorithmic Complexity Matrix</span>
            </h2>

            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-neutral-200 text-neutral-500 font-mono">
                  <th className="py-2">Operation</th>
                  <th className="py-2">Time Complexity</th>
                  <th className="py-2">Space Complexity</th>
                  <th className="py-2">Kitchen Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 font-mono">
                <tr>
                  <td className="py-2.5 font-bold text-neutral-900">Enqueue</td>
                  <td className="py-2.5 text-emerald-700 font-bold">O(1)</td>
                  <td className="py-2.5 text-neutral-600">O(1)</td>
                  <td className="py-2.5 font-sans text-neutral-600">Customer places order</td>
                </tr>
                <tr>
                  <td className="py-2.5 font-bold text-neutral-900">Dequeue</td>
                  <td className="py-2.5 text-emerald-700 font-bold">O(1)</td>
                  <td className="py-2.5 text-neutral-600">O(1)</td>
                  <td className="py-2.5 font-sans text-neutral-600">Staff pulls order to cook</td>
                </tr>
                <tr>
                  <td className="py-2.5 font-bold text-neutral-900">Peek / Front</td>
                  <td className="py-2.5 text-emerald-700 font-bold">O(1)</td>
                  <td className="py-2.5 text-neutral-600">O(1)</td>
                  <td className="py-2.5 font-sans text-neutral-600">Check next order in line</td>
                </tr>
                <tr>
                  <td className="py-2.5 font-bold text-neutral-900">isEmpty / Size</td>
                  <td className="py-2.5 text-emerald-700 font-bold">O(1)</td>
                  <td className="py-2.5 text-neutral-600">O(1)</td>
                  <td className="py-2.5 font-sans text-neutral-600">Check queue capacity</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Interactive Code Viewer */}
          <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-xs">
            <div className="p-4 border-b border-neutral-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Code2 className="w-4 h-4 text-neutral-700" />
                <h3 className="text-sm font-bold text-neutral-900">Queue Implementation</h3>
              </div>

              <div className="flex items-center gap-1 bg-neutral-100 p-0.5 rounded-lg text-xs font-mono">
                {(['ts', 'python', 'java'] as const).map(lang => (
                  <button
                    key={lang}
                    onClick={() => setSelectedLang(lang)}
                    className={`px-2 py-1 rounded capitalize transition-colors ${
                      selectedLang === lang ? 'bg-white text-neutral-900 font-bold shadow-xs' : 'text-neutral-600'
                    }`}
                  >
                    {lang === 'ts' ? 'TypeScript' : lang === 'python' ? 'Python' : 'Java'}
                  </button>
                ))}
              </div>
            </div>

            <pre className="p-4 bg-neutral-900 text-neutral-200 text-[11px] font-mono overflow-x-auto max-h-72 leading-relaxed">
              <code>{codeSnippets[selectedLang]}</code>
            </pre>
          </div>
        </div>

        {/* Right: Live Queue Audit Trail & Operations Log (6 cols) */}
        <div className="lg:col-span-6 bg-white border border-neutral-200 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
            <div>
              <h2 className="text-base font-bold text-neutral-900 flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-600" />
                <span>Real-Time Queue Operations Log</span>
              </h2>
              <p className="text-xs text-neutral-500">
                Audited stream of FIFO enqueues, dequeues, and transitions
              </p>
            </div>
            <span className="text-xs font-mono font-medium text-neutral-600 bg-neutral-100 px-2 py-0.5 rounded">
              {logs.length} events
            </span>
          </div>

          <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
            {logs.map((log) => (
              <div
                key={log.id}
                className="p-3 bg-neutral-50 rounded-lg border border-neutral-200/80 text-xs flex items-start justify-between gap-3 font-mono"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded uppercase ${
                      log.operation === 'ENQUEUE'
                        ? 'bg-blue-100 text-blue-800'
                        : log.operation === 'DEQUEUE'
                        ? 'bg-amber-100 text-amber-900'
                        : log.operation === 'PREP_COMPLETE'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-neutral-200 text-neutral-800'
                    }`}>
                      {log.operation}
                    </span>
                    <span className="text-neutral-400 text-[10px]">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-neutral-800 font-sans text-xs">
                    {log.description}
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[11px] font-bold text-neutral-600">
                    Len: {log.queueLengthAfter}
                  </span>
                  <div className="text-[10px] text-emerald-700">
                    {log.complexity}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
