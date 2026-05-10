/**
 * pages/DashboardPage.jsx
 * Dashboard with Lucide icons in KPI cards.
 */

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Package, Store, Circle, Loader, CheckCircle2, IndianRupee, RefreshCcw,
} from "lucide-react";
import { fetchStats } from "../services/orderService";
import useSocket from "../hooks/useSocket";
import ActivityFeed from "../components/ActivityFeed";
import StatCard    from "../components/StatCard";
import StatusBadge from "../components/StatusBadge";
import Spinner     from "../components/Spinner";

const fmt = (n) =>
  new Intl.NumberFormat("en-IN", {
    style:    "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(n ?? 0);

const DashboardPage = () => {
  const [selectedStore, setSelectedStore] = useState("");
  const [stats,   setStats]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);
  const { socket, isConnected } = useSocket(selectedStore);

  const load = async () => {
    try {
      const res = await fetchStats({ store_id: selectedStore });
      setStats(res.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [selectedStore]);

  // 📡 Real-time listeners
  useEffect(() => {
    if (socket) {
      const handleUpdate = (data) => {
        // Only refresh if it's the global view OR matches our selected store
        if (!selectedStore || data.store_id === selectedStore) {
          load();
        }
      };

      socket.on("order_created", handleUpdate);
      socket.on("order_status_updated", handleUpdate);

      return () => {
        socket.off("order_created", handleUpdate);
        socket.off("order_status_updated", handleUpdate);
      };
    }
  }, [socket, selectedStore]);

  const kpis = stats
    ? [
        { label: "Total Orders",  value: stats.total,          icon: Package,       color: "brand"   },
        { label: "Active Stores", value: stats.stores,         icon: Store,         color: "purple"  },
        { label: "Placed",        value: stats.placed,         icon: Circle,        color: "blue"    },
        { label: "Preparing",     value: stats.preparing,      icon: Loader,        color: "amber"   },
        { label: "Completed",     value: stats.completed,      icon: CheckCircle2,  color: "emerald" },
        { label: "Total Revenue", value: fmt(stats.revenue),   icon: IndianRupee,   color: "brand"   },
      ]
    : [];

  return (
    <div className="p-8 animate-fade-in">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold text-page-primary mb-1">Dashboard</h1>
          <p className="text-page-muted">Real-time multi-user synchronization.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-48">
            <label className="text-[10px] font-bold uppercase tracking-widest text-page-muted mb-1 block">Switch Store</label>
            <select 
              value={selectedStore}
              onChange={(e) => setSelectedStore(e.target.value)}
              className="input text-xs py-1.5"
            >
              <option value="">All Stores (Global)</option>
              {["STORE_A", "STORE_B", "STORE_C", "STORE_D", "STORE_E"].map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-2 border border-theme h-fit mb-0.5">
            <div className={`w-2 h-2 rounded-full ${isConnected ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]" : "bg-red-500"}`} />
            <span className="text-[10px] font-bold uppercase tracking-widest text-page-secondary">
              {isConnected ? "Live" : "Offline"}
            </span>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-32">
          <Spinner size="lg" />
        </div>
      ) : error ? (
        <div className="card p-6 border-red-300 dark:border-red-800 text-red-600 dark:text-red-400">
          ⚠ Failed to load stats: {error}
        </div>
      ) : (
        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
            {kpis.map((kpi) => (
              <StatCard key={kpi.label} {...kpi} />
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Recent Orders */}
            <div className="card lg:col-span-2">
              <div
                className="px-6 py-4 flex items-center justify-between border-b"
                style={{ borderColor: "var(--border)" }}
              >
                <h2 className="font-semibold text-page-primary">Recent Orders</h2>
                <Link
                  to="/orders"
                  className="text-sm text-brand-600 dark:text-brand-400 hover:text-brand-500 transition-colors"
                >
                  View all →
                </Link>
              </div>

              <div className="table-wrapper rounded-none border-0">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Store</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(stats?.recentOrders ?? []).length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-12 text-center text-page-muted">
                          No orders found.
                        </td>
                      </tr>
                    ) : (
                      stats.recentOrders.map((order) => {
                        const id = order._id?.toString?.() ?? order.id;
                        return (
                          <tr key={id} className="animate-fade-in">
                            <td className="font-mono text-xs text-page-muted">
                              #{id?.slice(-8).toUpperCase()}
                            </td>
                            <td className="font-medium text-page-primary">{order.store_id}</td>
                            <td className="font-semibold text-brand-600 dark:text-brand-400">
                              {fmt(order.total_amount)}
                            </td>
                            <td><StatusBadge status={order.status} /></td>
                            <td className="text-page-muted text-xs whitespace-nowrap">
                              {new Date(order.created_at).toLocaleTimeString()}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Activity Feed */}
            <div className="space-y-4">
              <h2 className="font-semibold text-page-primary flex items-center gap-2">
                <RefreshCcw size={16} className="text-brand-500" />
                Live Activity
              </h2>
              <ActivityFeed storeId={selectedStore} />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DashboardPage;
