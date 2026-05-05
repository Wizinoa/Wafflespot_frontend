import { motion } from "framer-motion";
import { 
    IndianRupee, 
    TrendingUp, 
    AlertTriangle, 
    ShoppingCart, 
    ArrowUpRight, 
    ArrowDownRight,
    Store,
    Coffee
} from "lucide-react";
import { useSelector } from "react-redux";
import type { RootState } from "../features/Store/store";
import { useGetDashboardStatsQuery } from "../services/api";

const Dashboard = () => {
    const { user } = useSelector((state: RootState) => state.auth);
    const { data: stats, isLoading } = useGetDashboardStatsQuery({});
    const isAdmin = user?.role === "ADMIN";
    const isBoth = user?.role === "BOTH";
    const isWaffle = user?.category === "WAFFLE";
    const accentColor = (isAdmin || isBoth) ? "indigo-500" : isWaffle ? "orange-500" : "teal-500";

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-[calc(100vh-100px)]">
                <div className={`w-10 h-10 border-4 border-${accentColor}/20 border-t-${accentColor} rounded-full animate-spin`} />
            </div>
        );
    }

    const cards = [
        {
            title: "Today's Revenue",
            value: `₹${stats?.todayRevenue || 0}`,
            icon: IndianRupee,
            trend: "+12.5%",
            isUp: true,
            color: "indigo-500",
            gradient: "from-indigo-500/10 to-purple-500/10"
        },
        {
            title: "Waffle Sales",
            value: `₹${stats?.waffleRevenue || 0}`,
            icon: Store,
            trend: "+8.2%",
            isUp: true,
            color: "orange-500",
            gradient: "from-orange-500/10 to-yellow-500/10"
        },
        {
            title: "Cafe Sales",
            value: `₹${stats?.cafeRevenue || 0}`,
            icon: Coffee,
            trend: "-2.4%",
            isUp: false,
            color: "teal-500",
            gradient: "from-teal-500/10 to-cyan-500/10"
        },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Welcome Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-slate-900">Dashboard</h1>
                    <p className="text-slate-500 font-medium">Welcome back, {user?.name}! Here's what's happening today.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="px-4 py-2 bg-white border border-slate-200 shadow-sm rounded-xl flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full bg-${accentColor}`} />
                        <span className="text-sm font-bold text-slate-700">{user?.shopName}</span>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {cards.map((card, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className={`p-6 rounded-3xl bg-white border border-slate-200 shadow-sm relative overflow-hidden group`}
                    >
                        <div className={`absolute top-[-10%] right-[-5%] w-24 h-24 bg-${card.color}/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700`} />
                        
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-3 bg-${card.color}/10 rounded-2xl`}>
                                <card.icon className={`h-6 w-6 text-${card.color}`} />
                            </div>
                            <div className={`flex items-center gap-1 text-xs font-bold ${card.isUp ? 'text-green-400' : 'text-red-400'}`}>
                                {card.isUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                                {card.trend}
                            </div>
                        </div>
                        
                        <div>
                            <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">{card.title}</p>
                            <h3 className="text-3xl font-black text-slate-900 mt-1">{card.value}</h3>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Bills */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm"
                >
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-indigo-50 rounded-xl">
                                <ShoppingCart className="h-5 w-5 text-indigo-500" />
                            </div>
                            <h3 className="text-xl font-black text-slate-900">Recent Bills</h3>
                        </div>
                        <button className="text-sm font-bold text-indigo-400 hover:text-indigo-300 transition-colors">View All</button>
                    </div>

                    <div className="space-y-4">
                        {stats?.recentBills?.map((bill: any, idx: number) => (
                            <div key={idx} className="flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl border border-slate-100 hover:border-slate-300 transition-all cursor-pointer group">
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs ${
                                        bill.shopType === 'Waffle' ? 'bg-orange-100 text-orange-600' : 
                                        bill.shopType === 'Cafe' ? 'bg-teal-100 text-teal-600' : 'bg-indigo-100 text-indigo-600'
                                    }`}>
                                        {bill.shopType[0]}
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-900">#{bill.billNumber}</p>
                                        <p className="text-xs text-slate-500 font-medium">{new Date(bill.createdAt).toLocaleTimeString()}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-black text-slate-900">₹{bill.totalAmount}</p>
                                    <p className={`text-[10px] font-bold uppercase tracking-widest ${
                                        bill.shopType === 'Waffle' ? 'text-orange-500' : 
                                        bill.shopType === 'Cafe' ? 'text-teal-500' : 'text-indigo-500'
                                    }`}>{bill.shopType}</p>
                                </div>
                            </div>
                        ))}
                        {!stats?.recentBills?.length && <p className="text-center text-slate-400 py-4 font-medium italic">No recent transactions</p>}
                    </div>
                </motion.div>

                {/* Stock Alerts */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm"
                >
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-red-50 rounded-xl">
                                <AlertTriangle className="h-5 w-5 text-red-500" />
                            </div>
                            <h3 className="text-xl font-black text-slate-900">Stock Alerts</h3>
                        </div>
                        <button className="text-sm font-bold text-red-400 hover:text-red-300 transition-colors">Restock Now</button>
                    </div>

                    <div className="space-y-4">
                        {stats?.stockAlerts?.map((item: any, idx: number) => (
                            <div key={idx} className="flex items-center justify-between p-4 bg-red-50/50 rounded-2xl border border-red-100 hover:border-red-200 transition-all group">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                                        <TrendingUp className="h-4 w-4 text-red-500" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-900">{item.name}</p>
                                        <p className={`text-xs font-bold uppercase tracking-widest ${
                                            item.shopType === 'Waffle' ? 'text-orange-500' : 
                                            item.shopType === 'Cafe' ? 'text-teal-500' : 'text-indigo-500'
                                        }`}>{item.shopType}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-black text-red-500">{item.quantity} {item.unit}</p>
                                    <p className="text-[10px] font-bold text-red-400 uppercase tracking-tighter">Critically Low</p>
                                </div>
                            </div>
                        ))}
                        {!stats?.stockAlerts?.length && <p className="text-center text-slate-400 py-4 font-medium italic">All stock levels healthy</p>}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Dashboard;
