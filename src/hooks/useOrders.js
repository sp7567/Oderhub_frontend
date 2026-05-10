/**
 * hooks/useOrders.js — Custom hook for paginated order fetching.
 * Encapsulates loading / error / pagination state so pages stay clean.
 */

import { useState, useEffect, useCallback } from "react";
import { fetchOrders } from "../services/orderService";

const useOrders = (initialParams = {}) => {
  const [orders, setOrders]   = useState([]);
  const [meta, setMeta]       = useState({ total: 0, page: 1, totalPages: 1, limit: 10 });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);
  const [params, setParams]   = useState({ page: 1, limit: 10, ...initialParams });

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchOrders(params);
      setOrders(res.data || []);
      setMeta(res.meta || { total: 0, page: 1, totalPages: 1, limit: 10 });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    load();
  }, [load]);

  /**
   * Update query params (e.g., new page, search term, store filter).
   * Merges with existing params.
   */
  const updateParams = useCallback((newParams) => {
    setParams((prev) => ({ ...prev, ...newParams }));
  }, []);

  return { orders, meta, loading, error, params, updateParams, refetch: load };
};

export default useOrders;
