/**
 * components/StatusBadge.jsx
 * Colour-coded badge — works in both light and dark modes.
 */

const STATUS_CONFIG = {
  PLACED: {
    wrap: "bg-sky-100 text-sky-700 border-sky-200 dark:bg-sky-500/15 dark:text-sky-400 dark:border-sky-500/30",
    dot:  "bg-sky-500 dark:bg-sky-400",
    pulse: false,
  },
  PREPARING: {
    wrap: "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-500/15 dark:text-amber-400 dark:border-amber-500/30",
    dot:  "bg-amber-500 dark:bg-amber-400",
    pulse: true,
  },
  COMPLETED: {
    wrap: "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-400 dark:border-emerald-500/30",
    dot:  "bg-emerald-500 dark:bg-emerald-400",
    pulse: false,
  },
};

const StatusBadge = ({ status }) => {
  const cfg = STATUS_CONFIG[status] || {
    wrap: "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-700 dark:text-slate-400",
    dot:  "bg-slate-400",
    pulse: false,
  };

  return (
    <span className={`badge gap-1.5 border ${cfg.wrap}`}>
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${cfg.dot} ${cfg.pulse ? "animate-pulse" : ""}`} />
      {status}
    </span>
  );
};

export default StatusBadge;
