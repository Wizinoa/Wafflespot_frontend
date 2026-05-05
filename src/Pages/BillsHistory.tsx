import { useState } from "react";
import {
    Search,
    Calendar,
    Eye,
    Printer,
    X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useGetBillsQuery } from "../services/api";
import { useSelector } from "react-redux";
import type { RootState } from "../features/Store/store";

const BillsHistory = () => {
    const { user } = useSelector((state: RootState) => state.auth);
    const isAdmin = user?.role === "ADMIN";
    const isBoth = user?.role === "BOTH";
    const isWaffle = user?.category === "WAFFLE";

    const accentColor = (isAdmin || isBoth) ? "indigo-500" : isWaffle ? "orange-500" : "teal-500";

    const [searchTerm, setSearchTerm] = useState("");
    const [selectedBill, setSelectedBill] = useState<any>(null);

    const { data: bills, isLoading } = useGetBillsQuery({
        shopType: (isAdmin || isBoth) ? undefined : (isWaffle ? "Waffle" : "Cafe")
    });

    const filteredBills = bills?.filter((bill: any) =>
        bill.billNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bill.customerName?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-slate-900">Bills History</h1>
                    <p className="text-slate-500 font-medium mt-1">View and manage all generated bills across shops.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="px-4 py-2 bg-white border border-slate-200 rounded-xl flex items-center gap-2 shadow-sm">
                        <Calendar className="h-4 w-4 text-slate-500" />
                        <span className="text-sm font-bold text-slate-600">All Time</span>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-600 transition-colors" size={20} />
                    <input
                        type="text"
                        placeholder="Search by bill number or customer..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-white border border-slate-200 text-slate-900 pl-12 pr-4 py-3.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-200 transition-all font-medium shadow-sm"
                    />
                </div>
            </div>

            {/* Bills Table */}
            <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-slate-200 bg-slate-50">
                                <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest">Bill #</th>
                                <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest">Date</th>
                                <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest">Customer</th>
                                <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest">Shop</th>
                                <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest">Branch</th>
                                <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest">Amount</th>
                                <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-10 text-center text-slate-500 font-bold">
                                        Loading bills history...
                                    </td>
                                </tr>
                            ) : filteredBills?.map((bill: any) => (
                                <tr key={bill?._id} className="hover:bg-slate-50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <span className="font-black text-slate-900">{bill?.billNumber}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-sm font-bold text-slate-700">{new Date(bill?.createdAt).toLocaleDateString()}</p>
                                        <p className="text-[10px] text-slate-400 font-medium">{new Date(bill?.createdAt).toLocaleTimeString()}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm font-medium text-slate-600">{bill?.customerName || "Walk-in"}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest ${bill?.shopType === 'Waffle' ? 'bg-orange-50 text-orange-600' :
                                            bill?.shopType === 'Cafe' ? 'bg-teal-50 text-teal-600' : 'bg-indigo-50 text-indigo-600'
                                            }`}>
                                            {bill?.shopType}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">{bill?.branch}</td>
                                    <td className="px-6 py-4">
                                        <span className={`text-sm font-black text-${accentColor}`}>₹{bill?.totalAmount ?? bill?.total}</span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => setSelectedBill(bill)}
                                            className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all"
                                        >
                                            <Eye size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Bill Detail Modal */}
            <AnimatePresence>
                {selectedBill && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedBill(null)}
                            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="relative w-full max-w-md bg-white text-black p-8 rounded-none shadow-xl border border-slate-200 font-mono"
                        >
                            <button
                                onClick={() => setSelectedBill(null)}
                                className="absolute -top-12 right-0 text-white hover:text-slate-300 transition-colors"
                            >
                                <X size={32} />
                            </button>

                            <div className="text-center space-y-1 mb-8">
                                <h2 className="text-2xl font-black tracking-tighter">ShopOS</h2>
                                <p className="text-[10px] font-bold uppercase">{selectedBill.shopType} Shop</p>
                                <div className="border-b border-dashed border-black pt-4" />
                            </div>

                            <div className="flex justify-between text-[10px] font-bold mb-6">
                                <div>
                                    <p>BILL: {selectedBill.billNumber}</p>
                                    <p>DATE: {new Date(selectedBill.createdAt).toLocaleDateString()}</p>
                                </div>
                                <div className="text-right">
                                    <p>CUST: {selectedBill.customerName || "WALK-IN"}</p>
                                    <p>MODE: {selectedBill.paymentMode}</p>
                                </div>
                            </div>

                            <div className="space-y-3 mb-8">
                                <div className="flex justify-between text-[10px] font-black border-b border-black pb-2">
                                    <span>ITEM</span>
                                    <div className="flex gap-8">
                                        <span>QTY</span>
                                        <span>AMT</span>
                                    </div>
                                </div>
                                {selectedBill.items.map((item: any, idx: number) => (
                                    <div key={idx} className="flex justify-between text-[10px] font-bold">
                                        <span className="uppercase">{item.name}</span>
                                        <div className="flex gap-10">
                                            <span>{item.quantity}</span>
                                            <span>₹{item.price * item.quantity}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-dashed border-black pt-4 space-y-2">
                                <div className="flex justify-between text-[10px] font-bold">
                                    <span>SUBTOTAL</span>
                                    <span>₹{selectedBill.subTotal}</span>
                                </div>
                                <div className="flex justify-between text-[10px] font-bold">
                                    <span>GST (5%)</span>
                                    <span>₹{selectedBill.taxAmount}</span>
                                </div>
                                <div className="flex justify-between text-lg font-black pt-2">
                                    <span>TOTAL</span>
                                    <span>₹{selectedBill.totalAmount}</span>
                                </div>
                            </div>

                            <button
                                onClick={() => window.print()}
                                className="mt-8 w-full bg-black text-white py-4 font-black uppercase tracking-widest flex items-center justify-center gap-2 print:hidden"
                            >
                                <Printer size={18} />
                                Re-print Bill
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default BillsHistory;
