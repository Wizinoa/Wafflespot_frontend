import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Store, MapPin } from "lucide-react";
import { toast } from "sonner";
import { setBranch } from "../features/branchSlice";

const SelectBranch = () => {
    const { user, token } = useSelector((state: any) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) {
            navigate("/login");
            return;
        }
        if (user?.role === "ADMIN") {
            navigate("/admin/dashboard");
            return;
        }
        if (user?.businessType === "SHOP") {
            navigate("/dashboard");
            return;
        }
    }, [user, token, navigate]);

    const handleSelectBranch = (branch: string) => {
        dispatch(setBranch(branch));
        toast.success(`Branch ${branch} selected`);
        navigate("/dashboard");
    };

    if (!user?.branches || user.branches.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center p-8 bg-white rounded-2xl shadow-xl">
                    <h2 className="text-2xl font-bold text-red-600 mb-2">No Branches Configured</h2>
                    <p className="text-gray-600 mb-6">Contact your administrator to configure branches for your account.</p>
                    <button
                        onClick={() => navigate("/login")}
                        className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                    >
                        Back to Login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex bg-gray-50">
            <div className="flex-1 flex flex-col items-center justify-center p-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8"
                >
                    <div className="flex flex-col items-center text-center mb-8">
                        <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4 text-indigo-600">
                            <Store size={32} />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Select Your Branch</h1>
                        <p className="text-gray-500">Welcome {user?.name}, please select the branch you are operating today.</p>
                    </div>

                    <div className="space-y-4">
                        {/* {user.branches.map((branch: string, index: number) => (
                            <motion.button
                                key={index}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => handleSelectBranch(branch)}
                                className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-indigo-500 hover:bg-indigo-50 transition-all font-medium text-gray-700 hover:text-indigo-700 group shadow-sm"
                            >
                                <div className="flex items-center gap-3">
                                    <MapPin className="text-gray-400 group-hover:text-indigo-500" size={20} />
                                    <span>{branch}</span>
                                </div>
                                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                    →
                                </div>
                            </motion.button>
                        ))} */}

                        {user.branches.map((branch: string, index: number) => {
  const isDisabled = index === 1;

  return (
    <motion.button
      key={index}
      whileHover={!isDisabled ? { scale: 1.02 } : {}}
      whileTap={!isDisabled ? { scale: 0.98 } : {}}
      onClick={() => !isDisabled && handleSelectBranch(branch)}
      disabled={isDisabled}
      className={`w-full flex items-center justify-between p-4 border rounded-xl transition-all font-medium shadow-sm
        ${
          isDisabled
            ? "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed"
            : "border-gray-200 hover:border-indigo-500 hover:bg-indigo-50 text-gray-700 hover:text-indigo-700 group"
        }
      `}
    >
      <div className="flex items-center gap-3">
        <MapPin
          className={
            isDisabled
              ? "text-gray-300"
              : "text-gray-400 group-hover:text-indigo-500"
          }
          size={20}
        />
        <span>{branch}</span>

        {isDisabled && (
          <span className="text-xs bg-gray-200 px-2 py-1 rounded">
            Soon
          </span>
        )}
      </div>

      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
          isDisabled
            ? "bg-gray-200 text-gray-400"
            : "bg-gray-100 group-hover:bg-indigo-600 group-hover:text-white"
        }`}
      >
        →
      </div>
    </motion.button>
  );
})}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default SelectBranch;
