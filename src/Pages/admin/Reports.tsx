import { useState } from "react";
import { useGetStockUpdatesQuery } from "../../services/api";
// import { useSelector } from "react-redux";
// import type { RootState } from "../../features/Store/store";
import { AlertTriangle, ArrowDownCircle, ArrowUpCircle, Download, Search } from "lucide-react";

const Reports = () => {
    // const { user } = useSelector((state: RootState) => state.auth);
    // const isAdmin = user?.role === "ADMIN";
    const [shopFilter, setShopFilter] = useState("All");
    const [searchTerm, setSearchTerm] = useState("");

    const { data: stockUpdates, isLoading } = useGetStockUpdatesQuery({
        shopType: shopFilter === "All" ? undefined : shopFilter
    });

    const filteredUpdates = stockUpdates?.filter((update: any) =>
        update.stockItemId?.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-slate-900">Stock Report</h1>
                    <p className="text-slate-500 font-medium">Daily movement and inventory logs across all categories.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="px-6 py-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 rounded-xl font-bold flex items-center gap-2 transition-all shadow-sm">
                        <Download size={18} />
                        Export CSV
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                        type="text"
                        placeholder="Filter by item name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-white border border-slate-200 text-slate-900 pl-12 pr-4 py-3.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-200 transition-all shadow-sm font-medium"
                    />
                </div>
                <div className="flex items-center gap-2 bg-white border border-slate-200 shadow-sm rounded-xl p-1.5">
                    {["All", "Waffle", "Cafe", "Both"].map((shop) => (
                        <button
                            key={shop}
                            onClick={() => setShopFilter(shop)}
                            className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${shopFilter === shop
                                ? "bg-slate-900 text-white shadow-sm"
                                : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
                                }`}
                        >
                            {shop}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table */}
            <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-slate-200 bg-slate-50">
                                <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest">Date</th>
                                <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest">Item</th>
                                <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest">Movement</th>
                                <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest">Quantity</th>
                                <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest">Shop</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-10 text-center text-slate-500 font-bold">Loading report...</td>
                                </tr>
                            ) : filteredUpdates?.map((update: any) => (
                                <tr key={update._id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <span className="text-sm font-bold text-slate-600">{new Date(update.date).toLocaleDateString()}</span>
                                    </td>
                                    <td className="px-6 py-4 font-bold text-slate-900">{update.stockItemId?.name}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            {update.type === "Opening Stock" ? (
                                                <ArrowUpCircle className="text-green-400" size={16} />
                                            ) : update.type === "Closing Stock" ? (
                                                <ArrowDownCircle className="text-blue-400" size={16} />
                                            ) : (
                                                <AlertTriangle className="text-red-400" size={16} />
                                            )}
                                            <span className="text-xs font-black uppercase tracking-widest">{update.type}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="font-black text-slate-900">{update.quantity} {update.stockItemId?.unit}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest ${update.shopType === 'Waffle' ? 'bg-orange-50 text-orange-600' :
                                            update.shopType === 'Cafe' ? 'bg-teal-50 text-teal-600' : 'bg-indigo-50 text-indigo-600'
                                            }`}>
                                            {update.shopType}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Reports;
