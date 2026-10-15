/**
 * Queue Data Structure Implementation for Order Processing
 * Follows strict FIFO (First-In, First-Out) semantics.
 * 
 * Complexity:
 * - Enqueue: O(1)
 * - Dequeue: O(1)
 * - Peek/Front: O(1)
 * - isEmpty / size: O(1)
 */

export class QueueNode<T> {
  value: T;
  next: QueueNode<T> | null = null;
  previous: QueueNode<T> | null = null;

  constructor(value: T) {
    this.value = value;
  }
}

export class FifoQueue<T> {
  private head: QueueNode<T> | null = null;
  private tail: QueueNode<T> | null = null;
  private count: number = 0;

  constructor(initialItems?: T[]) {
    if (initialItems && initialItems.length > 0) {
      initialItems.forEach(item => this.enqueue(item));
    }
  }

  /**
   * Enqueue: Adds an item to the rear (tail) of the queue.
   * Time Complexity: O(1)
   */
  public enqueue(item: T): void {
    const newNode = new QueueNode(item);
    if (!this.tail) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      this.tail.next = newNode;
      newNode.previous = this.tail;
      this.tail = newNode;
    }
    this.count++;
  }

  /**
   * Dequeue: Removes and returns the item from the front (head) of the queue.
   * Time Complexity: O(1)
   */
  public dequeue(): T | null {
    if (!this.head) {
      return null;
    }
    const dequeuedItem = this.head.value;
    this.head = this.head.next;
    if (this.head) {
      this.head.previous = null;
    } else {
      this.tail = null;
    }
    this.count--;
    return dequeuedItem;
  }

  /**
   * Peek / Front: Returns the front element without removing it.
   * Time Complexity: O(1)
   */
  public peek(): T | null {
    return this.head ? this.head.value : null;
  }

  /**
   * Rear: Returns the most recently added element (tail).
   * Time Complexity: O(1)
   */
  public rear(): T | null {
    return this.tail ? this.tail.value : null;
  }

  /**
   * Size of the queue
   */
  public size(): number {
    return this.count;
  }

  /**
   * Checks if queue is empty
   */
  public isEmpty(): boolean {
    return this.count === 0;
  }

  /**
   * Converts the queue elements from Front to Rear into an array
   */
  public toArray(): T[] {
    const result: T[] = [];
    let current = this.head;
    while (current) {
      result.push(current.value);
      current = current.next;
    }
    return result;
  }

  /**
   * Clears all items in the queue
   */
  public clear(): void {
    this.head = null;
    this.tail = null;
    this.count = 0;
  }

  /**
   * Clones the queue
   */
  public clone(): FifoQueue<T> {
    return new FifoQueue<T>(this.toArray());
  }
}
