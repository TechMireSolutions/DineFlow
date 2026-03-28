/**
 * @file Toast.jsx
 * @description Fixed top-right notification toast component.
 * Animates in/out vertically and auto-dismisses via a timer managed in App.jsx.
 * Rendered inside an AnimatePresence block so exit animations fire correctly.
 */

import { motion } from "framer-motion";

/**
 * Toast — a transient notification banner.
 *
 * @param {Object} props
 * @param {string} props.message - The text content to display inside the toast
 */
export default function Toast({ message }) {
  return (
    <motion.div
      /* Slide down into view from above, slide back up on exit */
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      className="fixed right-4 top-4 z-[60] rounded-full border border-[#dcefe3] bg-white px-5 py-3 text-sm font-medium text-slate-700 shadow-[0_16px_32px_rgba(15,23,42,0.1)]"
      role="status"
      aria-live="polite"
    >
      {message}
    </motion.div>
  );
}
