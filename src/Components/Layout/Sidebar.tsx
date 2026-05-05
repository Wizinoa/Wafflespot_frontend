
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    FileText,
    BarChart3,
    LogOut,
    Store,
    Boxes,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../features/Store/store";
import { logout } from "../../features/authSlice";
import { motion } from "framer-motion";
const Sidebar = ({ isCollapsed, setIsCollapsed }: { isCollapsed: boolean; setIsCollapsed?: (v: boolean) => void }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector((state: RootState) => state.auth);

    const isAdmin = user?.role === "ADMIN";
    const isBoth = user?.role === "BOTH";
    const isWaffle = user?.category === "WAFFLE";
    const isCafe = user?.category === "CAFE";

    // Dynamic colors based on role/category
    const accentColor = (isAdmin || isBoth) ? "indigo-500" : isWaffle ? "orange-500" : isCafe ? "teal-500" : "slate-900";
    const accentGradient = (isAdmin || isBoth)
        ? "from-indigo-600 to-purple-600"
        : isWaffle
            ? "from-orange-500 to-yellow-500"
            : isCafe
                ? "from-teal-500 to-cyan-500"
                : "from-slate-800 to-slate-900";

    const menuItems = [
        { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
        { path: "/billing", label: "Billing", icon: ShoppingCart },
        { path: "/stock-update", label: "Stock Update", icon: Package },
        { path: "/bills-history", label: "Bills History", icon: FileText },
        ...(isAdmin
            ? [
                { path: "/admin/stock-master", label: "Stock Master", icon: Boxes },
                { path: "/admin/product-master", label: "Product Master", icon: Store },
                { path: "/admin/reports", label: "Reports", icon: BarChart3 },
                { path: "/admin/revenue", label: "Revenue", icon: BarChart3 },
            ]
            : []),
    ];

    const handleLogout = () => {
        dispatch(logout());
        navigate("/login");
    };

    return (
        <div className={`w-full h-screen bg-white text-slate-800 flex flex-col border-r border-slate-200 shadow-sm z-10 transition-all duration-300 relative`}>
            {/* Collapse Toggle Button (Desktop Only) - Fixed Position relative to side of sidebar */}
            {setIsCollapsed && (
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="hidden lg:flex absolute -right-3 top-20 w-6 h-6 bg-white border border-slate-200 rounded-full items-center justify-center shadow-sm text-slate-400 hover:text-slate-900 z-50 hover:scale-110 transition-all"
                >
                    {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
                </button>
            )}

            {/* Scrollable Content Wrapper */}
            <div className={`flex-1 flex flex-col overflow-y-auto overflow-x-hidden custom-scrollbar ${isCollapsed ? 'items-center' : ''}`}>
                <div className={`p-6 ${isCollapsed ? 'px-2' : ''} w-full`}>
                    <div className={`flex items-center gap-3 mb-8 ${isCollapsed ? 'justify-center' : ''}`}>
                        <div className={`flex-shrink-0 w-10 h-10 bg-gradient-to-br ${accentGradient} rounded-xl flex items-center justify-center shadow-lg shadow-${accentColor}/20`}>
                            {/* <Store className="h-6 w-6 text-white" /> */}
                            <img src="https://res.cloudinary.com/dxhrg5kgu/image/upload/v1777963755/Gemini_Generated_Image_tzpkvdtzpkvdtzpk_lvedfd.png" alt="icon" loading="lazy" />

                        </div>
                        {!isCollapsed && (
                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="overflow-hidden whitespace-nowrap"
                            >
                                <h1 className="text-xl font-black tracking-tight text-slate-900">The Waffle Sopt</h1>
                                <p className={`text-[10px] font-bold uppercase tracking-widest text-${accentColor}`}>
                                    {user?.shopName || "Admin Portal"}
                                </p>
                            </motion.div>
                        )}
                    </div>

                    {!isCollapsed && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="mb-6 p-4 bg-slate-50/80 rounded-2xl border border-slate-200 shadow-sm"
                        >
                            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-1">Active User</p>
                            <p className="text-sm font-bold text-slate-800 truncate">{user?.name}</p>
                            <div className="flex items-center gap-1.5 mt-1">
                                <div className={`w-1.5 h-1.5 rounded-full bg-${accentColor} animate-pulse`} />
                                <p className={`text-[11px] font-bold capitalize text-${accentColor}`}>{user?.role}</p>
                            </div>
                        </motion.div>
                    )}

                    <nav className="space-y-1.5">
                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = location.pathname === item.path;
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-200 group relative ${isCollapsed ? 'justify-center' : 'px-4'} ${isActive
                                        ? `bg-gradient-to-r ${accentGradient} text-white shadow-md shadow-${accentColor}/20`
                                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-900 font-medium"
                                        }`}
                                    title={isCollapsed ? item.label : ""}
                                >
                                    <Icon size={20} className={isActive ? "text-white" : "group-hover:text-slate-900"} />
                                    {!isCollapsed && (
                                        <motion.span
                                            initial={{ opacity: 0, x: -5 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            className="text-sm font-medium whitespace-nowrap"
                                        >
                                            {item.label}
                                        </motion.span>
                                    )}
                                    {isCollapsed && isActive && (
                                        <div className={`absolute left-0 w-1 h-6 bg-white rounded-r-full`} />
                                    )}
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                <div className={`mt-auto p-6 ${isCollapsed ? 'px-2' : ''} w-full`}>
                    <button
                        onClick={handleLogout}
                        className={`flex items-center gap-3 p-3 w-full rounded-xl text-slate-500 hover:bg-red-50 hover:text-red-600 transition-all duration-200 font-medium ${isCollapsed ? 'justify-center' : 'px-4'}`}
                        title={isCollapsed ? "Sign Out" : ""}
                    >
                        <LogOut size={20} />
                        {!isCollapsed && <span className="text-sm font-bold whitespace-nowrap">Sign Out</span>}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;