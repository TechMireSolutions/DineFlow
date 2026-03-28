/**
 * @file Header.jsx
 * @description Top application header for DineFlow.
 * Displays:
 *   - Brand name and service description
 *   - Live KPI stats (Occupancy, Avg Prep, Waitlist)
 *   - "Call Waiter" and "Scan Table QR" action buttons
 */

import { QrCode, Sparkles } from "lucide-react";

/**
 * Header — the sticky top bar with brand identity, KPIs, and top-level actions.
 *
 * @param {Object}   props
 * @param {Function} props.onCallWaiter - Fires a waiter-request toast notification
 * @param {Function} props.onScanQr    - Opens the QR scan modal
 */
export default function Header({ onCallWaiter, onScanQr }) {
  /** KPI tiles shown in the stats ribbon below the brand name */
  const kpis = [
    { label: "Occupancy", value: "67%" },
    { label: "Avg Prep",  value: "14 min" },
    { label: "Waitlist",  value: "05 parties" },
  ];

  return (
    <header className="rounded-[34px] border border-[#edf2f3] bg-white/92 px-6 py-5 shadow-[0_20px_50px_rgba(15,23,42,0.08)] backdrop-blur">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">

        {/* Brand identity block */}
        <div>
          <div className="flex items-center gap-2 text-sm font-medium text-mint-700">
            <Sparkles size={14} />
            Chalk &amp; Mint service orchestration
          </div>
          <h1 className="mt-2 text-[34px] font-semibold leading-none tracking-tight md:text-[42px]">
            DineFlow
          </h1>
          <p className="mt-3 max-w-2xl text-[15px] leading-6 text-slate-500">
            Premium restaurant operations across floor control, ordering, and
            kitchen flow with a live service-layer feel.
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col gap-3 sm:flex-row lg:pt-1">
          <button
            className="rounded-full border border-[#e9eef1] bg-white px-5 py-3 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
            onClick={onCallWaiter}
          >
            Call Waiter
          </button>
          <button
            className="flex items-center justify-center gap-2 rounded-full bg-mint-600 px-5 py-3 text-sm font-medium text-white shadow-[0_14px_26px_rgba(91,174,130,0.24)] transition hover:bg-mint-700"
            onClick={onScanQr}
          >
            <QrCode size={16} />
            Scan Table QR
          </button>
        </div>
      </div>

      {/* KPI stats ribbon */}
      <div className="mt-5 grid gap-3 md:grid-cols-3 lg:max-w-[760px]">
        {kpis.map((kpi, i) => (
          <div
            key={kpi.label}
            /* Alternate background shade for the middle tile */
            className={`rounded-[22px] px-4 py-3 ${i !== 1 ? "bg-[#f7faf8]" : "bg-[#fafafa]"}`}
          >
            <div className="text-[11px] uppercase tracking-[0.22em] text-slate-400">
              {kpi.label}
            </div>
            <div className="mt-1 text-[26px] font-semibold">{kpi.value}</div>
          </div>
        ))}
      </div>
    </header>
  );
}
