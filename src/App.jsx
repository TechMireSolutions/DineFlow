import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Camera, Check, ChefHat, Clock3, ConciergeBell, Dot, QrCode, Sparkles, UtensilsCrossed, Wine, X } from "lucide-react";

const tables = [
  { id: "T01", seats: 2, status: "Available", zone: "Window", shape: "circle", width: 90, height: 90, top: "15%", left: "8%" },
  { id: "T02", seats: 4, status: "Occupied", zone: "Center", shape: "rounded", width: 154, height: 98, top: "14%", left: "29%" },
  { id: "T03", seats: 6, status: "Cleaning", zone: "Terrace", shape: "rounded", width: 150, height: 106, top: "48%", left: "8%" },
  { id: "T04", seats: 2, status: "Available", zone: "Window", shape: "circle", width: 96, height: 96, top: "49%", left: "44%" },
  { id: "T05", seats: 8, status: "Occupied", zone: "Private", shape: "rounded", width: 184, height: 98, top: "77%", left: "8%" },
  { id: "T06", seats: 4, status: "Available", zone: "Bar", shape: "rounded", width: 104, height: 92, top: "78%", left: "62%" },
];
const activeOrders = {
  T02: { guest: "A. Rahman", startedAt: "7:14 PM", server: "Maya", items: [{ name: "Signature Steak", qty: 1, price: 48 }, { name: "Mashed Potatoes", qty: 1, price: 6 }, { name: "Mint Citrus Cooler", qty: 2, price: 11 }] },
  T05: { guest: "Corporate Dinner", startedAt: "7:02 PM", server: "Haris", items: [{ name: "Firewood Ribeye", qty: 2, price: 52 }, { name: "Charred Asparagus", qty: 2, price: 16 }, { name: "Velvet Tiramisu", qty: 3, price: 13 }] },
};
const categories = ["Appetizers", "Steaks", "Desserts", "Mocktails"];
const menuItems = [
  { id: 1, category: "Appetizers", name: "Crisp Burrata", price: 18, wait: 10, accent: "linear-gradient(135deg, #eef6f3 0%, #f7fbf8 48%, #d8eee4 100%)", note: "Tomato water, basil oil, smoked sea salt" },
  { id: 2, category: "Steaks", name: "Signature Steak", price: 48, wait: 18, accent: "linear-gradient(135deg, #2f3a45 0%, #4d6a5d 52%, #9bc9b2 100%)", note: "Prime striploin with cafe de Paris butter" },
  { id: 3, category: "Steaks", name: "Firewood Ribeye", price: 52, wait: 20, accent: "linear-gradient(135deg, #3b312d 0%, #6f5f4d 52%, #bfaf92 100%)", note: "Oak ember finish, rosemary jus, flaky salt" },
  { id: 4, category: "Desserts", name: "Velvet Tiramisu", price: 13, wait: 8, accent: "linear-gradient(135deg, #f7efe5 0%, #fdf8f1 48%, #d7e9de 100%)", note: "Mascarpone cloud, espresso creme, cacao dust" },
  { id: 5, category: "Mocktails", name: "Mint Citrus Cooler", price: 11, wait: 6, accent: "linear-gradient(135deg, #eff9f3 0%, #fdfefd 48%, #cfe9d9 100%)", note: "Fresh lime, mint pearls, sparkling citrus" },
];
const addOns = [{ name: "Mashed Potatoes", price: 6 }, { name: "Extra Sauce", price: 4 }, { name: "Charred Greens", price: 5 }];
const pendingSeed = [
  { id: "K-202", table: "T05", priority: "VIP", minutesAgo: 11, items: ["2 Ribeye", "2 Asparagus", "3 Tiramisu"] },
  { id: "K-203", table: "T03", priority: "Normal", minutesAgo: 3, items: ["1 Burrata", "1 Citrus Cooler"] },
];
const statusClass = { Available: "border-emerald-200 bg-white text-emerald-700", Occupied: "border-amber-200 bg-amber-50 text-amber-700", Cleaning: "border-slate-200 bg-slate-100 text-slate-600" };
const sheetMotion = { initial: { x: 360, opacity: 0 }, animate: { x: 0, opacity: 1 }, exit: { x: 360, opacity: 0 }, transition: { type: "spring", stiffness: 240, damping: 28 } };
const money = (v) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(v);

