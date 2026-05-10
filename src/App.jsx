/**
 * App.jsx — Client-side routing with React.lazy() for code-splitting.
 * Best Practice: Each page loads only when navigated to, improving initial load time.
 */

import { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";

// ─── Lazy Loaded Pages ────────────────────────────────────────────────────────
// Each page is split into a separate JS chunk loaded on demand.
const DashboardPage   = lazy(() => import("./pages/DashboardPage"));
const OrdersListPage  = lazy(() => import("./pages/OrdersListPage"));
const CreateOrderPage = lazy(() => import("./pages/CreateOrderPage"));
const UpdateStatusPage = lazy(() => import("./pages/UpdateStatusPage"));
const AnalyticsPage   = lazy(() => import("./pages/AnalyticsPage"));

// ─── Page Loading Fallback ────────────────────────────────────────────────────
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[60vh] gap-4 flex-col">
    <div className="w-10 h-10 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin" />
    <p className="text-sm text-page-muted animate-pulse font-medium">Loading page...</p>
  </div>
);

const App = () => (
  <Routes>
    <Route element={<MainLayout />}>
      <Route
        path="/"
        element={<Suspense fallback={<PageLoader />}><DashboardPage /></Suspense>}
      />
      <Route
        path="/orders"
        element={<Suspense fallback={<PageLoader />}><OrdersListPage /></Suspense>}
      />
      <Route
        path="/orders/create"
        element={<Suspense fallback={<PageLoader />}><CreateOrderPage /></Suspense>}
      />
      <Route
        path="/orders/update"
        element={<Suspense fallback={<PageLoader />}><UpdateStatusPage /></Suspense>}
      />
      <Route
        path="/analytics"
        element={<Suspense fallback={<PageLoader />}><AnalyticsPage /></Suspense>}
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Route>
  </Routes>
);

export default App;
