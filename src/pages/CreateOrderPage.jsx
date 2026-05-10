/**
 * pages/CreateOrderPage.jsx — Theme-aware order creation form.
 */

import { useState } from "react";
import toast from "react-hot-toast";
import { createOrder } from "../services/orderService";
import Spinner from "../components/Spinner";

const STORE_OPTIONS = ["STORE_A", "STORE_B", "STORE_C", "STORE_D", "STORE_E"];
const defaultItem = () => ({ item_id: "", qty: 1 });

const CreateOrderPage = () => {
  const [storeId,     setStoreId]     = useState("");
  const [items,       setItems]       = useState([defaultItem()]);
  const [totalAmount, setTotalAmount] = useState("");
  const [loading,     setLoading]     = useState(false);
  const [errors,      setErrors]      = useState({});

  const addItem    = () => setItems((prev) => [...prev, defaultItem()]);
  const removeItem = (idx) => setItems((prev) => prev.filter((_, i) => i !== idx));
  const updateItem = (idx, field, value) =>
    setItems((prev) => prev.map((it, i) => (i === idx ? { ...it, [field]: value } : it)));

  const validate = () => {
    const errs = {};
    if (!storeId) errs.storeId = "Please select a store.";
    if (!totalAmount || Number(totalAmount) < 0) errs.totalAmount = "Enter a valid total (≥ 0).";
    items.forEach((it, i) => {
      if (!it.item_id.trim())    errs[`item_id_${i}`]  = "Item ID is required.";
      if (!it.qty || it.qty < 1) errs[`item_qty_${i}`] = "Qty must be ≥ 1.";
    });
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    try {
      await createOrder({
        store_id:     storeId,
        items:        items.map((it) => ({ item_id: it.item_id.trim(), qty: Number(it.qty) })),
        total_amount: Number(totalAmount),
      });
      toast.success("Order created successfully! 🎉");
      setStoreId("");
      setItems([defaultItem()]);
      setTotalAmount("");
    } catch (err) {
      toast.error(err.message || "Failed to create order.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-page-primary mb-1">Create Order</h1>
        <p className="text-page-muted">Fill in the details to place a new order.</p>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <div className="card p-6 space-y-6">

          {/* Store ID */}
          <div>
            <label htmlFor="store-select" className="label">Store *</label>
            <select
              id="store-select"
              value={storeId}
              onChange={(e) => setStoreId(e.target.value)}
              className="input"
            >
              <option value="">— Select a store —</option>
              {STORE_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            {errors.storeId && <p className="text-red-500 text-xs mt-1">{errors.storeId}</p>}
          </div>

          {/* Items */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="label mb-0">Items *</label>
              <button type="button" onClick={addItem} id="add-item-btn" className="btn-secondary btn-sm">
                + Add Item
              </button>
            </div>
            <div className="space-y-3">
              {items.map((item, idx) => (
                <div key={idx} className="flex gap-3 items-start">
                  <div className="flex-1">
                    <input
                      type="text"
                      id={`item-id-${idx}`}
                      placeholder="Item ID (e.g. BURGER_01)"
                      value={item.item_id}
                      onChange={(e) => updateItem(idx, "item_id", e.target.value)}
                      className="input"
                    />
                    {errors[`item_id_${idx}`] && (
                      <p className="text-red-500 text-xs mt-1">{errors[`item_id_${idx}`]}</p>
                    )}
                  </div>
                  <div className="w-24">
                    <input
                      type="number"
                      id={`item-qty-${idx}`}
                      placeholder="Qty"
                      min={1}
                      value={item.qty}
                      onChange={(e) => updateItem(idx, "qty", e.target.value)}
                      className="input"
                    />
                    {errors[`item_qty_${idx}`] && (
                      <p className="text-red-500 text-xs mt-1">{errors[`item_qty_${idx}`]}</p>
                    )}
                  </div>
                  {items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeItem(idx)}
                      id={`remove-item-${idx}`}
                      className="btn btn-danger btn-sm mt-0.5"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Total Amount */}
          <div>
            <label htmlFor="total-amount" className="label">Total Amount (₹) *</label>
            <input
              type="number"
              id="total-amount"
              placeholder="e.g. 499.99"
              min={0}
              step="0.01"
              value={totalAmount}
              onChange={(e) => setTotalAmount(e.target.value)}
              className="input"
            />
            {errors.totalAmount && (
              <p className="text-red-500 text-xs mt-1">{errors.totalAmount}</p>
            )}
          </div>

          <button type="submit" id="submit-order-btn" disabled={loading} className="btn-primary w-full py-3">
            {loading ? <><Spinner size="sm" /> Placing Order…</> : "Place Order"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateOrderPage;
