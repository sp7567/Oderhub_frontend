/**
 * pages/OrdersListPage.jsx
 * Full-featured orders table with:
 *  - Inline status update dropdown
 *  - Delete with styled ConfirmModal (no window.confirm)
 *  - All icons via lucide-react
 */

import { useState, useCallback, useEffect } from "react";
import toast from "react-hot-toast";
import {
  Plus, Search, SlidersHorizontal, Trash2, ArrowUpDown, Loader2,
} from "lucide-react";
import useOrders from "../hooks/useOrders";
import { updateOrderStatus, deleteOrder } from "../services/orderService";
import StatusBadge from "../components/StatusBadge";
import { SkeletonTable } from "../components/SkeletonRow";
import Pagination from "../components/Pagination";
import EmptyState from "../components/EmptyState";
import ConfirmModal from "../components/ConfirmModal";
import { Link } from "react-router-dom";
import useSocket from "../hooks/useSocket";

const STORE_OPTIONS = ["", "STORE_A", "STORE_B", "STORE_C", "STORE_D", "STORE_E"];

const NEXT_STATUS = {
  PLACED:    ["PREPARING"],
  PREPARING: ["COMPLETED"],
  COMPLETED: [],
};

const fmt = (n) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(n);

// ─── Inline Status Cell ───────────────────────────────────────────────────────
const StatusCell = ({ order, onUpdated }) => {
  const [loading, setLoading] = useState(false);
  const allowed = NEXT_STATUS[order.status] || [];

  const handleChange = async (e) => {
    const newStatus = e.target.value;
    if (!newStatus) return;
    setLoading(true);
    try {
      const res = await updateOrderStatus(order._id || order.id, newStatus);
      toast.success(`Status → ${newStatus}`);
      onUpdated(order._id || order.id, res.data);
    } catch (err) {
      toast.error(err.message || "Update failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <StatusBadge status={order.status} />
      {allowed.length > 0 && (
        <div className="relative">
          {loading ? (
            <Loader2 size={16} className="animate-spin" style={{ color: "var(--text-muted)" }} />
          ) : (
            <select
              id={`status-select-${(order._id || order.id)?.slice(-6)}`}
              defaultValue=""
              onChange={handleChange}
              title="Advance status"
              className="text-xs pl-2 pr-6 py-1 rounded-lg border appearance-none cursor-pointer transition-colors duration-150"
              style={{
                backgroundColor: "var(--bg-surface-2)",
                borderColor:     "var(--border-strong)",
                color:           "var(--text-secondary)",
              }}
            >
              <option value="" disabled>▾</option>
              {allowed.map((s) => (
                <option key={s} value={s}>→ {s}</option>
              ))}
            </select>
          )}
        </div>
      )}
    </div>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────
const OrdersListPage = () => {
  const { orders: initialOrders, meta, loading, error, params, updateParams, refetch } = useOrders();
  const [orders, setOrders] = useState([]);
  const [searchInput, setSearchInput] = useState(params.search || "");
  
  // 📡 Real-time integration
  const { socket, isConnected } = useSocket(params.store_id); // Join room if store_id is selected

  // Delete modal state
  const [deleteTarget, setDeleteTarget]   = useState(null); // order id
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => { setOrders(initialOrders); }, [initialOrders]);

  useEffect(() => {
    const t = setTimeout(() => updateParams({ search: searchInput, page: 1 }), 400);
    return () => clearTimeout(t);
  }, [searchInput]); // eslint-disable-line

  // 📡 Socket listeners
  useEffect(() => {
    if (socket) {
      socket.on("order_created", refetch);
      socket.on("order_status_updated", refetch);
      
      return () => {
        socket.off("order_created", refetch);
        socket.off("order_status_updated", refetch);
      };
    }
  }, [socket, refetch]);

  // Inline status update
  const handleStatusUpdated = useCallback((id, updated) => {
    setOrders((prev) =>
      prev.map((o) => (o._id === id || o.id === id) ? { ...o, ...updated } : o)
    );
    refetch();
  }, [refetch]);

  // Delete flow — open modal
  const openDeleteModal = (orderId) => {
    setDeleteTarget(orderId);
    setDeleteModalOpen(true);
  };

  // Delete flow — confirm
  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteOrder(deleteTarget);
      toast.success("Order deleted successfully.");
      setOrders((prev) => prev.filter((o) => o._id !== deleteTarget && o.id !== deleteTarget));
      refetch();
    } catch (err) {
      toast.error(err.message || "Failed to delete order.");
    } finally {
      setDeleting(false);
      setDeleteModalOpen(false);
      setDeleteTarget(null);
    }
  };

  return (
    <div className="p-8 animate-fade-in">

      {/* ── Delete Confirmation Modal ──────────────────────────── */}
      <ConfirmModal
        open={deleteModalOpen}
        title="Delete Order"
        message={`Are you sure you want to delete order #${deleteTarget?.slice(-8).toUpperCase() || ""}? This action is permanent and cannot be undone.`}
        confirmLabel="Yes, Delete"
        cancelLabel="Cancel"
        variant="danger"
        loading={deleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => { setDeleteModalOpen(false); setDeleteTarget(null); }}
      />

      {/* ── Header ─────────────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-page-primary mb-1">Orders</h1>
            <p className="text-page-muted">
              {meta.total} total order{meta.total !== 1 ? "s" : ""}
            </p>
          </div>
          <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-surface-2 border border-theme h-fit mt-1">
            <div className={`w-1.5 h-1.5 rounded-full ${isConnected ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]" : "bg-red-500"}`} />
            <span className="text-[9px] font-bold uppercase tracking-wider text-page-secondary">
              {isConnected ? "Connected" : "Offline"}
            </span>
          </div>
        </div>
        <Link to="/orders/create" id="go-create-order-btn" className="btn-primary">
          <Plus size={16} />
          New Order
        </Link>
      </div>

      {/* ── Filters ────────────────────────────────────────────── */}
      <div className="card p-4 mb-5 flex flex-wrap gap-4 items-end">
        <div className="flex-1 min-w-[200px]">
          <label htmlFor="orders-search" className="label">
            <Search size={12} className="inline mr-1 -mt-0.5" />
            Search
          </label>
          <input
            id="orders-search"
            type="text"
            placeholder="Search by store or status…"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="input"
          />
        </div>
        <div className="w-44">
          <label htmlFor="store-filter" className="label">
            <SlidersHorizontal size={12} className="inline mr-1 -mt-0.5" />
            Store
          </label>
          <select
            id="store-filter"
            value={params.store_id || ""}
            onChange={(e) => updateParams({ store_id: e.target.value, page: 1 })}
            className="input"
          >
            {STORE_OPTIONS.map((s) => (
              <option key={s} value={s}>{s || "All Stores"}</option>
            ))}
          </select>
        </div>
        <div className="w-32">
          <label htmlFor="page-limit" className="label">
            <ArrowUpDown size={12} className="inline mr-1 -mt-0.5" />
            Per page
          </label>
          <select
            id="page-limit"
            value={params.limit}
            onChange={(e) => updateParams({ limit: Number(e.target.value), page: 1 })}
            className="input"
          >
            {[5, 10, 20, 50].map((l) => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Error banner */}
      {error && (
        <div className="mb-5 p-4 rounded-xl border text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800">
          ⚠ {error}
        </div>
      )}

      {/* ── Table ──────────────────────────────────────────────── */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Store</th>
                <th>Items</th>
                <th>Amount</th>
                <th>Status / Advance</th>
                <th>Created At</th>
                <th className="text-center w-16">Delete</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <SkeletonTable rows={params.limit} cols={7} />
              ) : orders.length === 0 ? (
                <EmptyState
                  icon="📭"
                  title="No orders found"
                  description="Try adjusting your filters or create a new order."
                />
              ) : (
                orders.map((order) => {
                  const id = order._id || order.id;
                  return (
                    <tr key={id} className="animate-fade-in">
                      <td className="font-mono text-xs text-page-muted">
                        #{id?.slice(-8).toUpperCase()}
                      </td>
                      <td className="font-semibold text-page-primary">{order.store_id}</td>
                      <td className="max-w-[200px] text-page-secondary">
                        <div className="truncate">
                          {order.items?.map((it) => `${it.item_id} ×${it.qty}`).join(", ")}
                        </div>
                      </td>
                      <td className="font-bold text-brand-600 dark:text-brand-400">
                        {fmt(order.total_amount)}
                      </td>
                      <td>
                        <StatusCell order={order} onUpdated={handleStatusUpdated} />
                      </td>
                      <td className="text-page-muted text-xs whitespace-nowrap">
                        {new Date(order.created_at).toLocaleString()}
                      </td>
                      {/* Delete icon — opens modal */}
                      <td className="text-center">
                        <button
                          id={`delete-order-${id?.slice(-6)}`}
                          onClick={() => openDeleteModal(id)}
                          title="Delete order"
                          className="w-8 h-8 mx-auto flex items-center justify-center rounded-lg
                                     text-red-400 hover:text-red-600 hover:bg-red-50
                                     dark:hover:bg-red-900/20 dark:hover:text-red-400
                                     border border-transparent hover:border-red-200 dark:hover:border-red-800
                                     transition-all duration-150"
                        >
                          <Trash2 size={15} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!loading && orders.length > 0 && (
          <div className="px-6 py-4" style={{ borderTop: "1px solid var(--border)" }}>
            <div className="flex items-center justify-between">
              <p className="text-xs text-page-muted">
                Showing {orders.length} of {meta.total} orders
              </p>
              <Pagination
                page={meta.page}
                totalPages={meta.totalPages}
                onPageChange={(page) => updateParams({ page })}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersListPage;
