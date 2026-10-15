# CulinaryQueue: Online Food Order Processing System

> **A real-time, FIFO (First-In, First-Out) Queue-driven Kitchen Order Management and Dispatch System built with React, TypeScript, and Tailwind CSS.**

[![License: MIT](https://img.shields.io/badge/License-MIT-amber.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.0-61dafb.svg)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8.svg)](https://tailwindcss.com/)

---

## 📖 Project Overview

**CulinaryQueue** is an enterprise-grade food order processing web application designed to demonstrate and operationalize the **Queue Data Structure** in high-throughput restaurant environments.

In commercial kitchens and digital ordering kiosks, fairness, operational efficiency, and kitchen throughput strictly depend on processing incoming orders in the exact sequence they were received (**First-In, First-Out**). This project demonstrates a production-quality implementation of this concept across multiple synchronized perspectives:

1. **Customer Digital Ordering**: Browse artisanal food menus, customize orders, specify dining preferences (dine-in, takeout, delivery), and receive an instant sequential Queue Ticket Number.
2. **Kitchen Display System (KDS)**: Operational station where kitchen staff dequeue tickets from the head of the queue, track real-time prep timers across cooking stations (Grill, Pizza Oven, Wok, Beverage Bar), and mark orders ready.
3. **Customer Pickup & TV Status Board**: Real-time split screen (Preparing vs. Ready for Pickup) with audio chimes and individual ticket tracking.
4. **Interactive Queue Data Structure Studio**: Visual animated inspection of the underlying FIFO queue memory buffer, front/rear pointers, Big-O complexity analysis ($O(1)$ operations), and live audit logs.

---

## 🧠 Data Structure & Algorithm (DSA) Architecture

### Why a Queue?
A **Queue** is a linear data structure that operates on the **FIFO** principle. The first order submitted by a customer is guaranteed to be the first order pulled into the kitchen.

```
                    FIFO QUEUE PIPELINE
                    
 Customer Placement                               Kitchen Cooking Station
 [ Order Placed ]                                    [ Next in Line ]
        │                                                   ▲
        ▼                                                   │
  ┌───────────┐    ┌───────────┐    ┌───────────┐    ┌───────────┐
  │ Ticket #4 │ ──>│ Ticket #3 │ ──>│ Ticket #2 │ ──>│ Ticket #1 │
  └───────────┘    └───────────┘    └───────────┘    └───────────┘
   ▲ REAR (TAIL)                                      ▲ FRONT (HEAD)
   └─ Enqueue (O(1))                                  └─ Dequeue (O(1))
```

### Time & Space Complexity

| Operation | Method | Time Complexity | Space Complexity | Description |
| :--- | :--- | :---: | :---: | :--- |
| **Enqueue** | `queue.enqueue(order)` | **$O(1)$** | $O(1)$ | Appends incoming order to the tail node. |
| **Dequeue** | `queue.dequeue()` | **$O(1)$** | $O(1)$ | Removes and returns the head order for kitchen prep. |
| **Peek / Front** | `queue.peek()` | **$O(1)$** | $O(1)$ | Inspects the next order to be cooked without removal. |
| **Rear** | `queue.rear()` | **$O(1)$** | $O(1)$ | Inspects the most recent incoming ticket. |
| **Size / isEmpty**| `queue.size()` | **$O(1)$** | $O(1)$ | Maintained via atomic counter variable. |

---

## ✨ Key Features

- **Strict FIFO Queue Integrity**: Zero out-of-order execution; orders flow from Queue Rear to Head to Cooking Stations to Ready Board.
- **Kitchen Display System (KDS)**:
  - Manual Dequeue or Auto-Process mode.
  - Multi-station assignment (Grill, Wood-Fired Oven, Wok, Beverage Bar).
  - Dynamic preparation countdowns and cooking progress bars.
- **Customer Status Tracking & Airport-Style TV Board**:
  - Live ticket status board for dine-in tables and pickup counters.
  - Web Audio API synthetic chime bell when an order is called.
  - Ticket lookup tool with queue position calculator (*"You are #2 in line"*).
- **Traffic Simulation & Rush Hour Mode**:
  - Toggle automatic random customer traffic to simulate high-load peak restaurant rush hours.
  - Adjustable simulation speeds ($1\times$, $2\times$, $5\times$).
- **Queue Memory & Code Inspector**:
  - Visual node buffer showing memory addresses, node pointers (`next`, `prev`), and Front/Rear indicators.
  - Interactive multi-language code snippets (TypeScript, Python, Java, C++).
- **In-App GitHub ZIP Exporter**:
  - Download the complete repository ZIP with one click using the built-in bundler!

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/online-food-order-processing-system.git
   cd online-food-order-processing-system
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser**:
   Navigate to `http://localhost:3000` to interact with the system.

### Build for Production

```bash
npm run build
npm run preview
```

---

## 📁 Project Structure

```
├── public/                 # Static assets & downloadable bundle
├── src/
│   ├── assets/             # Generated culinary imagery
│   ├── components/         # Modular UI components
│   │   ├── TopBar.tsx              # Strict 3-zone header
│   │   ├── CustomerOrdering.tsx    # Food menu, cart & checkout
│   │   ├── KitchenDisplaySystem.tsx # KDS cooking stations & Dequeue control
│   │   ├── OrderStatusBoard.tsx    # Public pickup board & ticket tracker
│   │   ├── QueueVisualizer.tsx     # Visual DSA queue memory & Big-O studio
│   │   └── GitHubExportModal.tsx   # In-app ZIP creator and GitHub exporter
│   ├── context/
│   │   └── OrderSystemContext.tsx  # Central state & simulation engine
│   ├── data/
│   │   └── menuData.ts             # Food catalog & recipes
│   ├── models/
│   │   └── FifoQueue.ts            # Linked-List based FIFO Queue class
│   ├── types/
│   │   └── order.ts                # TypeScript interfaces
│   ├── utils/
│   │   ├── audio.ts                # Web Audio API chime generator
│   │   └── zipGenerator.ts         # Client-side repository zip bundler
│   ├── App.tsx                     # Main layout & view coordinator
│   ├── index.css                   # Tailwind v4 styles & typography
│   └── main.tsx                    # React DOM entry point
├── metadata.json           # Application metadata
├── package.json            # Dependencies & scripts
├── tsconfig.json           # TypeScript configuration
├── vite.config.ts          # Vite build config
└── README.md               # Documentation
```

---

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/) + [Vite 8](https://vitejs.dev/)
- **Language**: [TypeScript 5](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Audio**: Web Audio API (zero external asset reliance)
- **Packaging**: [JSZip](https://stuk.github.io/jszip/)

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
