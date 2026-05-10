import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import App from "./App.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import { SocketProvider } from "./context/SocketContext.jsx";
import ErrorBoundary from "./components/ErrorBoundary.jsx";
import SplashScreen from "./components/SplashScreen.jsx";
import "./index.css";

// ─── Root with Splash ─────────────────────────────────────────────────────────
const Root = () => {
  // Always show splash on every fresh page load / direct URL open
  const [showSplash, setShowSplash] = React.useState(true);

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  return (
    <>
      {showSplash && <SplashScreen onComplete={handleSplashComplete} />}
      <ErrorBoundary>
        <ThemeProvider>
          <SocketProvider>
            <BrowserRouter>
              <App />
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  className: "!font-sans !text-sm",
                  style: {
                    background: "var(--bg-surface)",
                    color: "var(--text-primary)",
                    border: "1px solid var(--border-strong)",
                    borderRadius: "12px",
                    boxShadow: "var(--shadow-lg)",
                  },
                  success: { iconTheme: { primary: "#6366f1", secondary: "#fff" } },
                  error:   { iconTheme: { primary: "#ef4444", secondary: "#fff" } },
                }}
              />
            </BrowserRouter>
          </SocketProvider>
        </ThemeProvider>
      </ErrorBoundary>
    </>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);
