/**
 * components/OrderCard.jsx — Card view for a single order (mobile/grid layout).
 */

import StatusBadge from "./StatusBadge";

const fmt = (n) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(n);

const OrderCard = ({ order, onStatusClick }) => (
  <div className="card p-5 animate-slide-up hover:border-brand-700/50 transition-colors">
    <div className="flex items-start justify-between mb-3">
      <div>
        <p className="text-xs text-slate-500 font-mono mb-0.5">#{order.id?.slice(-8).toUpperCase()}</p>
        <p className="font-semibold text-slate-200">{order.store_id}</p>
      </div>
      <StatusBadge status={order.status} />
    </div>

    <div className="text-sm text-slate-400 mb-3">
      <span className="font-medium text-slate-300">{order.items?.length || 0}</span> item(s):{" "}
      {order.items?.map((it) => `${it.item_id} ×${it.qty}`).join(", ")}
    </div>

    <div className="flex items-center justify-between">
      <span className="text-lg font-bold text-brand-400">{fmt(order.total_amount)}</span>
      <div className="flex items-center gap-2">
        <span className="text-xs text-slate-500">
          {new Date(order.created_at).toLocaleDateString()}
        </span>
        {onStatusClick && (
          <button
            onClick={() => onStatusClick(order)}
            className="btn btn-secondary btn-sm"
            id={`order-status-btn-${order.id}`}
          >
            Update
          </button>
        )}
      </div>
    </div>
  </div>
);

export default OrderCard;
