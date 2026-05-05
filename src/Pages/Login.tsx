import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Eye, EyeOff, LogIn, Store } from "lucide-react";
import { motion } from "framer-motion"
import { useLoginMutation } from "../services/api";
import { useDispatch } from "react-redux";
import { setCredentials } from "../features/authSlice";

const Login = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const [loginApi] = useLoginMutation();
    const dispatch = useDispatch();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res: any = await loginApi(formData).unwrap();
            dispatch(setCredentials(res));
            toast.success("Welcome back!");

            // Check for multi-branch users
            if (res.user.branches && res.user.branches.length > 1) {
                navigate("/select-branch");
            } else if (res.user.role?.toUpperCase() === "ADMIN") {
                navigate("/dashboard");
            } else {
                navigate("/dashboard");
            }

        } catch (err: any) {
            toast.error(err?.data?.message || "Invalid credentials. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-gray-100 text-gray-900">
            {/* Left Side - Visual */}
            <div className="hidden lg:flex flex-1 relative overflow-hidden bg-gray-100">


                <div className="relative z-10 flex flex-col items-center justify-center w-full p-12 text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                        className="mb-8"
                    >
                        <div className="w-24 h-24 bg-orange-500 rounded-3xl flex items-center justify-center shadow-2xl shadow-indigo-500/20 mb-6 mx-auto">
                            <Store className="h-12 w-12 text-white" />
                            <img src="https://res.cloudinary.com/dxhrg5kgu/image/upload/v1777963755/Gemini_Generated_Image_tzpkvdtzpkvdtzpk_lvedfd.png" alt="icon" loading="lazy" />
                        </div>
                        <h2 className="text-5xl font-black tracking-tight mb-4 bg-clip-text text-transparent bg-orange-500">
                            The Waffle Sopt
                        </h2>
                        <p className="text-xl text-gray-700 max-w-sm mx-auto font-medium">
                            Modern Management for Waffle & Cafe Businesses
                        </p>
                    </motion.div>


                </div>
            </div>

            {/* Right Side - Form */}
            <div className="flex-1 flex items-center justify-center p-6 sm:p-12 relative">
                <div className="w-full max-w-md relative z-10">
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="mb-10 lg:hidden text-center">
                            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg mx-auto mb-4">
                                <Store className="h-8 w-8 text-white" />
                            </div>
                            <h1 className="text-3xl font-bold">The Waffle Sopt</h1>
                        </div>

                        <div className="mb-8">
                            <h2 className="text-4xl font-bold mb-3">Sign In</h2>
                            <p className="text-gray-500">Access your shop's management portal</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-400 uppercase tracking-wider ml-1">
                                    Email Address
                                </label>
                                <div className="relative group">
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        placeholder="Enter your email"
                                        className="w-full bg-[#161B29] border border-gray-800 text-white px-5 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder:text-gray-600"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-400 uppercase tracking-wider ml-1">
                                    Password
                                </label>
                                <div className="relative group">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                        placeholder="••••••••"
                                        className="w-full bg-[#161B29] border border-gray-800 text-white px-5 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder:text-gray-600"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                            </div>



                            <motion.button
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white py-4 rounded-2xl text-lg font-bold transition-all shadow-xl shadow-indigo-500/20 disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        <span>Authenticating...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Sign In</span>
                                        <LogIn className="h-5 w-5" />
                                    </>
                                )}
                            </motion.button>
                        </form>


                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Login;