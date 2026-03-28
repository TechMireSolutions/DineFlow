/**
 * @file App.jsx
 * @description Root application component for DineFlow.
 *
 * Acts as the single source of truth for all UI state and event handlers.
 * All rendering is delegated to focused sub-components; this file only:
 *   1. Declares state (useState / useMemo / useEffect)
 *   2. Defines event handler callbacks
 *   3. Assembles the layout by composing imported components
 *
 * Layout: three-column dashboard grid (floor plan | menu | KDS)
 * Overlays: table drawer, dish drawer, QR modal, order modal, cart bar, toast
 */

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ConciergeBell } from "lucide-react";

/* ── Data imports ───────────────────────────────────────────────────────── */
import { activeOrders }               from "./data/tables";
import { menuItems }                  from "./data/menu";
import { pendingSeed, completedSeed } from "./data/kitchen";

/* ── Component imports ──────────────────────────────────────────────────── */
import Header         from "./components/Header";
import FloorPlan      from "./components/FloorPlan";
import MenuPanel      from "./components/MenuPanel";
import KitchenDisplay from "./components/KitchenDisplay";
import Sheet          from "./components/Sheet";
import TableDrawer    from "./components/TableDrawer";
import DishDrawer     from "./components/DishDrawer";
import CartBar        from "./components/CartBar";
import QrModal        from "./components/QrModal";
import OrderModal     from "./components/OrderModal";
import Toast          from "./components/Toast";

