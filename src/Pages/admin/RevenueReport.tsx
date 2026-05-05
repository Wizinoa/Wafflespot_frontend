import { useState, useMemo } from "react";
import {
    IndianRupee,
    Download,
    Store,
    Coffee,
    BarChart3,
} from "lucide-react";
import { motion } from "framer-motion";
import { useGetBillsQuery } from "../../services/api";
const RevenueReport = () => {
    const [shopFilter, setShopFilter] = useState("All");

    const { data: bills, isLoading } = useGetBillsQuery({
        shopType: shopFilter === "All" ? undefined : shopFilter
    });

    const stats = useMemo(() => {
        if (!bills) return { total: 0, waffle: 0, cafe: 0, both: 0 };
        return bills.reduce((acc, bill) => {
            acc.total += (bill.totalAmount ?? bill.total ?? 0);
            if (bill.shopType === "Waffle") acc.waffle += (bill.totalAmount ?? bill.total ?? 0);
            else if (bill.shopType === "Cafe") acc.cafe += (bill.totalAmount ?? bill.total ?? 0);
            else if (bill.shopType === "Both") acc.both += (bill.totalAmount ?? bill.total ?? 0);
            return acc;
        }, { total: 0, waffle: 0, cafe: 0, both: 0 });
    }, [bills]);

    const cards = [
        { title: "Total Revenue", value: `₹${stats.total}`, icon: IndianRupee, color: "indigo-500", gradient: "from-indigo-500/10 to-purple-500/10" },
        { title: "Waffle Revenue", value: `₹${stats.waffle}`, icon: Store, color: "orange-500", gradient: "from-orange-500/10 to-yellow-500/10" },
        { title: "Cafe Revenue", value: `₹${stats.cafe}`, icon: Coffee, color: "teal-500", gradient: "from-teal-500/10 to-cyan-500/10" },
        { title: "Combo Revenue", value: `₹${stats.both}`, icon: BarChart3, color: "indigo-400", gradient: "from-indigo-400/10 to-blue-400/10" },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-slate-900">Revenue Report</h1>
                    <p className="text-slate-500 font-medium mt-1">Analyze sales performance and shop-wise earnings.</p>
                </div>
                <button className="px-6 py-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 rounded-xl font-bold flex items-center gap-2 transition-all shadow-sm">
                    <Download size={18} />
                    Export PDF
                </button>
            </div>

            {/* Shop Filter */}
            <div className="flex flex-wrap items-center gap-2 bg-white border border-slate-200 shadow-sm rounded-xl p-1.5 w-full sm:w-fit">
                {["All", "Waffle", "Cafe", "Both"].map((shop) => (
                    <button
                        key={shop}
                        onClick={() => setShopFilter(shop)}
                        className={`flex-1 sm:flex-none px-4 sm:px-6 py-2.5 rounded-lg text-xs sm:text-sm font-bold transition-all ${shopFilter === shop
                            ? "bg-slate-900 text-white shadow-sm"
                            : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
                            }`}
                    >
                        {shop}
                    </button>
                ))}
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {cards.map((card, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className={`p-6 rounded-3xl bg-white border border-slate-200 shadow-sm relative overflow-hidden group`}
                    >
                        <div className={`absolute top-[-10%] right-[-5%] w-24 h-24 bg-${card.color}/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700`} />
                        <div className={`p-3 bg-${card.color}/10 rounded-2xl w-fit mb-4`}>
                            <card.icon className={`h-6 w-6 text-${card.color}`} />
                        </div>
                        <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">{card.title}</p>
                        <h3 className="text-3xl font-black text-slate-900 mt-1">{card.value}</h3>
                    </motion.div>
                ))}
            </div>

            {/* Revenue Table */}
            <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
                <div className="p-6 border-b border-slate-200 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <BarChart3 className="text-indigo-500" size={20} />
                        <h3 className="font-bold text-slate-900">Sales Transactions</h3>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-slate-200 bg-slate-50">
                                <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest">Bill #</th>
                                <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest">Date</th>
                                <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest">Customer</th>
                                <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest">Shop</th>
                                <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest text-center">Branch</th>
                                <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest text-right">Revenue</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-10 text-center text-slate-500 font-bold">Loading transactions...</td>
                                </tr>
                            ) : bills?.map((bill) => (
                                <tr key={bill._id} className="hover:bg-slate-50 transition-colors group">
                                    <td className="px-6 py-4 font-black text-slate-900">{bill.billNumber}</td>
                                    <td className="px-6 py-4">
                                        <p className="text-sm font-bold text-slate-600">{new Date(bill.createdAt).toLocaleDateString()}</p>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-medium text-slate-500">{bill.customerName || "Walk-in"}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest ${bill.shopType === 'Waffle' ? 'bg-orange-50 text-orange-600' :
                                            bill.shopType === 'Cafe' ? 'bg-teal-50 text-teal-600' : 'bg-indigo-50 text-indigo-600'
                                            }`}>
                                            {bill.shopType}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center text-sm font-bold text-slate-500">
                                        {bill.branch || "-"}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <span className="font-black text-slate-900">₹{bill.totalAmount}</span>
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

export default RevenueReport;
