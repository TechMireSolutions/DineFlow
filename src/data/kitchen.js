/**
 * @file kitchen.js
 * @description Seed data for the Kitchen Display System (KDS) panel.
 * Provides initial state for pending and completed ticket queues.
 */

/**
 * @typedef {Object} KitchenOrder
 * @property {string}   id         - Unique kitchen ticket identifier (e.g. "K-202")
 * @property {string}   table      - Table reference string (e.g. "T05")
 * @property {"VIP"|"Normal"} priority - Service priority level
 * @property {number}   minutesAgo - How long ago the order was placed (for display only)
 * @property {string[]} items      - Human-readable line items for the ticket
 */

/**
 * Initial set of orders currently in the kitchen queue.
 * In a live system these would come from a real-time API/socket.
 * @type {KitchenOrder[]}
 */
export const pendingSeed = [
  {
    id: "K-202",
    table: "T05",
    priority: "VIP",
    minutesAgo: 11,
    items: ["2 Ribeye", "2 Asparagus", "3 Tiramisu"],
  },
  {
    id: "K-203",
    table: "T03",
    priority: "Normal",
    minutesAgo: 3,
    items: ["1 Burrata", "1 Citrus Cooler"],
  },
];

/**
 * Initial set of orders already fulfilled and ready for the guest.
 * New completed orders are prepended to this array at runtime.
 * @type {{ id: string, table: string }[]}
 */
export const completedSeed = [
  { id: "K-201", table: "T02" },
];
