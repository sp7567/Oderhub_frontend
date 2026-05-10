/**
 * components/StatCard.jsx
 * KPI stat card — uses lucide-react icons.
 */

const COLOR_CONFIG = {
  brand: {
    light: "bg-indigo-50 border-indigo-200",
    dark:  "dark:bg-brand-600/10 dark:border-brand-700/30",
    icon:  "text-indigo-600 dark:text-brand-400",
    value: "text-indigo-700 dark:text-white",
    label: "text-indigo-500 dark:text-brand-300",
  },
  purple: {
    light: "bg-purple-50 border-purple-200",
    dark:  "dark:bg-purple-600/10 dark:border-purple-700/30",
    icon:  "text-purple-600 dark:text-purple-400",
    value: "text-purple-700 dark:text-white",
    label: "text-purple-500 dark:text-purple-300",
  },
  blue: {
    light: "bg-sky-50 border-sky-200",
    dark:  "dark:bg-sky-600/10 dark:border-sky-700/30",
    icon:  "text-sky-600 dark:text-sky-400",
    value: "text-sky-700 dark:text-white",
    label: "text-sky-500 dark:text-sky-300",
  },
  amber: {
    light: "bg-amber-50 border-amber-200",
    dark:  "dark:bg-amber-600/10 dark:border-amber-700/30",
    icon:  "text-amber-600 dark:text-amber-400",
    value: "text-amber-700 dark:text-white",
    label: "text-amber-500 dark:text-amber-300",
  },
  emerald: {
    light: "bg-emerald-50 border-emerald-200",
    dark:  "dark:bg-emerald-600/10 dark:border-emerald-700/30",
    icon:  "text-emerald-600 dark:text-emerald-400",
    value: "text-emerald-700 dark:text-white",
    label: "text-emerald-500 dark:text-emerald-300",
  },
};

const StatCard = ({ label, value, icon: Icon, color = "brand" }) => {
  const c = COLOR_CONFIG[color] || COLOR_CONFIG.brand;

  return (
    <div
      className={`
        rounded-2xl border p-5 transition-all duration-200
        hover:shadow-md hover:-translate-y-0.5
        animate-fade-in
        ${c.light} ${c.dark}
      `}
    >
      <div className={`mb-3 ${c.icon}`}>
        {typeof Icon === "string" ? <span className="text-2xl">{Icon}</span> : <Icon size={24} />}
      </div>
      <div className={`text-2xl font-bold mb-0.5 ${c.value}`}>{value}</div>
      <div className={`text-xs font-medium ${c.label}`}>{label}</div>
    </div>
  );
};

export default StatCard;
