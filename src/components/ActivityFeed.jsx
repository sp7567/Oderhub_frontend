/**
 * components/ActivityFeed.jsx
 * Shows a live stream of global socket events filtered by store.
 */

import { useSocket } from "../context/SocketContext";
import { Package, RefreshCcw, Clock } from "lucide-react";

const ActivityFeed = ({ storeId }) => {
  const { activities } = useSocket();

  // Filter activities based on the selected store (or show all if no store selected)
  const filteredActivities = activities.filter((act) => {
    if (!storeId || storeId === "global") return true;
    return act.store_id === storeId;
  });

  if (filteredActivities.length === 0) {
    return (
      <div className="card p-6 text-center text-page-muted text-sm">
        No recent activity.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {filteredActivities.map((act) => (
        <div 
          key={act.id} 
          className="card p-3 flex items-start gap-3 animate-slide-up border-l-4"
          style={{ borderLeftColor: act.type === "CREATED" ? "#6366f1" : "#f59e0b" }}
        >
          <div className={`p-2 rounded-lg ${act.type === "CREATED" ? "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400" : "bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400"}`}>
            {act.type === "CREATED" ? <Package size={16} /> : <RefreshCcw size={16} />}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-page-primary truncate">
              {act.type === "CREATED" 
                ? `New order #${act.data.id?.slice(-6).toUpperCase()}` 
                : `Order #${act.data.orderId?.slice(-6).toUpperCase()} updated`}
            </p>
            <p className="text-xs text-page-muted">
              {act.type === "CREATED" 
                ? `Store: ${act.data.store_id} • ₹${act.data.total_amount}` 
                : `Store: ${act.data.store_id} • Status: ${act.data.status}`}
            </p>
          </div>
          <div className="text-[10px] text-page-muted flex items-center gap-1 whitespace-nowrap">
            <Clock size={10} />
            {act.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ActivityFeed;
