/**
 * services/orderService.js — All order-related API calls.
 * Wraps axiosClient calls so pages never import axios directly.
 */

import axiosClient from "../api/axiosClient";

/**
 * Create a new order.
 * @param {{ store_id: string, items: {item_id:string, qty:number}[], total_amount: number }} payload
 */
export const createOrder = async (payload) => {
  const { data } = await axiosClient.post("/orders", payload);
  return data; // { success, message, data: order }
};

/**
 * Fetch orders with optional filters and pagination.
 * @param {{ store_id?: string, page?: number, limit?: number, search?: string }} params
 */
export const fetchOrders = async (params = {}) => {
  const { data } = await axiosClient.get("/orders", { params });
  return data; // { success, data: orders[], meta: { total, page, limit, totalPages } }
};

/**
 * Fetch a single order by ID.
 * @param {string} id
 */
export const fetchOrderById = async (id) => {
  const { data } = await axiosClient.get(`/orders/${id}`);
  return data;
};

/**
 * Fetch dashboard KPI stats from the aggregation endpoint.
 * Returns { total, placed, preparing, completed, stores, revenue, recentOrders }.
 */
export const fetchStats = async (params = {}) => {
  const { data } = await axiosClient.get("/orders/stats", { params });
  return data; // { success, data: { total, placed, ... } }
};

/**
 * Update order status.
 * @param {string} id     — MongoDB Order _id
 * @param {string} status — "PLACED" | "PREPARING" | "COMPLETED"
 */
export const updateOrderStatus = async (id, status) => {
  const { data } = await axiosClient.patch(`/orders/${id}/status`, { status });
  return data;
};

/**
 * Permanently delete an order.
 * @param {string} id — MongoDB Order _id
 */
export const deleteOrder = async (id) => {
  const { data } = await axiosClient.delete(`/orders/${id}`);
  return data;
};

/**
 * Trigger archival of orders older than 30 days.
 */
export const archiveOrders = async () => {
  const { data } = await axiosClient.post("/orders/archive");
  return data;
};

/**
 * Fetch advanced analytics (per-day, per-store, top items).
 */
export const fetchAnalytics = async () => {
  const { data } = await axiosClient.get("/orders/analytics");
  return data;
};
