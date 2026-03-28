/**
 * @file menu.js
 * @description Static menu data for the interactive ordering panel.
 * Includes categories, dishes with gradient accents, and available add-ons.
 */

/**
 * Available menu category filter tabs shown above the dish list.
 * @type {string[]}
 */
export const categories = ["Appetizers", "Steaks", "Desserts", "Mocktails"];

/**
 * @typedef {Object} MenuItem
 * @property {number} id       - Unique dish identifier
 * @property {string} category - One of the categories defined above
 * @property {string} name     - Display name of the dish
 * @property {number} price    - Base price in USD
 * @property {number} wait     - Estimated base prep time in minutes
 * @property {string} accent   - CSS gradient string for the dish preview card background
 * @property {string} note     - Short flavour description shown under the dish name
 */

/** @type {MenuItem[]} */
export const menuItems = [
  {
    id: 1,
    category: "Appetizers",
    name: "Crisp Burrata",
    price: 18,
    wait: 10,
    accent: "linear-gradient(135deg, #eef6f3 0%, #f7fbf8 48%, #d8eee4 100%)",
    note: "Tomato water, basil oil, smoked sea salt",
  },
  {
    id: 2,
    category: "Steaks",
    name: "Signature Steak",
    price: 48,
    wait: 18,
    accent: "linear-gradient(135deg, #2f3a45 0%, #4d6a5d 52%, #9bc9b2 100%)",
    note: "Prime striploin with cafe de Paris butter",
  },
  {
    id: 3,
    category: "Steaks",
    name: "Firewood Ribeye",
    price: 52,
    wait: 20,
    accent: "linear-gradient(135deg, #3b312d 0%, #6f5f4d 52%, #bfaf92 100%)",
    note: "Oak ember finish, rosemary jus, flaky salt",
  },
  {
    id: 4,
    category: "Desserts",
    name: "Velvet Tiramisu",
    price: 13,
    wait: 8,
    accent: "linear-gradient(135deg, #f7efe5 0%, #fdf8f1 48%, #d7e9de 100%)",
    note: "Mascarpone cloud, espresso creme, cacao dust",
  },
  {
    id: 5,
    category: "Mocktails",
    name: "Mint Citrus Cooler",
    price: 11,
    wait: 6,
    accent: "linear-gradient(135deg, #eff9f3 0%, #fdfefd 48%, #cfe9d9 100%)",
    note: "Fresh lime, mint pearls, sparkling citrus",
  },
];

/**
 * @typedef {Object} AddOn
 * @property {string} name  - Display name of the add-on
 * @property {number} price - Additional cost in USD
 */

/**
 * Optional add-ons available in the dish customization drawer.
 * @type {AddOn[]}
 */
export const addOns = [
  { name: "Mashed Potatoes", price: 6 },
  { name: "Extra Sauce",     price: 4 },
  { name: "Charred Greens",  price: 5 },
];
