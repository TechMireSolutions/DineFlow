/**
 * @file tables.js
 * @description Static data for the restaurant floor plan.
 * Includes table definitions, active order lookup, and status CSS mapping.
 */

/**
 * @typedef {Object} Table
 * @property {string} id       - Table identifier (e.g. "T01")
 * @property {number} seats    - Number of seats at this table
 * @property {"Available"|"Occupied"|"Cleaning"} status - Current table status
 * @property {string} zone     - Section of the restaurant (e.g. "Window", "Bar")
 * @property {"circle"|"rounded"} shape - Visual shape for the floor plan render
 * @property {number} width    - Width in px for the floor plan absolute positioning
 * @property {number} height   - Height in px for the floor plan absolute positioning
 * @property {string} top      - CSS top value (percentage) for floor map placement
 * @property {string} left     - CSS left value (percentage) for floor map placement
 */

/** @type {Table[]} */
export const tables = [
  { id: "T01", seats: 2, status: "Available", zone: "Window",  shape: "circle",  width: "20%",    height: "26%",   top: "12%", left: "6%"  },
  { id: "T02", seats: 4, status: "Occupied",  zone: "Center",  shape: "rounded", width: "28%",    height: "26%",   top: "14%", left: "34%" },
  { id: "T03", seats: 6, status: "Cleaning",  zone: "Terrace", shape: "rounded", width: "27%",    height: "28%",   top: "46%", left: "6%"  },
  { id: "T04", seats: 2, status: "Available", zone: "Window",  shape: "circle",  width: "21%",    height: "27%",   top: "47%", left: "56%" },
  { id: "T05", seats: 8, status: "Occupied",  zone: "Private", shape: "rounded", width: "34%",    height: "26%",   top: "75%", left: "6%"  },
  { id: "T06", seats: 4, status: "Available", zone: "Bar",     shape: "rounded", width: "19%",    height: "24%",   top: "73%", left: "76%" },
];









/**
 * Active order data keyed by table ID.
 * Only occupied tables will have entries here.
 * @type {Record<string, { guest: string, startedAt: string, server: string, items: {name:string, qty:number, price:number}[] }>}
 */
export const activeOrders = {
  T02: {
    guest: "A. Rahman",
    startedAt: "7:14 PM",
    server: "Maya",
    items: [
      { name: "Signature Steak",   qty: 1, price: 48 },
      { name: "Mashed Potatoes",   qty: 1, price: 6  },
      { name: "Mint Citrus Cooler", qty: 2, price: 11 },
    ],
  },
  T05: {
    guest: "Corporate Dinner",
    startedAt: "7:02 PM",
    server: "Haris",
    items: [
      { name: "Firewood Ribeye",    qty: 2, price: 52 },
      { name: "Charred Asparagus",  qty: 2, price: 16 },
      { name: "Velvet Tiramisu",    qty: 3, price: 13 },
    ],
  },
};

/**
 * Tailwind class strings for each table status badge.
 * Used across the floor plan and table detail drawer.
 * @type {Record<string, string>}
 */
export const statusClass = {
  Available: "border-emerald-200 bg-white text-emerald-700",
  Occupied:  "border-amber-200 bg-amber-50 text-amber-700",
  Cleaning:  "border-slate-200 bg-slate-100 text-slate-600",
};
