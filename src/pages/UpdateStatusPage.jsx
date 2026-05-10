/**
 * pages/UpdateStatusPage.jsx — Theme-aware status update form.
 */

import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { fetchOrders, fetchOrderById, updateOrderStatus } from "../services/orderService";
import StatusBadge from "../components/StatusBadge";
import Spinner from "../components/Spinner";

const NEXT_STATUS = {
  PLACED:    ["PREPARING"],
  PREPARING: ["COMPLETED"],
  COMPLETED: [],
};

const fmt = (n) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(n);

const UpdateStatusPage = () => {
  const [searchParams]          = useSearchParams();
  const preselectedId           = searchParams.get("id") || "";

  const [orderId,      setOrderId]      = useState(preselectedId);
  const [order,        setOrder]        = useState(null);
  const [newStatus,    setNewStatus]    = useState("");
  const [loadingOrder, setLoadingOrder] = useState(false);
  const [loadingUpd,   setLoadingUpd]   = useState(false);
  const [orders,       setOrders]       = useState([]);

  useEffect(() => {
    fetchOrders({ limit: 100 }).then((res) => setOrders(res.data || [])).catch(() => {});
  }, []);

  useEffect(() => {
    if (!orderId) { setOrder(null); return; }
    const load = async () => {
      setLoadingOrder(true);
      try {
        const res = await fetchOrderById(orderId);
        setOrder(res.data);
        setNewStatus("");
      } catch (err) {
        toast.error(err.message || "Order not found.");
        setOrder(null);
      } finally {
        setLoadingOrder(false);
      }
    };
    load();
  }, [orderId]);

  const handleUpdate = async () => {
    if (!newStatus) { toast.error("Select a new status first."); return; }
    setLoadingUpd(true);
    try {
      const res = await updateOrderStatus(orderId, newStatus);
      setOrder(res.data);
      setNewStatus("");
      toast.success(`Status updated to ${newStatus} ✅`);
    } catch (err) {
      toast.error(err.message || "Failed to update status.");
    } finally {
      setLoadingUpd(false);
    }
  };

  const allowedNext = order ? NEXT_STATUS[order.status] || [] : [];

  return (
    <div className="p-8 max-w-2xl mx-auto animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-page-primary mb-1">Update Order Status</h1>
        <p className="text-page-muted">Advance an order through its lifecycle.</p>
      </div>

      <div className="card p-6 space-y-6">

        {/* Order selection */}
        <div>
          <label htmlFor="order-select" className="label">Select Order *</label>
          <select
            id="order-select"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            className="input"
          >
            <option value="">— Choose an order —</option>
            {orders.map((o) => {
              const id = o.id || o._id;
              return (
                <option key={id} value={id}>
                  #{id?.slice(-8).toUpperCase()} — {o.store_id} — {o.status}
                </option>
              );
            })}
          </select>
        </div>

        {/* Order details */}
        {loadingOrder ? (
          <div className="flex items-center justify-center py-8"><Spinner /></div>
        ) : order ? (
          <div
            className="rounded-xl p-5 space-y-3 border"
            style={{ backgroundColor: "var(--bg-surface-2)", borderColor: "var(--border-strong)" }}
          >
            {[
              ["Order ID",
               <span className="font-mono text-xs text-page-muted">
                 #{(order.id || order._id)?.slice(-8).toUpperCase()}
               </span>],
              ["Store",   <span className="font-semibold text-page-primary">{order.store_id}</span>],
              ["Items",
               <span className="text-page-secondary text-sm text-right max-w-[260px]">
                 {order.items?.map((it) => `${it.item_id} ×${it.qty}`).join(", ")}
               </span>],
              ["Total",   <span className="font-bold text-brand-600 dark:text-brand-400">{fmt(order.total_amount)}</span>],
              ["Status",  <StatusBadge status={order.status} />],
            ].map(([k, v]) => (
              <div key={k} className="flex items-center justify-between">
                <span className="text-page-muted text-sm">{k}</span>
                {v}
              </div>
            ))}
          </div>
        ) : null}

        {/* Status selector */}
        {order && (
          <div>
            <label htmlFor="new-status-select" className="label">New Status *</label>
            {allowedNext.length === 0 ? (
              <div className="rounded-xl p-4 text-sm bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-700/30 text-emerald-700 dark:text-emerald-400">
                ✅ This order is already in its final state: <strong>COMPLETED</strong>
              </div>
            ) : (
              <select
                id="new-status-select"
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="input"
              >
                <option value="">— Select new status —</option>
                {allowedNext.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            )}
          </div>
        )}

        {order && allowedNext.length > 0 && (
          <button
            id="update-status-btn"
            onClick={handleUpdate}
            disabled={loadingUpd || !newStatus}
            className="btn-primary w-full py-3"
          >
            {loadingUpd ? <><Spinner size="sm" /> Updating…</> : `Update to ${newStatus || "…"}`}
          </button>
        )}
      </div>
    </div>
  );
};

export default UpdateStatusPage;
