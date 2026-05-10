/**
 * pages/AnalyticsPage.jsx
 * Premium analytics dashboard with diverse Recharts visualizations.
 * Charts: Area (orders/day), Radial (revenue %), Composed (items), KPI Cards.
 */

import { useState, useEffect, useCallback } from "react";
import {
  AreaChart, Area,
  RadialBarChart, RadialBar, Legend,
  ComposedChart, Bar, Line,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, PieChart, Pie,
} from "recharts";
import { fetchAnalytics, archiveOrders } from "../services/orderService";
import { Database, TrendingUp, ShoppingBag, Store, Info, RefreshCw, IndianRupee, Package } from "lucide-react";
import toast from "react-hot-toast";

// ─── Custom Tooltip ───────────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label, prefix = "", suffix = "" }) => {
  if (active && payload && payload.length) {
    return (
      <div className="card p-3 text-xs space-y-1 min-w-[120px]">
        {label && <p className="font-semibold text-page-primary mb-2">{label}</p>}
        {payload.map((p, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full" style={{ background: p.color || p.fill }} />
            <span className="text-page-muted capitalize">{p.name}:</span>
            <span className="font-bold text-page-primary">{prefix}{p.value?.toLocaleString()}{suffix}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

// ─── KPI Summary Card ─────────────────────────────────────────────────────────
const KpiCard = ({ icon: Icon, label, value, color, sub }) => (
  <div className="card p-5 flex items-center gap-4">
    <div className="p-3 rounded-2xl shrink-0" style={{ background: `${color}18` }}>
      <Icon size={22} style={{ color }} />
    </div>
    <div className="min-w-0">
      <p className="text-xs font-medium text-page-muted uppercase tracking-wider">{label}</p>
      <p className="text-2xl font-bold text-page-primary mt-0.5 truncate">{value}</p>
      {sub && <p className="text-xs text-page-muted mt-0.5">{sub}</p>}
    </div>
  </div>
);

// ─── Analytics Page ───────────────────────────────────────────────────────────
const PALETTE = ["#6366f1", "#f59e0b", "#10b981", "#ef4444", "#8b5cf6", "#06b6d4"];

const AnalyticsPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [archiving, setArchiving] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    else setRefreshing(true);
    try {
      const res = await fetchAnalytics();
      setData(res.data);
    } catch {
      toast.error("Failed to load analytics data");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const handleArchive = async () => {
    if (!window.confirm("Archive orders older than 30 days? They will be moved to historical storage.")) return;
    setArchiving(true);
    try {
      const res = await archiveOrders();
      toast.success(`✅ Archived ${res.data.archivedCount} order(s) successfully!`);
      loadData(true);
    } catch {
      toast.error("Archival failed. Please try again.");
    } finally {
      setArchiving(false);
    }
  };

  // ─── Derived Data ──────────────────────────────────────────────────────────
  const totalRevenue  = data?.revenuePerStore?.reduce((s, x) => s + x.revenue, 0) ?? 0;
  const totalOrders   = data?.ordersPerDay?.reduce((s, x) => s + x.count, 0) ?? 0;
  const topStore      = data?.revenuePerStore?.[0]?._id ?? "—";
  const topItem       = data?.topItems?.[0]?._id ?? "—";

  // Pie chart: revenue share per store
  const pieData = data?.revenuePerStore?.map((s, i) => ({
    name: s._id,
    value: s.revenue,
    fill: PALETTE[i % PALETTE.length],
  })) ?? [];

  // Radial chart: top items by qty
  const radialData = data?.topItems?.map((item, i) => ({
    name: item._id,
    totalQty: item.totalQty,
    fill: PALETTE[i % PALETTE.length],
  })) ?? [];

  if (loading) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="relative">
          <div className="w-16 h-16 rounded-2xl gradient-brand flex items-center justify-center">
            <TrendingUp size={28} className="text-white" />
          </div>
          <div className="absolute inset-0 rounded-2xl animate-ping opacity-30 gradient-brand" />
        </div>
        <p className="text-page-muted font-medium animate-pulse text-sm">Computing analytics...</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 space-y-6 animate-fade-in">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-page-primary">Analytics</h1>
          <p className="text-page-muted text-sm">Store performance & order trends</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => loadData(true)}
            disabled={refreshing}
            className="btn-secondary flex items-center gap-2 btn-sm"
          >
            <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />
            Refresh
          </button>
          <button onClick={handleArchive} disabled={archiving} className="btn-primary flex items-center gap-2">
            <Database size={16} />
            {archiving ? "Archiving..." : "Archive Old Orders"}
          </button>
        </div>
      </div>

      {/* ── KPI Summary Row ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard icon={Package}      label="Total Orders"   value={totalOrders.toLocaleString()} color="#6366f1" sub="Last 30 days" />
        <KpiCard icon={IndianRupee}  label="Total Revenue"  value={`₹${(totalRevenue/1000).toFixed(1)}K`} color="#10b981" sub="All stores" />
        <KpiCard icon={Store}        label="Top Store"      value={topStore} color="#f59e0b" sub="By revenue" />
        <KpiCard icon={ShoppingBag}  label="Top Item"       value={topItem}  color="#8b5cf6" sub="By quantity" />
      </div>

      {/* ── Chart Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Chart 1: Area Chart — Orders per Day */}
        <div className="card p-5 space-y-4">
          <div className="flex items-center gap-2">
            <TrendingUp size={18} className="text-brand-600" />
            <h2 className="font-semibold text-page-primary text-sm">Order Volume Trend</h2>
          </div>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data?.ordersPerDay} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                <XAxis dataKey="_id" stroke="var(--text-muted)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--text-muted)" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip suffix=" orders" />} />
                <Area
                  type="monotone" dataKey="count" name="orders"
                  stroke="#6366f1" strokeWidth={2.5}
                  fill="url(#areaGradient)"
                  dot={{ r: 3, fill: "#6366f1", strokeWidth: 0 }}
                  activeDot={{ r: 6, fill: "#6366f1", stroke: "#fff", strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Pie Chart — Revenue Share */}
        <div className="card p-5 space-y-4">
          <div className="flex items-center gap-2">
            <Store size={18} className="text-amber-500" />
            <h2 className="font-semibold text-page-primary text-sm">Revenue Share by Store</h2>
          </div>
          <div className="h-[280px] flex items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData} dataKey="value" nameKey="name"
                  cx="50%" cy="50%" innerRadius={70} outerRadius={110}
                  paddingAngle={3} stroke="none"
                >
                  {pieData.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip
                  content={<CustomTooltip prefix="₹" />}
                  formatter={(v) => [`₹${v.toLocaleString()}`, "Revenue"]}
                />
                <Legend
                  iconType="circle" iconSize={8} wrapperStyle={{ fontSize: "12px", color: "var(--text-muted)" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Composed Chart — Top Items (Bar + Line) */}
        <div className="card p-5 space-y-4 lg:col-span-2">
          <div className="flex items-center gap-2">
            <ShoppingBag size={18} className="text-emerald-500" />
            <h2 className="font-semibold text-page-primary text-sm">Top 5 Selling Items — Quantity & Ranking</h2>
          </div>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={radialData} margin={{ top: 5, right: 20, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis yAxisId="left" stroke="var(--text-muted)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis yAxisId="right" orientation="right" stroke="var(--text-muted)" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip suffix=" units" />} />
                <Bar yAxisId="left" dataKey="totalQty" name="qty" radius={[8, 8, 0, 0]} barSize={48}>
                  {radialData.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} />
                  ))}
                </Bar>
                <Line yAxisId="right" type="monotone" dataKey="totalQty" name="trend"
                  stroke="#f59e0b" strokeWidth={2} strokeDasharray="5 3"
                  dot={{ r: 4, fill: "#f59e0b", stroke: "#fff", strokeWidth: 2 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Radial Bar — Store Revenue Radial */}
        <div className="card p-5 space-y-4 lg:col-span-2">
          <div className="flex items-center gap-2">
            <IndianRupee size={18} className="text-indigo-500" />
            <h2 className="font-semibold text-page-primary text-sm">Store Revenue Radial</h2>
          </div>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart
                cx="50%" cy="50%" innerRadius="20%" outerRadius="90%"
                data={data?.revenuePerStore?.map((s, i) => ({
                  name: s._id,
                  revenue: s.revenue,
                  fill: PALETTE[i % PALETTE.length],
                })) ?? []}
                startAngle={180} endAngle={-180}
              >
                <RadialBar dataKey="revenue" background={{ fill: "var(--bg-hover)" }} cornerRadius={6} />
                <Tooltip
                  content={<CustomTooltip prefix="₹" />}
                  formatter={(v) => [`₹${v.toLocaleString()}`, "Revenue"]}
                />
                <Legend
                  iconType="circle" iconSize={8}
                  wrapperStyle={{ fontSize: "12px", color: "var(--text-muted)" }}
                />
              </RadialBarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
};

export default AnalyticsPage;
