/**
 * @file MenuPanel.jsx
 * @description Interactive digital menu panel component.
 * Features:
 *   - Category filter tabs (Appetizers, Steaks, Desserts, Mocktails)
 *   - Full-width gradient dish preview card for the selected item
 *   - Scrollable list of dishes in the active category
 * Items animate in/out when the selected category changes using Framer Motion.
 */

import { AnimatePresence, motion } from "framer-motion";
import { Clock3 } from "lucide-react";
import { categories } from "../data/menu";
import { money } from "../utils/format";

/**
 * MenuPanel — the interactive ordering section in the second dashboard column.
 *
 * @param {Object} props
 * @param {string}   props.selectedCategory   - Currently active category tab name
 * @param {Function} props.onSelectCategory   - Callback when a category tab is clicked
 * @param {import("../data/menu").MenuItem[]} props.filteredItems
 *   Dishes belonging to the selected category
 * @param {import("../data/menu").MenuItem | null} props.selectedItem
 *   The currently highlighted dish (shown in the preview card)
 * @param {Function} props.onSelectItem
 *   Callback when a dish row is clicked; receives the MenuItem object
 * @param {Function} props.onOpenCustomization
 *   Callback when the preview card is clicked to open the customization drawer
 * @param {number}   props.cartLength
 *   Number of items in the cart, used to calculate dynamic ETA offset
 */
export default function MenuPanel({
  selectedCategory,
  onSelectCategory,
  filteredItems,
  selectedItem,
  onSelectItem,
  onOpenCustomization,
  cartLength,
}) {
  return (
    <section className="rounded-[34px] border border-[#edf2f3] bg-white p-5 shadow-[0_18px_44px_rgba(15,23,42,0.06)]">

      {/* Section header */}
      <div className="mb-5 flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <div className="text-sm font-medium text-mint-700">Interactive Menu</div>
          <h2 className="mt-1 max-w-[14ch] text-[28px] font-semibold leading-none tracking-tight md:text-[32px]">
            Customer ordering view
          </h2>
        </div>
        <div className="rounded-full bg-[#f8fafc] px-4 py-2 text-sm text-slate-500">
          Dynamic ETA + live pricing
        </div>
      </div>

      {/* Category filter tab strip */}
      <div className="mb-5 flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              selectedCategory === category
                ? "bg-mint-600 text-white shadow-[0_12px_20px_rgba(91,174,130,0.22)]"
                : "bg-[#f2f5f7] text-slate-500 hover:bg-[#eaeff2]"
            }`}
            onClick={() => onSelectCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Dish grid — animates between categories */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedCategory}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.28 }}
          className="menu-grid"
        >
          {/* ── Selected dish preview card ── */}
          {selectedItem && (
            <button
              className="overflow-hidden rounded-[30px] border border-[#edf2f3] bg-white text-left shadow-[0_16px_38px_rgba(15,23,42,0.06)]"
              onClick={() => onOpenCustomization(selectedItem)}
            >
              {/* Gradient accent banner */}
              <div
                className="h-48 lg:h-56"
                style={{ background: selectedItem.accent }}
                aria-hidden="true"
              />
              <div className="space-y-4 p-5">
                {/* Name + price */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-[24px] font-semibold leading-none tracking-tight md:text-[28px]">
                      {selectedItem.name}
                    </h3>
                    <p className="mt-3 max-w-md text-sm leading-6 text-slate-500">
                      {selectedItem.note}
                    </p>
                  </div>
                  <span className="rounded-full bg-[#f4faf7] px-3 py-1.5 text-sm font-semibold text-mint-700">
                    {money(selectedItem.price)}
                  </span>
                </div>
                {/* Dynamic ETA — increases by 2 min per additional cart item */}
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <Clock3 size={15} />
                  Estimated time{" "}
                  {selectedItem.wait + Math.max(cartLength - 1, 0) * 2}–
                  {selectedItem.wait + 5 + Math.max(cartLength - 1, 0) * 2} mins
                </div>
              </div>
            </button>
          )}

          {/* ── Dish list ── */}
          <div className="space-y-3">
            {filteredItems.map((item) => (
              <button
                key={item.id}
                className={`w-full rounded-[26px] border p-4 text-left transition ${
                  selectedItem?.id === item.id
                    ? "border-mint-200 bg-[#f6fbf8] shadow-[0_14px_28px_rgba(91,174,130,0.12)]"
                    : "border-[#edf2f3] bg-white hover:border-slate-300"
                }`}
                onClick={() => onSelectItem(item)}
              >
                <div className="flex items-center justify-between gap-4">
                  {/* Dish name + note */}
                  <div>
                    <div className="text-lg font-semibold">{item.name}</div>
                    <div className="mt-1 text-sm text-slate-500">{item.note}</div>
                  </div>
                  {/* Price + wait range */}
                  <div className="text-right">
                    <div className="text-sm font-semibold">{money(item.price)}</div>
                    <div className="mt-1 text-xs text-slate-400">
                      {item.wait}–{item.wait + 5} min
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </section>
  );
}
