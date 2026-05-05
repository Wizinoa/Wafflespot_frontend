import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "./features/Store/store";

// Pages
import Login from "./Pages/Login";
import Dashboard from "./Pages/Dashboard";
import Billing from "./Pages/Billing";
import StockUpdate from "./Pages/StockUpdate";
import BillsHistory from "./Pages/BillsHistory";

// Admin Pages
import StockMaster from "./Pages/admin/StockMaster";
import ProductMaster from "./Pages/admin/ProductMaster";
import Reports from "./Pages/admin/Reports";
import RevenueReport from "./Pages/admin/RevenueReport";

// Layout
import Layout from "./Components/Layout/Layout";
import SelectBranch from "./Pages/SelectBranch";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { token } = useSelector((state: RootState) => state.auth);
  if (!token) {
    return <Navigate to="/login" />;
  }
  return <>{children}</>;
};

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, token } = useSelector((state: RootState) => state.auth);
  if (!token) return <Navigate to="/login" />;
  if (user?.role?.toLowerCase() !== "admin") return <Navigate to="/dashboard" />;
  return <>{children}</>;
};

function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/select-branch"
          element={
            <ProtectedRoute>
              <SelectBranch />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/billing"
          element={
            <ProtectedRoute>
              <Layout>
                <Billing />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/stock-update"
          element={
            <ProtectedRoute>
              <Layout>
                <StockUpdate />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/bills-history"
          element={
            <ProtectedRoute>
              <Layout>
                <BillsHistory />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/stock-master"
          element={
            <AdminRoute>
              <Layout>
                <StockMaster />
              </Layout>
            </AdminRoute>
          }
        />
        <Route
          path="/admin/product-master"
          element={
            <AdminRoute>
              <Layout>
                <ProductMaster />
              </Layout>
            </AdminRoute>
          }
        />
        <Route
          path="/admin/reports"
          element={
            <AdminRoute>
              <Layout>
                <Reports />
              </Layout>
            </AdminRoute>
          }
        />
        <Route
          path="/admin/revenue"
          element={
            <AdminRoute>
              <Layout>
                <RevenueReport />
              </Layout>
            </AdminRoute>
          }
        />
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </>
  );
}

export default App;