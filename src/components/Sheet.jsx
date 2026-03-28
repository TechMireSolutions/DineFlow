/**
 * @file Sheet.jsx
 * @description Reusable animated slide-out drawer (sheet) component.
 * Slides in from the right with a spring animation via Framer Motion.
 * Used for both the Table Detail and Dish Customization panels.
 */

import { motion } from "framer-motion";
import { X } from "lucide-react";
import { sheetMotion } from "../utils/format";

/**
 * Sheet — a fixed right-side drawer with a header and scrollable body.
 *
 * @param {Object}      props
 * @param {string}      props.title    - Large heading displayed in the header
 * @param {string}      props.eyebrow  - Small uppercase label above the title
 * @param {Function}    props.onClose  - Callback invoked when the close button is clicked
 * @param {React.ReactNode} props.children - Content rendered in the scrollable body
 */
export default function Sheet({ title, eyebrow, onClose, children }) {
  return (
    <motion.aside
      {...sheetMotion}
      className="fixed inset-y-3 right-3 z-50 w-[min(430px,calc(100vw-1.5rem))] overflow-hidden rounded-[32px] border border-[#edf2f3] bg-white shadow-[0_30px_90px_rgba(15,23,42,0.16)]"
    >
      {/* Sheet header — eyebrow label + title + close button */}
      <div className="flex items-center justify-between border-b border-[#f2f5f7] px-6 py-5">
        <div>
          <div className="text-xs font-medium uppercase tracking-[0.2em] text-mint-700">
            {eyebrow}
          </div>
          <h3 className="mt-1 text-[30px] font-semibold tracking-tight">{title}</h3>
        </div>
        <button
          className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100"
          onClick={onClose}
          aria-label="Close panel"
        >
          <X size={18} />
        </button>
      </div>

      {/* Scrollable body — fills remaining height below the header */}
      <div className="h-[calc(100%-88px)] overflow-y-auto px-6 py-6">
        {children}
      </div>
    </motion.aside>
  );
}
