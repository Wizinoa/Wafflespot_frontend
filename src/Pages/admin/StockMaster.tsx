import { useState } from "react";
import {
    Plus,
    Search,
    Trash2,
    Edit2,
    Package,
    ArrowUpDown,

} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
    useGetStockItemsQuery,
    useCreateStockItemMutation,
    useUpdateStockItemMutation,
    useDeleteStockItemMutation
} from "../../services/api";
import { useSelector } from "react-redux";
import type { RootState } from "../../features/Store/store";

const StockMaster = () => {
    const { user } = useSelector((state: RootState) => state.auth);
    const isAdmin = user?.role === "ADMIN";


    const [searchTerm, setSearchTerm] = useState("");
    const [shopFilter, setShopFilter] = useState<string>("All");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<any>(null);

    const { data: stockItems, isLoading } = useGetStockItemsQuery({
        shopType: shopFilter === "All" ? undefined : shopFilter
    });

    const [createStock] = useCreateStockItemMutation();
    const [updateStock] = useUpdateStockItemMutation();
    const [deleteStock] = useDeleteStockItemMutation();

    const [formData, setFormData] = useState({
        name: "",
        quantity: 0,
        unit: "kg",
        shopType: "Waffle"
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingItem) {
                await updateStock({ id: editingItem._id, data: formData }).unwrap();
                toast.success("Stock item updated");
            } else {
                await createStock(formData).unwrap();
                toast.success("Stock item added");
            }
            closeModal();
        } catch (err) {
            toast.error("Operation failed");
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm("Delete this item?")) {
            try {
                await deleteStock(id).unwrap();
                toast.success("Item deleted");
            } catch (err) {
                toast.error("Failed to delete");
            }
        }
    };

    const openModal = (item: any = null) => {
        if (item) {
            setEditingItem(item);
            setFormData({
                name: item.name,
                quantity: item.quantity,
                unit: item.unit,
                shopType: item.shopType
            });
        } else {
            setEditingItem(null);
            setFormData({ name: "", quantity: 0, unit: "kg", shopType: "Waffle" });
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingItem(null);
    };

    const filteredItems = stockItems?.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-slate-900">Stock Master</h1>
                    <p className="text-slate-500 font-medium mt-1">Manage and track inventory across all shops</p>
                </div>
                {isAdmin && (
                    <button
                        onClick={() => openModal()}
                        className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-sm"
                    >
                        <Plus size={20} />
                        Add Stock
                    </button>
                )}
            </div>

            {/* Filters */}
            <div className="p-6 border-b border-slate-200">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-600 transition-colors" size={20} />
                        <input
                            type="text"
                            placeholder="Search stock items..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 text-slate-900 pl-12 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-200 transition-all font-medium"
                        />
                    </div>
                    <div className="flex flex-wrap items-center gap-2 bg-slate-50 p-1.5 rounded-xl border border-slate-200">
                        {["All", "Waffle", "Cafe", "Both"].map((shop) => (
                            <button
                                key={shop}
                                onClick={() => setShopFilter(shop)}
                                className={`flex-1 sm:flex-none px-4 lg:px-6 py-2.5 rounded-lg text-xs lg:text-sm font-bold transition-all ${shopFilter === shop
                                    ? "bg-white text-slate-900 shadow-sm border border-slate-200"
                                    : "text-slate-500 hover:text-slate-700 hover:bg-slate-100"
                                    }`}
                            >
                                {shop}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col min-h-[400px] lg:h-[calc(100vh-220px)]">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 sticky top-0 z-10 border-b border-slate-200">
                            <tr>
                                {["Item Name", "Quantity", "Unit", "Shop Type", "Actions"].map((header, idx) => (
                                    <th key={idx} className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase tracking-widest">
                                        <div className="flex items-center gap-2">
                                            {header}
                                            {header !== "Actions" && <ArrowUpDown size={14} className="text-slate-400" />}
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-10 text-center">
                                        <div className="flex items-center justify-center gap-3 text-slate-500 font-bold">
                                            <div className="w-5 h-5 border-2 border-slate-200 border-t-slate-900 rounded-full animate-spin" />
                                            Loading inventory...
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredItems?.map((item) => (
                                <motion.tr
                                    layout
                                    key={item._id}
                                    className="hover:bg-slate-50 transition-colors group"
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-slate-100 rounded-xl">
                                                <Package className="h-5 w-5 text-slate-600" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-900">{item.name}</p>
                                                {/* <p className="text-xs text-slate-500 font-medium">#{item._id.slice(-6)}</p> */}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-black text-slate-900">{item.quantity}</td>
                                    <td className="px-6 py-4 text-slate-500 font-medium lowercase">{item.unit}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest ${item.shopType === 'Waffle'
                                            ? 'bg-orange-50 text-orange-600'
                                            : item.shopType === 'Cafe' ? 'bg-teal-50 text-teal-600' : 'bg-indigo-50 text-indigo-600'
                                            }`}>
                                            {item.shopType}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => openModal(item)}
                                                className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all"
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(item._id)}
                                                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                            {!isLoading && filteredItems?.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-10 text-center text-slate-500 font-medium italic">
                                        No stock items found matching your search.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white rounded-3xl p-8 max-w-md w-full border border-slate-200 shadow-xl"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-black text-slate-900">
                                    {editingItem ? "Edit Stock Item" : "Add New Stock Item"}
                                </h2>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Stock Name</label>
                                    <input
                                        required
                                        type="text"
                                        placeholder="e.g. Waffle Batter"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-200 text-slate-900 px-5 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-slate-200 transition-all font-medium"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Quantity</label>
                                        <input
                                            required
                                            type="number"
                                            value={formData.quantity}
                                            onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
                                            className="w-full bg-slate-50 border border-slate-200 text-slate-900 px-5 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-slate-200 transition-all font-medium"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Unit</label>
                                        <select
                                            value={formData.unit}
                                            onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                                            className="w-full bg-slate-50 border border-slate-200 text-slate-900 px-5 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-slate-200 transition-all appearance-none font-medium"
                                        >
                                            {["kg", "ltr", "pcs", "pkt", "box"].map(u => <option key={u} value={u}>{u}</option>)}
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Category</label>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                        {["Waffle", "Cafe", "Both"].map((type) => (
                                            <button
                                                key={type}
                                                type="button"
                                                onClick={() => setFormData({ ...formData, shopType: type as any })}
                                                className={`py-3 rounded-xl text-sm font-bold transition-all ${formData.shopType === type
                                                    ? "bg-slate-900 text-white shadow-sm border border-slate-900"
                                                    : "bg-slate-50 text-slate-500 border border-slate-200 hover:bg-slate-100"
                                                    }`}
                                            >
                                                {type}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="flex-1 py-4 rounded-2xl font-bold text-slate-500 hover:bg-slate-100 transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 bg-slate-900 hover:bg-slate-800 py-4 rounded-2xl font-bold text-white shadow-md transition-all"
                                    >
                                        {editingItem ? 'Save Changes' : 'Add Stock'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default StockMaster;
