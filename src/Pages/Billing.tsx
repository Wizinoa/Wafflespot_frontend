import { useState, useMemo } from "react";
import {
    Search,
    Plus,
    Minus,
    Trash2,
    User,
    Phone,
    Receipt,
    Printer,
    Save,
    X,
    ShoppingCart
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
    useGetProductsQuery,
    useCreateBillMutation
} from "../services/api";
import { useSelector } from "react-redux";
import type { RootState } from "../features/Store/store";
import type { Bill } from "../types";

interface CartItem {
    productId: string;
    name: string;
    quantity: number;
    price: number;
}

const Billing = () => {
    const { user } = useSelector((state: RootState) => state.auth);
    const { selectedBranch } = useSelector((state: RootState) => state.branch);
    const isAdmin = user?.role === "ADMIN";
    const isBoth = user?.role === "BOTH";

    // Simplified theme logic based on category
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

    const [searchTerm, setSearchTerm] = useState("");
    const [customerName, setCustomerName] = useState("");
    const [customerPhone, setCustomerPhone] = useState("");
    const [paymentMode, setPaymentMode] = useState<"CASH" | "UPI" | "CARD">("CASH");
    const [cart, setCart] = useState<CartItem[]>([]);
    const [showPreview, setShowPreview] = useState(false);

    const { data: products, isLoading } = useGetProductsQuery({
        shopType: (isAdmin || isBoth) ? undefined : (isWaffle ? "Waffle" : "Cafe")
    });

    const [createBill, { isLoading: isSaving }] = useCreateBillMutation();

    const filteredProducts = useMemo(() => {
        return products?.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [products, searchTerm]);

    const addToCart = (product: any) => {
        setCart(prev => {
            const existing = prev.find(item => item.productId === product._id);
            if (existing) {
                return prev.map(item =>
                    item.productId === product._id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [...prev, {
                productId: product._id,
                name: product.name,
                quantity: 1,
                price: product.price
            }];
        });
        toast.success(`${product.name} added to cart`, { duration: 1000 });
    };

    const updateQuantity = (id: string, delta: number) => {
        setCart(prev => prev.map(item => {
            if (item.productId === id) {
                const newQty = Math.max(0, item.quantity + delta);
                return { ...item, quantity: newQty };
            }
            return item;
        }).filter(item => item.quantity > 0));
    };

    const removeFromCart = (id: string) => {
        setCart(prev => prev.filter(item => item.productId !== id));
    };

    const subTotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const taxAmount = Math.round(subTotal * 0.05); // 5% GST
    const totalAmount = subTotal + taxAmount;

    const handleSaveBill = async () => {
        if (cart.length === 0) return toast.error("Cart is empty");

        try {
            const billData = {
                customerName,
                customerPhone,
                items: cart.map(item => ({
                    productId: item.productId,
                    productName: item.name,
                    quantity: item.quantity,
                    price: item.price,
                    total: item.price * item.quantity
                })),
                subTotal,
                taxAmount,
                discount: 0,
                totalAmount,
                paymentMode,
                shopType: (isAdmin ? "Waffle" :
                    isBoth ? "Both" :
                        (isWaffle ? "Waffle" : "Cafe")) as Bill['shopType'],
                branch: (user?.businessType === "STALL" && user?.category === "WAFFLE")
                    ? (selectedBranch || "Branch 1")
                    : "-"
            };

            await createBill(billData as Partial<Bill>).unwrap();
            toast.success("Bill generated successfully!");
            setCart([]);
            setCustomerName("");
            setCustomerPhone("");
            setShowPreview(false);
        } catch (err) {
            toast.error("Failed to save bill");
        }
    };

    return (
        <div className="min-h-screen lg:h-[calc(100vh-100px)] flex flex-col gap-6 animate-in fade-in duration-500 pb-10 lg:pb-0">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex-1">
                    <h1 className="text-2xl lg:text-3xl font-black tracking-tight text-slate-900">Billing / POS</h1>
                    <p className="hidden sm:block text-slate-500 font-medium">Create instant bills and manage checkout.</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="px-4 py-2 bg-white border border-slate-200 rounded-xl flex items-center gap-2 shadow-sm">
                        <div className={`w-2 h-2 rounded-full bg-${accentColor} animate-pulse`} />
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{user?.shopName ?? "Waffle Spot"}</span>
                    </div>
                </div>
            </div>

            <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:overflow-hidden">
                {/* Product Selection (Left) */}
                <div className="order-2 lg:order-1 lg:col-span-7 flex flex-col gap-6 lg:overflow-hidden">
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
                        <input
                            type="text"
                            placeholder="Search products by name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-white border border-slate-200 text-slate-900 pl-12 pr-4 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-slate-200 transition-all shadow-sm font-medium"
                        />
                    </div>

                    <div className="flex-1 overflow-auto custom-scrollbar">
                        {isLoading ? (
                            <div className="flex items-center justify-center py-20 text-gray-500 font-bold">
                                Loading products...
                            </div>
                        ) : (
                            <table className="w-full border-separate border-spacing-y-2">
                                <thead>
                                    <tr className="text-left text-xs uppercase text-gray-500">
                                        <th className="px-4 py-2">Product</th>
                                        <th className="px-4 py-2">Type</th>
                                        <th className="px-4 py-2">Price</th>
                                        <th className="px-4 py-2 text-right">Action</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {filteredProducts?.map((product) => (
                                        <motion.tr
                                            key={product._id}
                                            whileHover={{ scale: 1.01 }}
                                            className="bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-all"
                                        >
                                            {/* Product */}
                                            <td className="px-4 py-3 font-semibold text-slate-700">
                                                {product.name}
                                            </td>

                                            {/* Type */}
                                            <td className="px-4 py-3">
                                                <span
                                                    className={`text-xs font-bold px-2 py-1 rounded-md ${product.shopType === "Waffle"
                                                        ? "bg-orange-50 text-orange-600"
                                                        : product.shopType === "Cafe"
                                                            ? "bg-teal-50 text-teal-600"
                                                            : "bg-indigo-50 text-indigo-600"
                                                        }`}
                                                >
                                                    {product.shopType}
                                                </span>
                                            </td>

                                            {/* Price */}
                                            <td className="px-4 py-3 font-bold text-slate-900">
                                                ₹{product.price}
                                            </td>

                                            {/* Action */}
                                            <td className="px-4 py-3 text-right">
                                                <motion.button
                                                    whileTap={{ scale: 0.9 }}
                                                    onClick={() => addToCart(product)}
                                                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-lg text-sm font-semibold flex items-center gap-1 ml-auto"
                                                >
                                                    <Plus size={14} />
                                                    Add
                                                </motion.button>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>

                {/* Cart & Checkout (Right) */}
                <div className="order-1 lg:order-2 lg:col-span-5 flex flex-col gap-6 bg-white border border-slate-200 rounded-[2rem] lg:rounded-[2.5rem] p-6 lg:p-8 custom-scrollbar overflow-y-auto shadow-xl lg:shadow-2xl h-fit lg:h-full">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                            <div className={`p-2 bg-${accentColor}/10 rounded-xl`}>
                                <ShoppingCart className={`h-5 w-5 text-${accentColor}`} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900">Current Order</h3>
                            <span className="px-3 py-1 bg-slate-100 rounded-full text-[10px] font-black text-slate-500 uppercase tracking-widest">{cart.length} items</span>
                        </div>
                        {cart.length > 0 && (
                            <button
                                onClick={() => setCart([])}
                                className="text-red-400 hover:text-red-600 transition-colors"
                                title="Clear Cart"
                            >
                                <Trash2 size={18} />
                            </button>
                        )}
                    </div>

                    {/* Cart Items */}
                    <div className="flex-1 lg:overflow-y-auto pr-2 custom-scrollbar space-y-3 min-h-[150px] max-h-[300px] lg:max-h-full">
                        {cart.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-4">
                                <Receipt size={48} className="opacity-20" />
                                <p className="font-medium italic">Cart is empty. Add products to start.</p>
                            </div>
                        ) : cart.map((item) => (
                            <motion.div
                                layout
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                key={item.productId}
                                className="flex items-center gap-4 p-4 bg-slate-50/50 rounded-2xl border border-slate-100 group"
                            >
                                <div className="flex-1">
                                    <h5 className="text-sm font-bold text-slate-800">{item.name}</h5>
                                    <p className="text-xs text-slate-500 font-bold">₹{item.price} / unit</p>
                                </div>
                                <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl p-1 shadow-sm">
                                    <button onClick={() => updateQuantity(item.productId, -1)} className="p-1 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-900 transition-all">
                                        <Minus size={14} />
                                    </button>
                                    <span className="text-sm font-black w-4 text-center text-slate-900">{item.quantity}</span>
                                    <button onClick={() => updateQuantity(item.productId, 1)} className="p-1 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-900 transition-all">
                                        <Plus size={14} />
                                    </button>
                                </div>
                                <div className="text-right min-w-[60px]">
                                    <p className="text-sm font-black text-slate-900">₹{item.price * item.quantity}</p>
                                </div>
                                <button onClick={() => removeFromCart(item.productId)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                                    <Trash2 size={16} />
                                </button>
                            </motion.div>
                        ))}
                    </div>

                    {/* Customer Info */}
                    <div className="pt-6 border-t border-slate-100 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                <input
                                    type="text"
                                    placeholder="Customer Name"
                                    value={customerName}
                                    onChange={(e) => setCustomerName(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 text-xs text-slate-900 pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:ring-1 focus:ring-slate-300 font-medium"
                                />
                            </div>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                <input
                                    type="text"
                                    placeholder="Phone Number"
                                    value={customerPhone}
                                    onChange={(e) => setCustomerPhone(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 text-xs text-slate-900 pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:ring-1 focus:ring-slate-300 font-medium"
                                />
                            </div>
                        </div>

                        {/* Payment Modes */}
                        <div className="flex gap-2 p-1.5 bg-slate-50 border border-slate-200 rounded-xl">
                            {["CASH", "UPI", "CARD"].map((mode) => (
                                <button
                                    key={mode}
                                    onClick={() => setPaymentMode(mode as any)}
                                    className={`flex-1 py-2 rounded-lg text-[10px] font-black tracking-widest transition-all ${paymentMode === mode
                                        ? `bg-white text-slate-900 shadow-sm border border-slate-200`
                                        : "text-slate-500 hover:text-slate-700"
                                        }`}
                                >
                                    {mode}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Total Summary */}
                    <div className="pt-6 space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Subtotal</span>
                            <span className="text-slate-900 font-bold">₹{subTotal}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">GST (5%)</span>
                            <span className="text-slate-900 font-bold">₹{taxAmount}</span>
                        </div>
                        <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                            <span className="text-slate-900 font-black uppercase tracking-[0.2em] text-xs">Total Amount</span>
                            <span className={`text-2xl font-black text-${accentColor}`}>₹{totalAmount}</span>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-6">
                        <button
                            onClick={() => setShowPreview(true)}
                            disabled={cart.length === 0}
                            className="flex-1 py-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            <Receipt size={18} />
                            Preview
                        </button>
                        <button
                            onClick={handleSaveBill}
                            disabled={cart.length === 0 || isSaving}
                            className={isAdmin
                                ? "flex-[2] py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black text-lg shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                : `flex-[2] py-4 rounded-2xl bg-gradient-to-r ${accentGradient} text-white font-black text-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50`
                            }
                        >
                            {isSaving ? "Saving..." : (
                                <>
                                    <Save size={20} />
                                    Generate Bill
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Bill Preview Modal */}
            <AnimatePresence>
                {showPreview && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowPreview(false)}
                            className="absolute inset-0 bg-black/90 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="relative w-full max-w-md bg-white text-black p-8 rounded-none shadow-2xl font-mono"
                        >
                            <button
                                onClick={() => setShowPreview(false)}
                                className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
                            >
                                <X size={32} />
                            </button>

                            {/* Print Content */}
                            <div className="text-center space-y-1 mb-8">
                                <h2 className="text-2xl font-black tracking-tighter">The Waffle Sopt</h2>
                                <p className="text-[10px] font-bold uppercase">{user?.shopName}</p>
                                <div className="border-b border-dashed border-black pt-4" />
                            </div>

                            <div className="flex justify-between text-[10px] font-bold mb-6">
                                <div>
                                    <p>DATE: {new Date().toLocaleDateString()}</p>
                                    <p>TIME: {new Date().toLocaleTimeString()}</p>
                                </div>
                                <div className="text-right">
                                    <p>CUST: {customerName || "WALK-IN"}</p>
                                    <p>MODE: {paymentMode}</p>
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
                                {cart.map((item, idx) => (
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
                                    <span>₹{subTotal}</span>
                                </div>
                                <div className="flex justify-between text-[10px] font-bold">
                                    <span>GST (5%)</span>
                                    <span>₹{taxAmount}</span>
                                </div>
                                <div className="flex justify-between text-lg font-black pt-2">
                                    <span>TOTAL</span>
                                    <span>₹{totalAmount}</span>
                                </div>
                            </div>

                            <div className="mt-10 text-center space-y-2">
                                <p className="text-[10px] font-bold italic">Thank you for visiting!</p>
                                <div className="flex justify-center pt-4">
                                    <div className="w-16 h-16 border-2 border-black flex items-center justify-center text-[8px] font-bold rotate-12">
                                        PAID
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => window.print()}
                                className="mt-8 w-full bg-black text-white py-4 font-black uppercase tracking-widest flex items-center justify-center gap-2 print:hidden"
                            >
                                <Printer size={18} />
                                Print PDF
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Billing;
