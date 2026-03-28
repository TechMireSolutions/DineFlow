/**
 * @file DishDrawer.jsx
 * @description Content rendered inside the Sheet drawer when a dish is selected for customization.
 * Handles:
 *   - Gradient accent image preview
 *   - Doneness selector (Steaks only)
 *   - Add-on toggles with live price deltas
 *   - Estimated time preview
 *   - "Add to Order" CTA with live total
 */

import { Clock3 } from "lucide-react";
import { addOns } from "../data/menu";
import { money } from "../utils/format";

/**
 * DishDrawer — the body content of the dish customization sheet.
 *
 * @param {Object} props
 * @param {import("../data/menu").MenuItem} props.item
 *   The dish being customized
 * @param {string}   props.doneness      - Selected doneness level (Steaks only)
 * @param {Function} props.onDoneness    - Callback to update the doneness selection
 * @param {import("../data/menu").AddOn[]} props.selectedAddOns
 *   Currently selected add-on objects
 * @param {Function} props.onToggleAddon - Callback to add or remove an add-on
 * @param {number}   props.totalPrice    - Live total: item base price + add-on prices
 * @param {number}   props.cartLength    - Current cart item count (used to calculate wait time offset)
 * @param {Function} props.onAddToOrder  - Callback fired when "Add to Order" is tapped
 */
export default function DishDrawer({
  item,
  doneness,
  onDoneness,
  selectedAddOns,
  onToggleAddon,
  totalPrice,
  cartLength,
  onAddToOrder,
}) {
  /**
   * Dynamic wait range accounts for existing cart items
   * (+2 min per item already in queue)
   */
  const waitOffset = cartLength * 2;
  const waitMin   = item.wait + waitOffset;
  const waitMax   = item.wait + 5 + waitOffset;

  return (
    <>
      {/* Gradient accent banner — matches the dish card colour */}
      <div
        className="h-48 rounded-[28px]"
        style={{ background: item.accent }}
        aria-hidden="true"
      />

      {/* ── Doneness selector (Steaks category only) ── */}
      {item.category === "Steaks" && (
        <div className="mt-6">
          <div className="mb-3 text-sm font-medium text-slate-500">Doneness</div>
          <div className="flex flex-wrap gap-2">
            {["Rare", "Medium", "Well-done"].map((option) => (
              <button
                key={option}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  doneness === option
                    ? "bg-mint-600 text-white"
                    : "bg-[#f2f5f7] text-slate-500"
                }`}
                onClick={() => onDoneness(option)}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Add-ons section ── */}
      <div className="mt-6">
        <div className="mb-3 text-sm font-medium text-slate-500">Add-ons</div>
        <div className="space-y-3">
          {addOns.map((addon) => {
            /* Determine if this add-on is currently active */
            const active = selectedAddOns.some((x) => x.name === addon.name);
            return (
              <button
                key={addon.name}
                className={`flex w-full items-center justify-between rounded-[22px] border px-4 py-4 text-left transition ${
                  active
                    ? "border-mint-200 bg-[#f4faf7]"
                    : "border-[#edf2f3] bg-white"
                }`}
                onClick={() => onToggleAddon(addon)}
              >
                <span className="font-medium">{addon.name}</span>
                <span className="text-sm font-semibold">{money(addon.price)}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── ETA preview strip ── */}
      <div className="mt-6 rounded-[24px] bg-[#f8fafc] p-4">
        <div className="flex items-center justify-between text-sm text-slate-500">
          <span className="flex items-center gap-1.5">
            <Clock3 size={14} />
            Estimated time
          </span>
          <span>
            {waitMin}–{waitMax} mins
          </span>
        </div>
      </div>

      {/* ── Add to order CTA — shows live total price ── */}
      <button
        className="mt-6 w-full rounded-full bg-[#1f2937] px-5 py-4 text-sm font-medium text-white transition hover:bg-[#111827]"
        onClick={onAddToOrder}
      >
        Add to Order {money(totalPrice)}
      </button>
    </>
  );
}
