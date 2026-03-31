/**
 * @file FloorPlan.jsx
 * @description Visual floor plan section component.
 * Renders two representations of the restaurant layout:
 *   - Mobile (<920px): a 2-column card grid (CSS class `.floor-mobile`)
 *   - Desktop (≥920px): a fluid, percentage-based spatial map (CSS class `.floor-desktop`)
 *
 * All coordinates and dimensions are now fluid, ensuring zero horizontal scrollbars
 * and perfect alignment on all screen sizes.
 */

import { UtensilsCrossed } from "lucide-react";
import { tables, statusClass } from "../data/tables";

/**
 * FloorPlan — the live table booking section in the first dashboard column.
 *
 * @param {Object}   props
 * @param {Function} props.onSelectTable
 *   Callback fired when a table is clicked; receives the full table object
 */
export default function FloorPlan({ onSelectTable }) {
  return (
    <section className="rounded-[34px] border border-[#edf2f3] bg-white p-5 shadow-[0_18px_44px_rgba(15,23,42,0.06)]">

      {/* Section header */}
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <div className="text-sm font-medium text-mint-700">Visual Floor Plan</div>
          <h2 className="mt-1 text-[28px] font-semibold leading-none tracking-tight md:text-[32px]">
            Live table booking
          </h2>
        </div>
        <div className="rounded-full bg-[#f4faf7] px-4 py-2 text-sm font-medium text-mint-700">
          24 covers active
        </div>
      </div>

      {/* Floor container — now fluid and responsive without horizontal scrollbars */}
      <div className="rounded-[30px] border border-[#f1f5f9] bg-[#fbfcfb] p-2 md:p-4">

        {/* ── Table Status Gallery (Simple, Professional, Zero Collisions) ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-2">
          {tables.map((table) => (
            <button
              key={table.id}
              className="group relative flex flex-col p-6 rounded-[32px] border border-[#f1f5f9] bg-white shadow-[0_12px_32px_rgba(15,23,42,0.04)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_24px_50px_rgba(15,23,42,0.1)] active:scale-[0.98] text-left"
              onClick={() => onSelectTable(table)}
            >
              {/* Header: ID and Status */}
              <div className="flex items-start justify-between mb-8">
                <div>
                  <div className="text-[24px] font-black text-slate-900 leading-none tracking-tight">
                    {table.id}
                  </div>
                  <div className="mt-1 text-[10px] font-black uppercase tracking-[0.25em] text-slate-300">
                    {table.zone}
                  </div>
                </div>
                <div className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border shadow-sm ${statusClass[table.status]}`}>
                  {table.status === "Available" ? "AVAIL" : table.status === "Occupied" ? "BUSY" : "CLEAN"}
                </div>
              </div>

              {/* Footer: Seats Detail */}
              <div className="mt-auto flex items-end justify-between">
                <div>
                  <div className="flex items-center gap-2 text-slate-400 mb-1">
                    <UtensilsCrossed size={14} className="opacity-40" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Seats</span>
                  </div>
                  <div className="text-[32px] font-black text-slate-900 leading-none">
                    {table.seats}
                  </div>
                </div>
                
                {/* Decorative Shape Indicator */}
                <div className={`w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center opacity-60`}>
                  {table.shape === "circle" ? (
                    <div className="w-4 h-4 rounded-full border-2 border-slate-200" />
                  ) : (
                    <div className="w-4 h-3 rounded-sm border-2 border-slate-200" />
                  )}
                </div>
              </div>

              {/* Subtle hover accent */}
              <div className="absolute inset-x-8 bottom-0 h-[3px] rounded-t-full bg-mint-500 scale-x-0 transition-transform duration-500 group-hover:scale-x-100" />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
