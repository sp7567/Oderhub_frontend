/**
 * components/EmptyState.jsx — Placeholder shown when a list has no data.
 */

const EmptyState = ({ icon = "📭", title = "No data found", description = "" }) => (
  <tr>
    <td colSpan={100}>
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="text-5xl mb-4">{icon}</div>
        <h3 className="text-slate-300 font-semibold text-lg mb-1">{title}</h3>
        {description && <p className="text-slate-500 text-sm max-w-xs">{description}</p>}
      </div>
    </td>
  </tr>
);

export default EmptyState;
