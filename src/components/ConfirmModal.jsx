/**
 * components/ConfirmModal.jsx
 * A styled confirmation dialog that replaces window.confirm().
 * Uses a backdrop overlay + centered card with cancel/confirm buttons.
 */

import { AlertTriangle, X } from "lucide-react";

const ConfirmModal = ({
  open,
  title = "Are you sure?",
  message = "This action cannot be undone.",
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
  loading = false,
  variant = "danger", // "danger" | "warning"
}) => {
  if (!open) return null;

  const btnColors =
    variant === "danger"
      ? "bg-red-600 hover:bg-red-500 focus:ring-red-500 text-white"
      : "bg-amber-500 hover:bg-amber-400 focus:ring-amber-500 text-white";

  const iconBg =
    variant === "danger"
      ? "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
      : "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400";

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm animate-fade-in"
        onClick={onCancel}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="relative w-full max-w-md rounded-2xl p-6 animate-slide-up"
          style={{
            backgroundColor: "var(--bg-surface)",
            border: "1px solid var(--border)",
            boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={onCancel}
            className="absolute top-4 right-4 p-1 rounded-lg transition-colors hover:bg-[var(--bg-hover)]"
            style={{ color: "var(--text-muted)" }}
            aria-label="Close"
          >
            <X size={18} />
          </button>

          {/* Icon */}
          <div className="flex justify-center mb-4">
            <div className={`w-14 h-14 rounded-full flex items-center justify-center ${iconBg}`}>
              <AlertTriangle size={28} />
            </div>
          </div>

          {/* Text */}
          <h3
            className="text-lg font-bold text-center mb-2"
            style={{ color: "var(--text-primary)" }}
          >
            {title}
          </h3>
          <p
            className="text-sm text-center mb-6 leading-relaxed"
            style={{ color: "var(--text-secondary)" }}
          >
            {message}
          </p>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              disabled={loading}
              className="btn-secondary flex-1 py-2.5"
            >
              {cancelLabel}
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className={`btn flex-1 py-2.5 ${btnColors} disabled:opacity-50`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Deleting…
                </span>
              ) : (
                confirmLabel
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ConfirmModal;
