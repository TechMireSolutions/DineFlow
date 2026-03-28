/**
 * @file OrderModal.jsx
 * @description Animated order-placing confirmation modal.
 * Cycles through two states — "sending" (pulsing chef icon) and
 * "done" (confirmation checkmark) — with smooth transitions between them.
 * Controlled entirely by `orderStage` state managed in App.jsx.
 */

import { AnimatePresence, motion } from "framer-motion";
import { Check, ChefHat } from "lucide-react";

/**
 * OrderModal — full-screen overlay showing live order submission progress.
 *
 * @param {Object} props
 * @param {"sending"|"done"} props.orderStage - Current phase of the order flow
 */
export default function OrderModal({ orderStage }) {
  return (
    /* Backdrop */
    <motion.div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/25 p-4 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Confirmation card */}
      <motion.div
        initial={{ opacity: 0, y: 18, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 18, scale: 0.98 }}
        className="w-full max-w-sm rounded-[32px] border border-[#edf2f3] bg-white p-8 text-center shadow-[0_30px_90px_rgba(15,23,42,0.16)]"
      >
        {/* Animate between the two stage views using mode="wait" so old stage exits before new one enters */}
        <AnimatePresence mode="wait">
          {orderStage === "sending" ? (
            /* ── Sending state — pulsing chef icon ── */
            <motion.div
              key="sending"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
            >
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#f4faf7] text-mint-700">
                <ChefHat size={28} className="animate-pulse" />
              </div>
              <div className="mt-5 text-2xl font-semibold">
                Sending order to Kitchen...
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Pushing the ticket to the chef line and syncing prep times.
              </p>
            </motion.div>
          ) : (
            /* ── Done state — success checkmark ── */
            <motion.div
              key="done"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
            >
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#eaf7ef] text-mint-700">
                <Check size={30} />
              </div>
              <div className="mt-5 text-2xl font-semibold">
                Kitchen confirmed
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                The order is live on the pass and prep has started.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
