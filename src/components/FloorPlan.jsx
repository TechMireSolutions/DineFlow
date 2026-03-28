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

        {/* ── Mobile card grid (hidden on ≥920px) ── */}
        <div className="floor-mobile grid gap-3">
          {tables.map((table) => (
            <button
              key={`${table.id}-mobile`}
              className="rounded-[24px] border border-[#edf2f3] bg-white p-4 text-left shadow-[0_10px_24px_rgba(15,23,42,0.05)]"
              onClick={() => onSelectTable(table)}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="text-[13px] font-semibold">{table.id}</div>
                  <div className="text-[11px] text-slate-400">{table.zone}</div>
                </div>
                <span
                  className={`rounded-full border px-2 py-1 text-[10px] font-medium ${statusClass[table.status]}`}
                >
                  {table.status}
                </span>
              </div>
              <div className="mt-4">
                <div className="mb-1 flex items-center gap-1 text-[10px] uppercase tracking-[0.22em] text-slate-300">
                  <UtensilsCrossed size={11} />
                  Seats
                </div>
                <div className="text-[22px] font-semibold tracking-tight">{table.seats}</div>
              </div>
            </button>
          ))}
        </div>

        {/* ── Desktop spatial map (hidden below 920px) ── */}
        
        {/* We use a flex container that CENTERS the map vertically if the card stretches */}
        <div className="floor-desktop flex-1 flex flex-col justify-center w-full min-h-[400px]">
          {/* Zone label row — uses a 3-column grid for perfect alignment with the map sections */}
          <div className="floor-desktop-row grid grid-cols-3 mb-6 text-xs uppercase tracking-[0.25em] font-black text-slate-300">
            <span className="text-left">Host Stand</span>
            <span className="text-center">Open Service Lane</span>
            <span className="text-right">Chef Pass</span>
          </div>

          {/* 
              Absolute-positioned table map container.
              LOCKED to aspect-ratio 4/3 to prevent table stretching (no more ovals).
          */}
          <div className="floor-desktop relative aspect-[4/3] w-full rounded-[36px] border border-dashed border-[#e2e8f0] bg-[linear-gradient(180deg,rgba(250,252,251,1)_0%,rgba(240,248,244,1)_100%)] shadow-[inset_0_2px_12px_rgba(0,0,0,0.02)]">

            {/* Contextual zone labels — moved for maximum clarity */}
            <div className="absolute left-4 top-4 z-0 rounded-full bg-white/95 px-4 py-2 text-[11px] md:text-xs font-bold text-slate-400 shadow-sm border border-slate-100">
              Window Seats
            </div>
            <div className="absolute bottom-8 left-1/2 z-0 -translate-x-1/2 rounded-full bg-[#1f2937]/90 px-6 py-2.5 text-[11px] md:text-xs font-bold text-white shadow-2xl backdrop-blur-sm">
              Main Dining Floor
            </div>
            <div className="absolute top-4 right-16 z-0 rounded-full bg-[#1f2937]/80 px-4 py-2 text-[10px] md:text-xs font-bold text-white shadow-xl backdrop-blur-sm">
              Bar Counter
            </div>
            
            {/* Visual Service corridor indicator */}
            <div className="absolute right-3 top-1/2 z-0 flex h-[60%] w-[38px] -translate-y-1/2 items-center justify-center rounded-[22px] bg-mint-50/60 px-1 py-4 text-center text-[10px] md:text-[11px] font-black uppercase tracking-[0.35em] text-mint-500/50 [writing-mode:vertical-lr] border border-mint-200/20">
              Service
            </div>

            {/* Individual table buttons — now using percentage dimensions for fluid scaling */}
            {tables.map((table) => {
              const isCircle = table.shape === "circle";
              
              return (
                <button
                  key={table.id}
                  className="absolute z-10 border border-[#edf3f1] bg-white p-2 md:p-3 text-left shadow-[0_12px_32px_rgba(15,23,42,0.07)] transition-all duration-300 hover:-translate-y-1.5 hover:z-20 hover:shadow-[0_24px_48px_rgba(15,23,42,0.12)] active:scale-95 group"
                  style={{
                    top:          table.top,
                    left:         table.left,
                    width:        table.width,
                    height:       table.height,
                    borderRadius: isCircle ? "50%" : "28px",
                  }}
                  onClick={() => onSelectTable(table)}
                >
                  {/* High-visibility Status Dot for circle tables */}
                  {isCircle && (
                    <div 
                      className={`absolute right-[12%] top-[12%] h-3 w-3 rounded-full border-2 border-white shadow-sm md:h-4 md:w-4 ${
                        table.status === "Available" ? "bg-emerald-400" : 
                        table.status === "Occupied" ? "bg-amber-400" : "bg-slate-400"
                      }`} 
                    />
                  )}

                  <div className={`flex h-full flex-col ${isCircle ? 'items-center justify-center text-center' : 'justify-between'}`}>
                    <div className={`flex flex-col ${!isCircle ? 'w-full' : ''}`}>
                      <div className="flex items-start justify-between gap-1">
                        <div className={`min-w-0 ${isCircle ? 'w-full' : ''}`}>
                          <div className={`${isCircle ? 'text-[14px] md:text-[18px]' : 'text-[13px] md:text-[16px]'} font-black text-slate-800 leading-none`}>
                            {table.id}
                          </div>
                          <div className={`text-[8px] md:text-[11px] text-slate-500 mt-1 font-black truncate uppercase tracking-tight`}>
                            {table.zone}
                          </div>
                        </div>
                        
                        {!isCircle && (
                          <span
                            className={`rounded-full border px-2 md:px-3 py-1 text-[9px] md:text-[11px] font-black whitespace-nowrap hidden xs:inline-block shadow-sm ${statusClass[table.status]}`}
                          >
                            {table.status === "Available" ? "AVAIL" : table.status === "Occupied" ? "OCC" : "CLEAN"}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Footer: Seats count with icon */}
                    <div className={`${isCircle ? 'mt-1' : 'mt-auto'}`}>
                      <div className={`flex items-center gap-1.5 ${isCircle ? 'justify-center' : ''} text-slate-400`}>
                        <UtensilsCrossed size={isCircle ? 10 : 13} className="opacity-40" />
                        <span className="hidden md:inline text-[9px] md:text-[11px] font-black uppercase tracking-widest text-slate-400/70">Seats</span>
                        <span className={`${isCircle ? 'text-[16px] md:text-[19px]' : 'text-[18px] md:text-[22px]'} font-black text-slate-900 leading-none`}>
                          {table.seats}
                        </span>
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}



          </div>
        </div>
      </div>
    </section>
  );
}
