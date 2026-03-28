/**
 * @file CartBar.jsx
 * @description Fixed bottom cart summary bar.
 * Appears when the customer has added at least one item to their order.
 * Displays item count, total price, dynamic kitchen ETA, and a Place Order button.
 * Animates in/out from the bottom via Framer Motion.
 */

import { motion } from "framer-motion";
import { Wine } from "lucide-react";
import { money } from "../utils/format";

/**
 * CartBar — a floating action bar anchored to the bottom of the viewport.
 *
 * @param {Object} props
 * @param {{ items: number, total: number, dynamicWait: number }} props.cartStats
 *   - items:       total quantity of all cart entries
 *   - total:       sum price of all cart entries
 *   - dynamicWait: estimated kitchen prep time in minutes
 * @param {Function} props.onPlaceOrder - Callback fired when "Place Order" is clicked
 */
export default function CartBar({ cartStats, onPlaceOrder }) {
  return (
    <motion.div
      className="fixed bottom-4 left-1/2 z-[55] w-[min(920px,calc(100vw-1.5rem))] -translate-x-1/2 rounded-[28px] border border-[#edf2f3] bg-white/96 px-5 py-4 shadow-[0_24px_60px_rgba(15,23,42,0.12)] backdrop-blur"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 24 }}
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

        {/* Left side — icon + item count + total price */}
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f4faf7] text-mint-700">
            <Wine size={18} />
          </div>
          <div>
            <div className="text-xs uppercase tracking-[0.22em] text-slate-400">
              Quick Summary
            </div>
            <div className="mt-1 text-xl font-semibold">
              {cartStats.items} items | {money(cartStats.total)}
            </div>
          </div>
        </div>

        {/* Right side — ETA badge + place order CTA */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="rounded-full bg-[#f8fafc] px-4 py-2 text-sm text-slate-500">
            Kitchen ETA {cartStats.dynamicWait}–{cartStats.dynamicWait + 5} min
          </div>
          <button
            className="rounded-full bg-mint-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-mint-700"
            onClick={onPlaceOrder}
          >
            Place Order
          </button>
        </div>

      </div>
    </motion.div>
  );
}
