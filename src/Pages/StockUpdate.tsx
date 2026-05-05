import { useState } from "react";
import {
    Calendar,
    Plus,
    History,
    Package,
    ArrowRight
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
    useGetStockItemsQuery,
    useGetStockUpdatesQuery,
    useCreateStockUpdateMutation
} from "../services/api";
import { useSelector } from "react-redux";
import type { RootState } from "../features/Store/store";

const StockUpdate = () => {
    const { user } = useSelector((state: RootState) => state.auth);
    const { selectedBranch } = useSelector((state: RootState) => state.branch);
    const isAdmin = user?.role === "ADMIN";
    const isBoth = user?.role === "BOTH";

    // Theme colors based on user category
    const isWaffle = user?.category === "WAFFLE";
    const isCafe = user?.category === "CAFE";

    const accentColor = (isAdmin || isBoth) ? "indigo-500" : isWaffle ? "orange-500" : isCafe ? "teal-500" : "slate-900";
    const accentGradient = (isAdmin || isBoth)
        ? "from-indigo-600 to-purple-600"
        : isWaffle
            ? "from-orange-500 to-yellow-500"
            : isCafe
                ? "from-teal-500 to-cyan-500"
                : "from-slate-800 to-slate-900";

    const [activeTab, setActiveTab] = useState<"Opening Stock" | "Closing Stock" | "Damaged Stock">("Opening Stock");
    const [selectedItem, setSelectedItem] = useState("");
    const [quantity, setQuantity] = useState("");

    const today = new Date().toISOString().split('T')[0];

    const { data: stockItems } = useGetStockItemsQuery({
        shopType: (isAdmin || isBoth) ? undefined : (isWaffle ? "Waffle" : "Cafe")
    });

    const { data: todayEntries, isLoading } = useGetStockUpdatesQuery({
        date: today,
        shopType: (isAdmin || isBoth) ? undefined : (isWaffle ? "Waffle" : "Cafe"),
    } as any);

    const [createUpdate, { isLoading: isSubmitting }] = useCreateStockUpdateMutation();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedItem || !quantity) return toast.error("Please fill all fields");

        try {
            await createUpdate({
                stockItemId: selectedItem,
                type: activeTab,
                quantity: Number(quantity),
                shopType: isAdmin ? (stockItems?.find(i => i._id === selectedItem)?.shopType || "Waffle") : (isWaffle ? "Waffle" : "Cafe"),
                branch: (user?.businessType === "STALL" && user?.category === "WAFFLE") ? (selectedBranch || "Branch 1") : "-"
            } as any).unwrap();

            toast.success(`${activeTab} updated successfully`);
            setSelectedItem("");
            setQuantity("");
        } catch (err) {
            toast.error("Failed to update stock");
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-black tracking-tight text-slate-900">Stock Update</h1>
                <p className="text-slate-500 font-medium">Daily inventory logging for opening, closing, and damaged stock.</p>
            </div>

            {/* Tabs */}
            <div className="flex flex-wrap gap-2 p-1.5 bg-white border border-slate-200 shadow-sm rounded-2xl w-full sm:w-fit">
                {["Opening Stock", "Closing Stock", "Damaged Stock"].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab as any)}
                        className={`flex-1 sm:flex-none px-4 lg:px-6 py-3 rounded-xl text-[11px] sm:text-sm font-black transition-all ${activeTab === tab
                            ? (isAdmin ? `bg-slate-900 text-white shadow-md` : `bg-gradient-to-r ${accentGradient} text-white shadow-md`)
                            : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Entry Form */}
                <motion.div
                    layout
                    className="lg:col-span-1 p-8 rounded-3xl bg-white border border-slate-200 shadow-sm h-fit"
                >
                    <div className="flex items-center gap-3 mb-8">
                        <div className={`p-2 bg-${accentColor}/10 rounded-xl`}>
                            <Plus className={`h-5 w-5 text-${accentColor}`} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900">New Entry</h3>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Date</label>
                            <div className="relative">
                                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    disabled
                                    type="date"
                                    value={today}
                                    className="w-full bg-slate-50 border border-slate-200 text-slate-500 pl-12 pr-4 py-4 rounded-2xl focus:outline-none cursor-not-allowed font-medium"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Stock Item</label>
                            <div className="relative">
                                <Package className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <select
                                    required
                                    value={selectedItem}
                                    onChange={(e) => setSelectedItem(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 pl-12 pr-4 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-slate-200 transition-all appearance-none font-medium"
                                >
                                    <option value="">Select Item</option>
                                    {stockItems?.map(item => (
                                        <option key={item._id} value={item._id}>
                                            {item.name} ({item.unit})
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Quantity</label>
                            <input
                                required
                                type="number"
                                placeholder="Enter quantity"
                                value={quantity}
                                onChange={(e) => setQuantity(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 text-slate-900 px-5 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-slate-200 transition-all font-medium"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={isAdmin
                                ? "w-full bg-slate-900 hover:bg-slate-800 py-4 rounded-2xl font-black text-white shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                : `w-full bg-gradient-to-r ${accentGradient} py-4 rounded-2xl font-black text-white shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50`
                            }
                        >
                            {isSubmitting ? "Submitting..." : (
                                <>
                                    Submit Entry
                                    <ArrowRight size={18} />
                                </>
                            )}
                        </button>
                    </form>
                </motion.div>

                {/* Today's Entries Table */}
                <motion.div
                    layout
                    className="lg:col-span-2 p-8 rounded-3xl bg-white border border-slate-200 shadow-sm"
                >
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-indigo-50 rounded-xl">
                                <History className="h-5 w-5 text-indigo-600" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900">Today's Entries</h3>
                        </div>
                        <div className="text-xs font-black text-slate-500 uppercase tracking-widest">
                            {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-slate-200 bg-slate-50">
                                    <th className="px-4 py-3 text-[10px] font-black text-slate-500 uppercase tracking-widest rounded-tl-xl rounded-bl-xl">Type</th>
                                    <th className="px-4 py-3 text-[10px] font-black text-slate-500 uppercase tracking-widest">Item</th>
                                    <th className="px-4 py-3 text-[10px] font-black text-slate-500 uppercase tracking-widest">Qty</th>
                                    <th className="px-4 py-3 text-[10px] font-black text-slate-500 uppercase tracking-widest">Shop</th>
                                    <th className="px-4 py-3 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right rounded-tr-xl rounded-br-xl">Time</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={5} className="py-10 text-center text-slate-500 font-bold">
                                            Loading entries...
                                        </td>
                                    </tr>
                                ) : todayEntries?.map((entry: any) => (
                                    <tr key={entry._id} className="group hover:bg-slate-50 transition-colors">
                                        <td className="px-4 py-4">
                                            <span className={`text-[10px] font-black uppercase tracking-tighter ${entry.type === 'Opening Stock' ? 'text-green-600 bg-green-50 px-2 py-1 rounded' :
                                                entry.type === 'Closing Stock' ? 'text-blue-600 bg-blue-50 px-2 py-1 rounded' : 'text-red-600 bg-red-50 px-2 py-1 rounded'
                                                }`}>
                                                {entry.type.split(' ')[0]}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4 font-bold text-slate-800">{entry.stockItemId?.name}</td>
                                        <td className="px-4 py-4 font-black text-slate-900">{entry.quantity}</td>
                                        <td className="px-4 py-4">
                                            <span className={`px-2 py-1 rounded text-[9px] font-black uppercase tracking-widest ${entry.shopType === 'Waffle' ? 'bg-orange-50 text-orange-600' :
                                                entry.shopType === 'Cafe' ? 'bg-teal-50 text-teal-600' : 'bg-indigo-50 text-indigo-600'
                                                }`}>
                                                {entry.shopType}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4 text-right text-xs text-slate-500 font-medium">
                                            {new Date(entry.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </td>
                                    </tr>
                                ))}
                                {!isLoading && todayEntries?.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="py-10 text-center text-slate-500 font-medium italic">
                                            No entries recorded today.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default StockUpdate;
