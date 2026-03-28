/**
 * @file TableDrawer.jsx
 * @description Content rendered inside the Sheet drawer when a table is selected.
 * For occupied tables, shows guest info, active order line items, and a total bill card.
 * For available/cleaning tables, shows a contextual status message.
 */

import { money } from "../utils/format";
import { statusClass } from "../data/tables";

/**
 * TableDrawer — the body content of the table detail sheet.
 *
 * @param {Object} props
 * @param {import("../data/tables").Table} props.table
 *   The selected table object (id, status, zone, seats, etc.)
 * @param {{ guest: string, startedAt: string, server: string, items: {name:string, qty:number, price:number}[] } | null} props.order
 *   Active order for this table, or null if the table has no current order
 */
export default function TableDrawer({ table, order }) {
  /** Sum of all item totals for the active order */
  const billTotal = order
    ? order.items.reduce((sum, item) => sum + item.qty * item.price, 0)
    : 0;

  return (
    <>
      {/* Status and zone badges */}
      <div className="flex items-center gap-3">
        <span
          className={`rounded-full border px-3 py-2 text-sm font-medium ${statusClass[table.status]}`}
        >
          {table.status}
        </span>
        <span className="rounded-full bg-[#f8fafc] px-3 py-2 text-sm text-slate-500">
          {table.zone} zone
        </span>
      </div>

      {order ? (
        /* ── Occupied table — show active order details ── */
        <>
          {/* Guest info block */}
          <div className="mt-6 rounded-[28px] bg-[#f7faf8] p-5">
            <div className="text-xs uppercase tracking-[0.22em] text-slate-400">
              Guest
            </div>
            <div className="mt-2 text-2xl font-semibold">{order.guest}</div>
            <div className="mt-3 flex gap-3 text-sm text-slate-500">
              <span>Opened {order.startedAt}</span>
              <span>Server {order.server}</span>
            </div>
          </div>

          {/* Active order line items */}
          <div className="mt-6">
            <div className="mb-3 text-sm font-medium text-slate-500">
              Active Order
            </div>
            <div className="space-y-3">
              {order.items.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between rounded-[24px] border border-[#edf2f3] px-4 py-4"
                >
                  <div>
                    <div className="font-semibold">{item.name}</div>
                    <div className="text-sm text-slate-400">Qty {item.qty}</div>
                  </div>
                  {/* Line total = qty × unit price */}
                  <div className="font-semibold">{money(item.qty * item.price)}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Total bill card — dark surface for visual hierarchy */}
          <div className="mt-6 rounded-[28px] bg-[#1f2937] p-5 text-white">
            <div className="text-sm text-white/70">Total Bill</div>
            <div className="mt-2 text-4xl font-semibold">{money(billTotal)}</div>
          </div>
        </>
      ) : (
        /* ── Non-occupied table — contextual status message ── */
        <div className="mt-6 rounded-[28px] bg-[#f8fafc] p-5 text-sm leading-6 text-slate-500">
          {table.status === "Available"
            ? "This table is prepared for the next seating and is visible to the host queue."
            : "Housekeeping is refreshing this table before the next booking is released."}
        </div>
      )}
    </>
  );
}