function Sheet({ title, eyebrow, onClose, children }) {
  return (
    <motion.aside {...sheetMotion} className="fixed inset-y-3 right-3 z-50 w-[min(430px,calc(100vw-1.5rem))] overflow-hidden rounded-[32px] border border-[#edf2f3] bg-white shadow-[0_30px_90px_rgba(15,23,42,0.16)]">
      <div className="flex items-center justify-between border-b border-[#f2f5f7] px-6 py-5">
        <div><div className="text-xs font-medium uppercase tracking-[0.2em] text-mint-700">{eyebrow}</div><h3 className="mt-1 text-[30px] font-semibold tracking-tight">{title}</h3></div>
        <button className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100" onClick={onClose}><X size={18} /></button>
      </div>
      <div className="h-[calc(100%-88px)] overflow-y-auto px-6 py-6">{children}</div>
    </motion.aside>
  );
}

export default function App() {
  const [selectedTable, setSelectedTable] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("Steaks");
  const [selectedItem, setSelectedItem] = useState(menuItems[1]);
  const [drawerItem, setDrawerItem] = useState(null);
  const [doneness, setDoneness] = useState("Medium");
  const [selectedAddOns, setSelectedAddOns] = useState([]);
  const [cart, setCart] = useState([]);
  const [toast, setToast] = useState("");
  const [showQr, setShowQr] = useState(false);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [orderStage, setOrderStage] = useState("idle");
  const [pendingOrders, setPendingOrders] = useState(pendingSeed);
  const [completedOrders, setCompletedOrders] = useState([{ id: "K-201", table: "T02" }]);

  useEffect(() => { if (!toast) return; const t = setTimeout(() => setToast(""), 2600); return () => clearTimeout(t); }, [toast]);
  useEffect(() => { if (!placingOrder) return; setOrderStage("sending"); const a = setTimeout(() => setOrderStage("done"), 1400); const b = setTimeout(() => { setPlacingOrder(false); setOrderStage("idle"); setToast("Order sent to kitchen."); setCart([]); }, 2600); return () => { clearTimeout(a); clearTimeout(b); }; }, [placingOrder]);

  const filteredItems = useMemo(() => menuItems.filter((i) => i.category === selectedCategory), [selectedCategory]);
  useEffect(() => { if (filteredItems.length) setSelectedItem(filteredItems[0]); }, [filteredItems]);
  const customizationPrice = useMemo(() => drawerItem ? drawerItem.price + selectedAddOns.reduce((s, a) => s + a.price, 0) : 0, [drawerItem, selectedAddOns]);
  const cartStats = useMemo(() => {
    const items = cart.reduce((s, i) => s + i.qty, 0);
    const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
    const dynamicWait = cart.reduce((m, i) => Math.max(m, i.wait), 0) + Math.max(cart.length - 1, 0) * 2;
    return { items, total, dynamicWait };
  }, [cart]);

  const tableOrder = selectedTable ? activeOrders[selectedTable.id] : null;
  const openCustomization = (item) => { setDrawerItem(item); setDoneness("Medium"); setSelectedAddOns([]); };
  const toggleAddon = (addon) => setSelectedAddOns((cur) => cur.some((x) => x.name === addon.name) ? cur.filter((x) => x.name !== addon.name) : [...cur, addon]);
  const addToOrder = () => { if (!drawerItem) return; setCart((cur) => [...cur, { id: `${drawerItem.id}-${Date.now()}`, qty: 1, price: customizationPrice, wait: drawerItem.wait }]); setDrawerItem(null); };
  const markReady = (order) => { setPendingOrders((cur) => cur.filter((x) => x.id !== order.id)); setCompletedOrders((cur) => [order, ...cur]); };

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-slate-900">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top_left,rgba(91,174,130,0.13),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(15,23,42,0.05),transparent_24%)]" />
      <div className="relative mx-auto max-w-[1480px] px-4 py-6 sm:px-6 lg:px-8">
        <header className="rounded-[34px] border border-[#edf2f3] bg-white/92 px-6 py-5 shadow-[0_20px_50px_rgba(15,23,42,0.08)] backdrop-blur">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <div className="flex items-center gap-2 text-sm font-medium text-mint-700"><Sparkles size={14} />Chalk & Mint service orchestration</div>
              <h1 className="mt-2 text-[34px] font-semibold leading-none tracking-tight md:text-[42px]">DineFlow</h1>
              <p className="mt-3 max-w-2xl text-[15px] leading-6 text-slate-500">Premium restaurant operations across floor control, ordering, and kitchen flow with a live service-layer feel.</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:pt-1">
              <button className="rounded-full border border-[#e9eef1] bg-white px-5 py-3 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:text-slate-900" onClick={() => setToast("Table 04 is requesting assistance.")}>Call Waiter</button>
              <button className="flex items-center justify-center gap-2 rounded-full bg-mint-600 px-5 py-3 text-sm font-medium text-white shadow-[0_14px_26px_rgba(91,174,130,0.24)] transition hover:bg-mint-700" onClick={() => setShowQr(true)}><QrCode size={16} />Scan Table QR</button>
            </div>
          </div>
          <div className="mt-5 grid gap-3 md:grid-cols-3 lg:max-w-[760px]">
            {["Occupancy|67%", "Avg Prep|14 min", "Waitlist|05 parties"].map((x, i) => {
              const [label, value] = x.split("|");
              return <div key={label} className={`rounded-[22px] px-4 py-3 ${i !== 1 ? "bg-[#f7faf8]" : "bg-[#fafafa]"}`}><div className="text-[11px] uppercase tracking-[0.22em] text-slate-400">{label}</div><div className="mt-1 text-[26px] font-semibold">{value}</div></div>;
            })}
          </div>
        </header>

        <main className="dashboard-grid mt-6">
          <section className="rounded-[34px] border border-[#edf2f3] bg-white p-5 shadow-[0_18px_44px_rgba(15,23,42,0.06)]">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div><div className="text-sm font-medium text-mint-700">Visual Floor Plan</div><h2 className="mt-1 text-[28px] font-semibold leading-none tracking-tight md:text-[32px]">Live table booking</h2></div>
              <div className="rounded-full bg-[#f4faf7] px-4 py-2 text-sm font-medium text-mint-700">24 covers active</div>
            </div>
            <div className="rounded-[30px] border border-[#f1f5f9] bg-[#fbfcfb] p-4">
              <div className="floor-mobile grid gap-3">
                {tables.map((table) => (
                  <button key={`${table.id}-mobile`} className="rounded-[24px] border border-[#edf2f3] bg-white p-4 text-left shadow-[0_10px_24px_rgba(15,23,42,0.05)]" onClick={() => setSelectedTable(table)}>
                    <div className="flex items-start justify-between gap-2">
                      <div><div className="text-[13px] font-semibold">{table.id}</div><div className="text-[11px] text-slate-400">{table.zone}</div></div>
                      <span className={`rounded-full border px-2 py-1 text-[10px] font-medium ${statusClass[table.status]}`}>{table.status}</span>
                    </div>
                    <div className="mt-4"><div className="mb-1 flex items-center gap-1 text-[10px] uppercase tracking-[0.22em] text-slate-300"><UtensilsCrossed size={11} />Seats</div><div className="text-[22px] font-semibold tracking-tight">{table.seats}</div></div>
                  </button>
                ))}
              </div>
              <div className="floor-desktop floor-desktop-row mb-4 text-xs uppercase tracking-[0.22em] text-slate-300"><span>Host Stand</span><span>Open Service Lane</span><span>Chef Pass</span></div>
              <div className="floor-desktop relative h-[360px] rounded-[28px] border border-dashed border-[#e8eef1] bg-[linear-gradient(180deg,rgba(249,251,250,1)_0%,rgba(245,249,247,1)_100%)] lg:h-[400px]">
                <div className="absolute left-4 top-4 rounded-full bg-white px-3 py-1.5 text-xs font-medium text-slate-400 shadow-sm">Window Seats</div>
                <div className="absolute bottom-5 right-5 rounded-full bg-[#1f2937] px-3 py-1.5 text-[10px] font-medium text-white">Bar Counter</div>
                <div className="absolute right-4 top-1/2 flex h-[72%] w-[64px] -translate-y-1/2 items-start justify-center rounded-[24px] bg-[linear-gradient(180deg,#f9fbfb_0%,#eef5f1_100%)] px-2 py-4 text-center text-[10px] uppercase tracking-[0.22em] text-slate-300">Service</div>
                {tables.map((table) => (
                  <button
                    key={table.id}
                    className="absolute border border-[#edf2f3] bg-white/95 p-3 text-left shadow-[0_12px_30px_rgba(15,23,42,0.06)] transition hover:-translate-y-1 hover:shadow-[0_18px_36px_rgba(15,23,42,0.08)]"
                    style={{ top: table.top, left: table.left, width: table.width, height: table.height, borderRadius: table.shape === "circle" ? 9999 : 30 }}
                    onClick={() => setSelectedTable(table)}
                  >
                    <div className="flex h-full flex-col justify-between">
                      <div className="flex items-start justify-between gap-2"><div><div className="text-[12px] font-semibold">{table.id}</div><div className="text-[10px] text-slate-400">{table.zone}</div></div><span className={`rounded-full border px-2 py-1 text-[10px] font-medium ${statusClass[table.status]}`}>{table.status}</span></div>
                      <div><div className="mb-1 flex items-center gap-1 text-[10px] uppercase tracking-[0.22em] text-slate-300"><UtensilsCrossed size={11} />Seats</div><div className="text-[18px] font-semibold tracking-tight">{table.seats}</div></div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </section>

          <section className="rounded-[34px] border border-[#edf2f3] bg-white p-5 shadow-[0_18px_44px_rgba(15,23,42,0.06)]">
            <div className="mb-5 flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between"><div><div className="text-sm font-medium text-mint-700">Interactive Menu</div><h2 className="mt-1 max-w-[14ch] text-[28px] font-semibold leading-none tracking-tight md:text-[32px]">Customer ordering view</h2></div><div className="rounded-full bg-[#f8fafc] px-4 py-2 text-sm text-slate-500">Dynamic ETA + live pricing</div></div>
            <div className="mb-5 flex flex-wrap gap-2">{categories.map((category) => <button key={category} className={`rounded-full px-4 py-2 text-sm font-medium transition ${selectedCategory === category ? "bg-mint-600 text-white shadow-[0_12px_20px_rgba(91,174,130,0.22)]" : "bg-[#f2f5f7] text-slate-500 hover:bg-[#eaeff2]"}`} onClick={() => setSelectedCategory(category)}>{category}</button>)}</div>
            <AnimatePresence mode="wait">
              <motion.div key={selectedCategory} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.28 }} className="menu-grid">
                {selectedItem ? <button className="overflow-hidden rounded-[30px] border border-[#edf2f3] bg-white text-left shadow-[0_16px_38px_rgba(15,23,42,0.06)]" onClick={() => openCustomization(selectedItem)}><div className="h-48 lg:h-56" style={{ background: selectedItem.accent }} /><div className="space-y-4 p-5"><div className="flex items-start justify-between gap-3"><div><h3 className="text-[24px] font-semibold leading-none tracking-tight md:text-[28px]">{selectedItem.name}</h3><p className="mt-3 max-w-md text-sm leading-6 text-slate-500">{selectedItem.note}</p></div><span className="rounded-full bg-[#f4faf7] px-3 py-1.5 text-sm font-semibold text-mint-700">{money(selectedItem.price)}</span></div><div className="flex items-center gap-2 text-sm text-slate-400"><Clock3 size={15} />Estimated time {selectedItem.wait + Math.max(cart.length - 1, 0) * 2}-{selectedItem.wait + 5 + Math.max(cart.length - 1, 0) * 2} mins</div></div></button> : null}
                <div className="space-y-3">{filteredItems.map((item) => <button key={item.id} className={`w-full rounded-[26px] border p-4 text-left transition ${selectedItem?.id === item.id ? "border-mint-200 bg-[#f6fbf8] shadow-[0_14px_28px_rgba(91,174,130,0.12)]" : "border-[#edf2f3] bg-white hover:border-slate-300"}`} onClick={() => setSelectedItem(item)}><div className="flex items-center justify-between gap-4"><div><div className="text-lg font-semibold">{item.name}</div><div className="mt-1 text-sm text-slate-500">{item.note}</div></div><div className="text-right"><div className="text-sm font-semibold">{money(item.price)}</div><div className="mt-1 text-xs text-slate-400">{item.wait}-{item.wait + 5} min</div></div></div></button>)}</div>
              </motion.div>
            </AnimatePresence>
          </section>

          <section className="rounded-[34px] border border-[#edf2f3] bg-white p-5 shadow-[0_18px_44px_rgba(15,23,42,0.06)]">
            <div className="mb-5 flex items-start justify-between"><div><div className="text-sm font-medium text-mint-700">Kitchen Display</div><h2 className="mt-1 text-[28px] font-semibold leading-none tracking-tight md:text-[32px]">KDS preview</h2></div><ChefHat className="mt-1 text-mint-700" size={20} /></div>
            <div className="space-y-4">
              <div className="rounded-[28px] bg-[#fbfcfb] p-4">
                <div className="mb-3 flex items-center justify-between"><h3 className="text-[22px] font-semibold leading-none tracking-tight">Pending Orders</h3><span className="text-sm text-slate-400">{pendingOrders.length} live</span></div>
                <div className="space-y-3"><AnimatePresence>{pendingOrders.map((order) => <motion.div key={order.id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: 80 }} className="rounded-[24px] border border-[#edf2f3] bg-white p-4 shadow-[0_10px_24px_rgba(15,23,42,0.05)]"><div className="flex items-start justify-between gap-3"><div><div className="text-[17px] font-semibold">{order.id}</div><div className="text-sm text-slate-500">Table {order.table}</div></div><span className="rounded-full bg-[#f4faf7] px-3 py-1 text-xs font-medium text-mint-700">{order.priority}</span></div><div className="mt-3 flex items-center gap-1 text-sm text-slate-400"><Clock3 size={14} />Ordered {order.minutesAgo} mins ago</div><div className="mt-3 space-y-1.5 text-sm text-slate-600">{order.items.map((item) => <div key={item} className="flex items-center gap-1"><Dot size={16} />{item}</div>)}</div><button className="mt-4 w-full rounded-full bg-[#1f2937] px-4 py-3 text-sm font-medium text-white transition hover:bg-[#111827]" onClick={() => markReady(order)}>Mark as Ready</button></motion.div>)}</AnimatePresence></div>
              </div>
              <div className="rounded-[28px] bg-[#f3faf6] p-4">
                <div className="mb-3 flex items-center justify-between"><h3 className="text-[22px] font-semibold leading-none tracking-tight">Completed</h3><span className="text-sm text-mint-700">{completedOrders.length} finished</span></div>
                <div className="space-y-3"><AnimatePresence>{completedOrders.map((order) => <motion.div key={order.id} layout initial={{ opacity: 0, y: 10, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0 }} className="rounded-[22px] bg-white px-4 py-4"><div className="flex items-center justify-between gap-3"><div><div className="text-[17px] font-semibold">{order.id}</div><div className="text-sm text-slate-500">Table {order.table}</div></div><Check className="text-mint-700" size={18} /></div></motion.div>)}</AnimatePresence></div>
              </div>
            </div>
          </section>
        </main>
      </div>

      <AnimatePresence>{selectedTable ? <><motion.div className="fixed inset-0 z-40 bg-slate-950/20 backdrop-blur-[2px]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedTable(null)} /><Sheet title={selectedTable.id} eyebrow="Table Detail" onClose={() => setSelectedTable(null)}><div className="flex items-center gap-3"><span className={`rounded-full border px-3 py-2 text-sm font-medium ${statusClass[selectedTable.status]}`}>{selectedTable.status}</span><span className="rounded-full bg-[#f8fafc] px-3 py-2 text-sm text-slate-500">{selectedTable.zone} zone</span></div>{tableOrder ? <><div className="mt-6 rounded-[28px] bg-[#f7faf8] p-5"><div className="text-xs uppercase tracking-[0.22em] text-slate-400">Guest</div><div className="mt-2 text-2xl font-semibold">{tableOrder.guest}</div><div className="mt-3 flex gap-3 text-sm text-slate-500"><span>Opened {tableOrder.startedAt}</span><span>Server {tableOrder.server}</span></div></div><div className="mt-6"><div className="mb-3 text-sm font-medium text-slate-500">Active Order</div><div className="space-y-3">{tableOrder.items.map((item) => <div key={item.name} className="flex items-center justify-between rounded-[24px] border border-[#edf2f3] px-4 py-4"><div><div className="font-semibold">{item.name}</div><div className="text-sm text-slate-400">Qty {item.qty}</div></div><div className="font-semibold">{money(item.qty * item.price)}</div></div>)}</div></div><div className="mt-6 rounded-[28px] bg-[#1f2937] p-5 text-white"><div className="text-sm text-white/70">Total Bill</div><div className="mt-2 text-4xl font-semibold">{money(tableOrder.items.reduce((s, i) => s + i.qty * i.price, 0))}</div></div></> : <div className="mt-6 rounded-[28px] bg-[#f8fafc] p-5 text-sm leading-6 text-slate-500">{selectedTable.status === "Available" ? "This table is prepared for the next seating and is visible to the host queue." : "Housekeeping is refreshing this table before the next booking is released."}</div>}</Sheet></> : null}</AnimatePresence>

      <AnimatePresence>{drawerItem ? <><motion.div className="fixed inset-0 z-40 bg-slate-950/20 backdrop-blur-[2px]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setDrawerItem(null)} /><Sheet title={drawerItem.name} eyebrow="Customize Dish" onClose={() => setDrawerItem(null)}><div className="h-48 rounded-[28px]" style={{ background: drawerItem.accent }} />{drawerItem.category === "Steaks" ? <div className="mt-6"><div className="mb-3 text-sm font-medium text-slate-500">Doneness</div><div className="flex flex-wrap gap-2">{["Rare", "Medium", "Well-done"].map((option) => <button key={option} className={`rounded-full px-4 py-2 text-sm font-medium transition ${doneness === option ? "bg-mint-600 text-white" : "bg-[#f2f5f7] text-slate-500"}`} onClick={() => setDoneness(option)}>{option}</button>)}</div></div> : null}<div className="mt-6"><div className="mb-3 text-sm font-medium text-slate-500">Add-ons</div><div className="space-y-3">{addOns.map((addon) => { const active = selectedAddOns.some((x) => x.name === addon.name); return <button key={addon.name} className={`flex w-full items-center justify-between rounded-[22px] border px-4 py-4 text-left transition ${active ? "border-mint-200 bg-[#f4faf7]" : "border-[#edf2f3] bg-white"}`} onClick={() => toggleAddon(addon)}><span className="font-medium">{addon.name}</span><span className="text-sm font-semibold">{money(addon.price)}</span></button>; })}</div></div><div className="mt-6 rounded-[24px] bg-[#f8fafc] p-4"><div className="flex items-center justify-between text-sm text-slate-500"><span>Estimated time</span><span>{drawerItem.wait + cart.length * 2}-{drawerItem.wait + 5 + cart.length * 2} mins</span></div></div><button className="mt-6 w-full rounded-full bg-[#1f2937] px-5 py-4 text-sm font-medium text-white transition hover:bg-[#111827]" onClick={addToOrder}>Add to Order {money(customizationPrice)}</button></Sheet></> : null}</AnimatePresence>

      <AnimatePresence>{showQr ? <motion.div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/25 p-4 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><motion.div initial={{ opacity: 0, y: 20, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20 }} className="w-full max-w-md rounded-[32px] border border-[#edf2f3] bg-white p-6 shadow-[0_30px_90px_rgba(15,23,42,0.16)]"><div className="flex items-center justify-between"><div><div className="text-xs font-medium uppercase tracking-[0.2em] text-mint-700">Mobile Integration</div><h3 className="mt-1 text-[30px] font-semibold tracking-tight">Scan Table QR</h3></div><button className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100" onClick={() => setShowQr(false)}><X size={18} /></button></div><div className="mt-5 rounded-[28px] border border-dashed border-mint-200 bg-[#f4faf7] p-5"><div className="flex h-72 items-center justify-center rounded-[22px] bg-white"><div className="text-center"><Camera className="mx-auto text-mint-700" size={28} /><div className="mt-3 text-sm font-medium text-slate-700">Camera view placeholder</div><div className="mt-1 text-xs text-slate-400">Align the table QR within the frame</div></div></div></div></motion.div></motion.div> : null}</AnimatePresence>

      <AnimatePresence>{toast ? <motion.div className="fixed right-4 top-4 z-[60] rounded-full border border-[#dcefe3] bg-white px-5 py-3 text-sm font-medium text-slate-700 shadow-[0_16px_32px_rgba(15,23,42,0.1)]" initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>{toast}</motion.div> : null}</AnimatePresence>

      <AnimatePresence>{cart.length ? <motion.div className="fixed bottom-4 left-1/2 z-[55] w-[min(920px,calc(100vw-1.5rem))] -translate-x-1/2 rounded-[28px] border border-[#edf2f3] bg-white/96 px-5 py-4 shadow-[0_24px_60px_rgba(15,23,42,0.12)] backdrop-blur" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 24 }}><div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"><div className="flex items-center gap-4"><div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f4faf7] text-mint-700"><Wine size={18} /></div><div><div className="text-xs uppercase tracking-[0.22em] text-slate-400">Quick Summary</div><div className="mt-1 text-xl font-semibold">{cartStats.items} items | {money(cartStats.total)}</div></div></div><div className="flex flex-col gap-3 sm:flex-row sm:items-center"><div className="rounded-full bg-[#f8fafc] px-4 py-2 text-sm text-slate-500">Kitchen ETA {cartStats.dynamicWait}-{cartStats.dynamicWait + 5} min</div><button className="rounded-full bg-mint-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-mint-700" onClick={() => setPlacingOrder(true)}>Place Order</button></div></div></motion.div> : null}</AnimatePresence>

      <AnimatePresence>{placingOrder ? <motion.div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/25 p-4 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><motion.div initial={{ opacity: 0, y: 18, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 18, scale: 0.98 }} className="w-full max-w-sm rounded-[32px] border border-[#edf2f3] bg-white p-8 text-center shadow-[0_30px_90px_rgba(15,23,42,0.16)]"><AnimatePresence mode="wait">{orderStage === "sending" ? <motion.div key="sending" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}><div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#f4faf7] text-mint-700"><ChefHat size={28} className="animate-pulse" /></div><div className="mt-5 text-2xl font-semibold">Sending order to Kitchen...</div><p className="mt-2 text-sm leading-6 text-slate-500">Pushing the ticket to the chef line and syncing prep times.</p></motion.div> : <motion.div key="done" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}><div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#eaf7ef] text-mint-700"><Check size={30} /></div><div className="mt-5 text-2xl font-semibold">Kitchen confirmed</div><p className="mt-2 text-sm leading-6 text-slate-500">The order is live on the pass and prep has started.</p></motion.div>}</AnimatePresence></motion.div></motion.div> : null}</AnimatePresence>

      <div className="fixed bottom-4 left-4 z-30 hidden rounded-full border border-[#edf2f3] bg-white/92 px-4 py-3 text-sm text-slate-500 shadow-[0_14px_30px_rgba(15,23,42,0.08)] lg:flex lg:items-center lg:gap-2"><ConciergeBell size={16} className="text-mint-700" />Service mode active</div>
    </div>
  );
}
