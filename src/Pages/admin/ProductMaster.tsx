import { useState } from "react";
import {
    Plus,
    Search,
    Trash2,
    Edit2,
    Store,
    IndianRupee,
    ArrowUpDown,
    Coffee
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
    useGetProductsQuery,
    useCreateProductMutation,
    useUpdateProductMutation,
    useDeleteProductMutation
} from "../../services/api";
import { useSelector } from "react-redux";
import type { RootState } from "../../features/Store/store";

const ProductMaster = () => {
    const { user } = useSelector((state: RootState) => state.auth);
    const isAdmin = user?.role === "ADMIN";
    const [searchTerm, setSearchTerm] = useState("");
    const [shopFilter, setShopFilter] = useState<string>("All");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<any>(null);

    const { data: products, isLoading } = useGetProductsQuery({
        shopType: shopFilter === "All" ? undefined : shopFilter
    });

    const [createProduct] = useCreateProductMutation();
    const [updateProduct] = useUpdateProductMutation();
    const [deleteProduct] = useDeleteProductMutation();

    const [formData, setFormData] = useState({
        name: "",
        price: 0,
        shopType: "Waffle"
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingItem) {
                await updateProduct({ id: editingItem._id, data: formData }).unwrap();
                toast.success("Product updated");
            } else {
                await createProduct(formData).unwrap();
                toast.success("Product added");
            }
            closeModal();
        } catch (err) {
            toast.error("Operation failed");
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm("Delete this product?")) {
            try {
                await deleteProduct(id).unwrap();
                toast.success("Product deleted");
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
                price: item.price,
                shopType: item.shopType
            });
        } else {
            setEditingItem(null);
            setFormData({ name: "", price: 0, shopType: "Waffle" });
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingItem(null);
    };

    const filteredItems = products?.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-slate-900">Product Master</h1>
                    <p className="text-slate-500 font-medium mt-1">Manage your storefront menu and pricing</p>
                </div>
                {isAdmin && (
                    <button
                        onClick={() => openModal()}
                        className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-sm"
                    >
                        <Plus size={20} />
                        Add Product
                    </button>
                )}
            </div>

            {/* Filters */}
            <div className="bg-white border border-slate-200 rounded-2xl">
                <div className="p-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-600 transition-colors" size={20} />
                            <input
                                type="text"
                                placeholder="Search products..."
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
            </div>

            {/* Table */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                {["Product Name", "Price", "Shop Type", "Actions"].map((header, idx) => (
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
                                    <td colSpan={4} className="px-6 py-10 text-center">
                                        <div className="flex items-center justify-center gap-3 text-slate-500 font-bold">
                                            <div className="w-5 h-5 border-2 border-slate-200 border-t-slate-900 rounded-full animate-spin" />
                                            Loading products...
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
                                                {item.shopType === 'Waffle' ? <Store className="h-5 w-5 text-slate-600" /> : <Coffee className="h-5 w-5 text-slate-600" />}
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-900">{item.name}</p>
                                                {/* <p className="text-xs text-slate-500 font-medium">#{item._id.slice(-6)}</p> */}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-black text-slate-900">₹{item.price}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest ${item.shopType === 'Waffle'
                                            ? 'bg-orange-50 text-orange-600'
                                            : item.shopType === 'Cafe' ? 'bg-teal-50 text-teal-600' : 'bg-indigo-50 text-indigo-600'
                                            }`}>
                                            {item.shopType}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
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
                                    <td colSpan={4} className="px-6 py-10 text-center text-slate-500 font-medium italic">
                                        No products found matching your search.
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
                                    {editingItem ? "Edit Product" : "Add New Product"}
                                </h2>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Product Name</label>
                                    <input
                                        required
                                        type="text"
                                        placeholder="e.g. Belgian Chocolate Waffle"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-200 text-slate-900 px-5 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-slate-900/10 transition-all font-medium"
                                    />
                                </div>
                                <div className="grid grid-cols-1 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Price (₹)</label>
                                        <div className="relative">
                                            <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                            <input
                                                required
                                                type="number"
                                                value={formData.price}
                                                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                                                className="w-full bg-slate-50 border border-slate-200 text-slate-900 pl-12 pr-5 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-slate-900/10 transition-all font-medium"
                                            />
                                        </div>
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
                                        {editingItem ? 'Save Changes' : 'Add Product'}
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

export default ProductMaster;
