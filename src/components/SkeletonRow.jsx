/**
 * components/SkeletonRow.jsx — Theme-aware skeleton loader for tables.
 */

const SkeletonCell = ({ w = "w-24" }) => (
  <div
    className={`h-3.5 ${w} rounded-full animate-pulse`}
    style={{ backgroundColor: "var(--border)" }}
  />
);

const SkeletonRow = ({ cols = 7 }) => (
  <tr style={{ borderTop: "1px solid var(--border)" }}>
    {Array.from({ length: cols }).map((_, i) => (
      <td key={i} className="px-4 py-3.5">
        <SkeletonCell w={i === 0 ? "w-28" : i === 2 ? "w-36" : i === 4 ? "w-20" : "w-20"} />
      </td>
    ))}
  </tr>
);

export const SkeletonTable = ({ rows = 5, cols = 7 }) => (
  <>
    {Array.from({ length: rows }).map((_, i) => (
      <SkeletonRow key={i} cols={cols} />
    ))}
  </>
);

export default SkeletonRow;
