/**
 * src/context/SocketContext.jsx
 * Manages Socket.IO connection and global event listeners (like toasts).
 */

import { createContext, useContext, useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import toast from "react-hot-toast";

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [activities, setActivities] = useState([]);
  
  // Audio notification reference
  const audioRef = useRef(new Audio("https://assets.mixkit.co/active_storage/sfx/2358/2358-preview.mp3"));

  const addActivity = (type, data) => {
    const newActivity = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      data,
      timestamp: new Date(),
      store_id: data.store_id
    };
    setActivities((prev) => [newActivity, ...prev].slice(0, 15)); // Keep last 15
  };

  useEffect(() => {
    // In production, this would be your server URL. 
    // In dev, Vite proxy handles "/socket.io" automatically if we use relative path
    const newSocket = io("/", {
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
    });

    newSocket.on("connect", () => {
      console.log("📡 Socket connected:", newSocket.id);
      setIsConnected(true);
    });

    newSocket.on("disconnect", () => {
      console.log("📡 Socket disconnected");
      setIsConnected(false);
    });

    // Global Listeners
    newSocket.on("order_created", (order) => {
      toast.success(`New Order! #${order.id?.slice(-6).toUpperCase()} from ${order.store_id}`, {
        icon: "🛍️",
      });
      addActivity("CREATED", order);
      // Play sound
      audioRef.current.play().catch(() => {}); 
    });

    newSocket.on("order_status_updated", (data) => {
      toast.info(`Order #${data.orderId?.slice(-6).toUpperCase()} is now ${data.status}`, {
        icon: "🔄",
      });
      addActivity("UPDATED", data);
    });

    setSocket(newSocket);

    return () => newSocket.close();
  }, []);

  return (
    <SocketContext.Provider value={{ socket, isConnected, activities }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};
