/**
 * @file QrModal.jsx
 * @description QR code scanning modal component.
 * Displays a camera view placeholder with alignment instructions.
 * In a production app, this would integrate with a device camera API.
 */

import { motion } from "framer-motion";
import { Camera, X } from "lucide-react";

/**
 * QrModal — full-screen overlay with a centred camera scan frame.
 *
 * @param {Object}   props
 * @param {Function} props.onClose - Callback to dismiss the modal
 */
export default function QrModal({ onClose }) {
  return (
    /* Backdrop — semi-transparent blur overlay */
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/25 p-4 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Modal card — slides + scales up on enter */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20 }}
        className="w-full max-w-md rounded-[32px] border border-[#edf2f3] bg-white p-6 shadow-[0_30px_90px_rgba(15,23,42,0.16)]"
      >
        {/* Modal header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs font-medium uppercase tracking-[0.2em] text-mint-700">
              Mobile Integration
            </div>
            <h3 className="mt-1 text-[30px] font-semibold tracking-tight">
              Scan Table QR
            </h3>
          </div>
          <button
            className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100"
            onClick={onClose}
            aria-label="Close QR modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Camera frame placeholder */}
        <div className="mt-5 rounded-[28px] border border-dashed border-mint-200 bg-[#f4faf7] p-5">
          <div className="flex h-72 items-center justify-center rounded-[22px] bg-white">
            <div className="text-center">
              <Camera className="mx-auto text-mint-700" size={28} />
              <div className="mt-3 text-sm font-medium text-slate-700">
                Camera view placeholder
              </div>
              <div className="mt-1 text-xs text-slate-400">
                Align the table QR within the frame
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
