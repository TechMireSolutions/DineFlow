/**
 * @file KitchenDisplay.jsx
 * @description Kitchen Display System (KDS) panel component.
 * Shows two columns:
 *   1. Pending Orders — live tickets awaiting preparation, with a "Mark as Ready" action
 *   2. Completed Orders — fulfilled tickets with a checkmark confirmation
 *
 * Uses Framer Motion layout animations so cards animate smoothly when
 * orders are moved from pending → completed.
 */

import { AnimatePresence, motion } from "framer-motion";
import { Check, ChefHat, Clock3, Dot } from "lucide-react";

/**
 * KitchenDisplay — the KDS preview panel in the third dashboard column.
 *
 * @param {Object} props
 * @param {import("../data/kitchen").KitchenOrder[]} props.pendingOrders
 *   Orders currently awaiting kitchen preparation
 * @param {{ id: string, table: string }[]} props.completedOrders
 *   Orders that have been marked as ready
 * @param {Function} props.onMarkReady
 *   Callback when a pending order is marked ready; receives the order object
 */
export default function KitchenDisplay({ pendingOrders, completedOrders, onMarkReady }) {
  return (
    <section className="rounded-[34px] border border-[#edf2f3] bg-white p-5 shadow-[0_18px_44px_rgba(15,23,42,0.06)]">

      {/* Section header */}
      <div className="mb-5 flex items-start justify-between">
        <div>
          <div className="text-sm font-medium text-mint-700">Kitchen Display</div>
          <h2 className="mt-1 text-[28px] font-semibold leading-none tracking-tight md:text-[32px]">
            KDS preview
          </h2>
        </div>
        <ChefHat className="mt-1 text-mint-700" size={20} />
      </div>

      <div className="space-y-4">

        {/* ── Pending orders queue ── */}
        <div className="rounded-[28px] bg-[#fbfcfb] p-4">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-[22px] font-semibold leading-none tracking-tight">
              Pending Orders
            </h3>
            <span className="text-sm text-slate-400">{pendingOrders.length} live</span>
          </div>

          <div className="space-y-3">
            <AnimatePresence>
              {pendingOrders.map((order) => (
                /* layout prop ensures cards animate position when one is removed */
                <motion.div
                  key={order.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: 80 }}
                  className="rounded-[24px] border border-[#edf2f3] bg-white p-4 shadow-[0_10px_24px_rgba(15,23,42,0.05)]"
                >
                  {/* Ticket header — id, table, priority badge */}
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-[17px] font-semibold">{order.id}</div>
                      <div className="text-sm text-slate-500">Table {order.table}</div>
                    </div>
                    <span className="rounded-full bg-[#f4faf7] px-3 py-1 text-xs font-medium text-mint-700">
                      {order.priority}
                    </span>
                  </div>

                  {/* Elapsed time */}
                  <div className="mt-3 flex items-center gap-1 text-sm text-slate-400">
                    <Clock3 size={14} />
                    Ordered {order.minutesAgo} mins ago
                  </div>

                  {/* Line items */}
                  <div className="mt-3 space-y-1.5 text-sm text-slate-600">
                    {order.items.map((item) => (
                      <div key={item} className="flex items-center gap-1">
                        <Dot size={16} />
                        {item}
                      </div>
                    ))}
                  </div>

                  {/* Mark as ready — moves this ticket to completed */}
                  <button
                    className="mt-4 w-full rounded-full bg-[#1f2937] px-4 py-3 text-sm font-medium text-white transition hover:bg-[#111827]"
                    onClick={() => onMarkReady(order)}
                  >
                    Mark as Ready
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* ── Completed orders list ── */}
        <div className="rounded-[28px] bg-[#f3faf6] p-4">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-[22px] font-semibold leading-none tracking-tight">
              Completed
            </h3>
            <span className="text-sm text-mint-700">{completedOrders.length} finished</span>
          </div>

          <div className="space-y-3">
            <AnimatePresence>
              {completedOrders.map((order) => (
                <motion.div
                  key={order.id}
                  layout
                  initial={{ opacity: 0, y: 10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="rounded-[22px] bg-white px-4 py-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="text-[17px] font-semibold">{order.id}</div>
                      <div className="text-sm text-slate-500">Table {order.table}</div>
                    </div>
                    {/* Checkmark confirms fulfilment */}
                    <Check className="text-mint-700" size={18} />
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

      </div>
    </section>
  );
}