export default function App() {
  /* ── Floor plan state ─────────────────────────────────────────────────── */
  /** Currently selected table object, or null when no drawer is open */
  const [selectedTable, setSelectedTable] = useState(null);

  /* ── Menu / ordering state ────────────────────────────────────────────── */
  /** Active category filter tab */
  const [selectedCategory, setSelectedCategory] = useState("Steaks");
  /** Dish currently highlighted in the preview card */
  const [selectedItem, setSelectedItem] = useState(menuItems[1]);
  /** Dish open in the customization drawer, or null */
  const [drawerItem, setDrawerItem] = useState(null);
  /** Doneness selection for steak dishes */
  const [doneness, setDoneness] = useState("Medium");
  /** Add-ons selected in the customization drawer */
  const [selectedAddOns, setSelectedAddOns] = useState([]);
  /** Cart — array of ordered items with qty, price, and wait */
  const [cart, setCart] = useState([]);

  /* ── UI / overlay state ───────────────────────────────────────────────── */
  /** Toast message string; empty string means no toast is shown */
  const [toast, setToast] = useState("");
  /** Whether the QR scan modal is open */
  const [showQr, setShowQr] = useState(false);
  /** Whether the order-placing overlay is active */
  const [placingOrder, setPlacingOrder] = useState(false);
  /** Phase of the order submission flow: idle → sending → done */
  const [orderStage, setOrderStage] = useState("idle");

  /* ── KDS state ────────────────────────────────────────────────────────── */
  const [pendingOrders,   setPendingOrders]   = useState(pendingSeed);
  const [completedOrders, setCompletedOrders] = useState(completedSeed);

  /* ── Side effects ─────────────────────────────────────────────────────── */

  /**
   * Auto-dismiss toast after 2.6 seconds.
   * Clears the previous timer if a new toast fires before the old one expires.
   */
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(""), 2600);
    return () => clearTimeout(timer);
  }, [toast]);

  /**
   * Order placement animation sequence:
   *   t=0:    stage = "sending"  (pulsing chef icon)
   *   t=1.4s: stage = "done"     (confirmation checkmark)
   *   t=2.6s: overlay closes, cart clears, success toast fires
   */
  useEffect(() => {
    if (!placingOrder) return;
    setOrderStage("sending");
    const a = setTimeout(() => setOrderStage("done"), 1400);
    const b = setTimeout(() => {
      setPlacingOrder(false);
      setOrderStage("idle");
      setToast("Order sent to kitchen.");
      setCart([]);
    }, 2600);
    return () => { clearTimeout(a); clearTimeout(b); };
  }, [placingOrder]);

  /* ── Derived / memoised values ────────────────────────────────────────── */

  /** Dishes in the currently selected category */
  const filteredItems = useMemo(
    () => menuItems.filter((i) => i.category === selectedCategory),
    [selectedCategory],
  );

  /** When the category changes, auto-select the first dish in the new list */
  useEffect(() => {
    if (filteredItems.length) setSelectedItem(filteredItems[0]);
  }, [filteredItems]);

  /**
   * Live price for the dish in the customization drawer.
   * = base price + sum of selected add-on prices
   */
  const customizationPrice = useMemo(
    () =>
      drawerItem
        ? drawerItem.price + selectedAddOns.reduce((s, a) => s + a.price, 0)
        : 0,
    [drawerItem, selectedAddOns],
  );

  /**
   * Aggregated cart statistics used by the CartBar.
   * dynamicWait accounts for queue depth: +2 min per extra cart item
   */
  const cartStats = useMemo(() => {
    const items       = cart.reduce((s, i) => s + i.qty, 0);
    const total       = cart.reduce((s, i) => s + i.price * i.qty, 0);
    const dynamicWait =
      cart.reduce((m, i) => Math.max(m, i.wait), 0) +
      Math.max(cart.length - 1, 0) * 2;
    return { items, total, dynamicWait };
  }, [cart]);

  /** Active order for the currently selected table (may be undefined) */
  const tableOrder = selectedTable ? activeOrders[selectedTable.id] : null;

  /* ── Event handlers ───────────────────────────────────────────────────── */

  /** Open the dish customization drawer and reset its local state */
  const openCustomization = (item) => {
    setDrawerItem(item);
    setDoneness("Medium");
    setSelectedAddOns([]);
  };

  /** Toggle an add-on on or off in the customization drawer */
  const toggleAddon = (addon) =>
    setSelectedAddOns((cur) =>
      cur.some((x) => x.name === addon.name)
        ? cur.filter((x) => x.name !== addon.name)
        : [...cur, addon],
    );

  /** Commit the currently customized dish to the cart and close the drawer */
  const addToOrder = () => {
    if (!drawerItem) return;
    setCart((cur) => [
      ...cur,
      {
        id:    `${drawerItem.id}-${Date.now()}`, // unique key per cart line
        qty:   1,
        price: customizationPrice,
        wait:  drawerItem.wait,
      },
    ]);
    setDrawerItem(null);
  };

  /** Move a pending KDS order into the completed list */
  const markReady = (order) => {
    setPendingOrders((cur)   => cur.filter((x) => x.id !== order.id));
    setCompletedOrders((cur) => [order, ...cur]);
  };

  /* ── Render ───────────────────────────────────────────────────────────── */
  return (
    <div className="min-h-screen bg-[#FDFDFD] text-slate-900">

      {/* Ambient radial gradient overlay — purely decorative */}
      <div
        className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top_left,rgba(91,174,130,0.13),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(15,23,42,0.05),transparent_24%)]"
        aria-hidden="true"
      />

      {/* Page content constrained to max-width */}
      <div className="relative mx-auto max-w-[1480px] px-4 py-6 sm:px-6 lg:px-8">

        {/* ── Top navigation header ── */}
        <Header
          onCallWaiter={() => setToast("Table 04 is requesting assistance.")}
          onScanQr={() => setShowQr(true)}
        />

        {/* ── Three-column dashboard grid ── */}
        <main className="dashboard-grid mt-6">
          <FloorPlan onSelectTable={setSelectedTable} />
          <MenuPanel
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            filteredItems={filteredItems}
            selectedItem={selectedItem}
            onSelectItem={setSelectedItem}
            onOpenCustomization={openCustomization}
            cartLength={cart.length}
          />
          <KitchenDisplay
            pendingOrders={pendingOrders}
            completedOrders={completedOrders}
            onMarkReady={markReady}
          />
        </main>
      </div>

      {/* ── Table detail sheet ── */}
      <AnimatePresence>
        {selectedTable && (
          <>
            {/* Semi-transparent backdrop — clicking it closes the drawer */}
            <motion.div
              className="fixed inset-0 z-40 bg-slate-950/20 backdrop-blur-[2px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedTable(null)}
            />
            <Sheet
              title={selectedTable.id}
              eyebrow="Table Detail"
              onClose={() => setSelectedTable(null)}
            >
              <TableDrawer table={selectedTable} order={tableOrder ?? null} />
            </Sheet>
          </>
        )}
      </AnimatePresence>

      {/* ── Dish customization sheet ── */}
      <AnimatePresence>
        {drawerItem && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-40 bg-slate-950/20 backdrop-blur-[2px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDrawerItem(null)}
            />
            <Sheet
              title={drawerItem.name}
              eyebrow="Customize Dish"
              onClose={() => setDrawerItem(null)}
            >
              <DishDrawer
                item={drawerItem}
                doneness={doneness}
                onDoneness={setDoneness}
                selectedAddOns={selectedAddOns}
                onToggleAddon={toggleAddon}
                totalPrice={customizationPrice}
                cartLength={cart.length}
                onAddToOrder={addToOrder}
              />
            </Sheet>
          </>
        )}
      </AnimatePresence>

      {/* ── QR scan modal ── */}
      <AnimatePresence>
        {showQr && <QrModal onClose={() => setShowQr(false)} />}
      </AnimatePresence>

      {/* ── Toast notification ── */}
      <AnimatePresence>
        {toast && <Toast message={toast} />}
      </AnimatePresence>

      {/* ── Floating cart summary bar (appears when cart has items) ── */}
      <AnimatePresence>
        {cart.length > 0 && (
          <CartBar
            cartStats={cartStats}
            onPlaceOrder={() => setPlacingOrder(true)}
          />
        )}
      </AnimatePresence>

      {/* ── Order placement animation overlay ── */}
      <AnimatePresence>
        {placingOrder && <OrderModal orderStage={orderStage} />}
      </AnimatePresence>

      {/* ── Persistent service mode indicator (desktop only) ── */}
      <div className="fixed bottom-4 left-4 z-30 hidden rounded-full border border-[#edf2f3] bg-white/92 px-4 py-3 text-sm text-slate-500 shadow-[0_14px_30px_rgba(15,23,42,0.08)] lg:flex lg:items-center lg:gap-2">
        <ConciergeBell size={16} className="text-mint-700" />
        Service mode active
      </div>
    </div>
  );
}
