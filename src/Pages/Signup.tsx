import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Eye, EyeOff, UserPlus, Plus, X } from "lucide-react";
import { motion } from "framer-motion";
import { useRegisterMutation } from "../services/api";

const Signup = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "USER",
        category: "WAFFLE",
        businessType: "SHOP",
        branches: [] as string[],
    });
    
    const [branchInput, setBranchInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const [registerApi] = useRegisterMutation();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAddBranch = (e: React.MouseEvent) => {
        e.preventDefault();
        if (branchInput.trim() && !formData.branches.includes(branchInput.trim())) {
            setFormData({
                ...formData,
                branches: [...formData.branches, branchInput.trim()]
            });
            setBranchInput("");
        }
    };

    const handleRemoveBranch = (branchToRemove: string) => {
        setFormData({
            ...formData,
            branches: formData.branches.filter(b => b !== branchToRemove)
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const dataToSubmit = { ...formData };
            if (dataToSubmit.role === "ADMIN") {
                delete (dataToSubmit as any).category;
                delete (dataToSubmit as any).businessType;
                delete (dataToSubmit as any).branches;
            } else if (dataToSubmit.businessType !== "STALL") {
                dataToSubmit.branches = [];
            }

            if (dataToSubmit.role === "USER" && dataToSubmit.businessType === "STALL" && dataToSubmit.branches.length === 0) {
                 toast.error("Please add at least one branch for stall users");
                 setLoading(false);
                 return;
            }

            await registerApi(dataToSubmit).unwrap();
            toast.success("Account created successfully");
            navigate("/login");
        } catch (err: any) {
            toast.error(err?.data?.message || "Registration failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex">
            <div className="flex-1 flex items-center justify-center bg-white p-6 lg:p-12 overflow-y-auto">
                <div className="w-full max-w-lg my-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center">
                                <UserPlus className="h-7 w-7 text-white" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">Waffle Spot</h2>
                                <p className="text-sm text-gray-500">Inventory Portal</p>
                            </div>
                        </div>

                        <h1 className="text-4xl font-bold text-gray-900 mb-2">Create Account</h1>
                        <p className="text-gray-600 mb-8">Register to access your business dashboard</p>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    placeholder="John Doe"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    placeholder="you@example.com"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                        placeholder="••••••••"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                                    <select
                                        name="role"
                                        value={formData.role}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all bg-white"
                                    >
                                        <option value="USER">USER</option>
                                        <option value="ADMIN">ADMIN</option>
                                    </select>
                                </div>

                                {formData.role === "USER" && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                        <select
                                            name="category"
                                            value={formData.category}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all bg-white"
                                        >
                                            <option value="WAFFLE">WAFFLE (Stall)</option>
                                            <option value="CAFE">CAFE (Shop)</option>
                                        </select>
                                    </div>
                                )}
                            </div>

                            {formData.role === "USER" && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Business Type</label>
                                    <select
                                        name="businessType"
                                        value={formData.businessType}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all bg-white"
                                    >
                                        <option value="SHOP">SHOP (Single Branch)</option>
                                        <option value="STALL">STALL (Multi Branch)</option>
                                    </select>
                                </div>
                            )}

                            {formData.role === "USER" && formData.businessType === "STALL" && (
                                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Manage Branches</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={branchInput}
                                            onChange={(e) => setBranchInput(e.target.value)}
                                            placeholder="Enter branch name"
                                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                                        />
                                        <button
                                            type="button"
                                            onClick={handleAddBranch}
                                            className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors flex items-center gap-1"
                                        >
                                            <Plus size={18} /> Add
                                        </button>
                                    </div>
                                    {formData.branches.length > 0 && (
                                        <div className="mt-3 flex flex-wrap gap-2">
                                            {formData.branches.map((branch, idx) => (
                                                <div key={idx} className="bg-white border border-gray-300 px-3 py-1.5 rounded-full flex items-center gap-2 text-sm text-gray-700 shadow-sm">
                                                    {branch}
                                                    <button type="button" onClick={() => handleRemoveBranch(branch)} className="text-red-500 hover:text-red-700">
                                                        <X size={16} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-4 rounded-xl text-lg font-semibold transition-all shadow-lg shadow-indigo-500/30 disabled:opacity-70 mt-6"
                            >
                                {loading ? "Creating Account..." : "Create Account"}
                            </motion.button>
                        </form>

                        <p className="text-center text-gray-600 mt-6">
                            Already have an account?{" "}
                            <Link to="/login" className="text-indigo-600 font-semibold hover:underline">
                                Sign In
                            </Link>
                        </p>
                    </motion.div>
                </div>
            </div>

            <div className="hidden lg:flex flex-1 relative">
                <img
                    src="https://images.unsplash.com/photo-1551024601-bec78aea704b?q=80&w=1200&auto=format&fit=crop"
                    alt="Signup Background"
                    className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/80 via-purple-900/70 to-black/50" />
                <div className="absolute bottom-12 left-12 text-white">
                    <h3 className="text-3xl font-semibold mb-3">Join Waffle Spot Today</h3>
                    <p className="text-lg max-w-md opacity-90">
                        Streamline your operations and manage your inventory with our comprehensive platform.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Signup;
