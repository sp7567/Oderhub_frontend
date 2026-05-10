/**
 * src/hooks/useSocket.js
 * Custom hook to interact with the socket context.
 * Provides easy room joining/leaving logic.
 */

import { useEffect } from "react";
import { useSocket as useSocketContext } from "../context/SocketContext";

const useSocket = (storeId) => {
  const { socket, isConnected } = useSocketContext();

  useEffect(() => {
    if (socket && isConnected) {
      const targetRoom = storeId || "global";
      // Join the store's room
      socket.emit("join_store", targetRoom);
      console.log(`📡 Joining store room: ${targetRoom}`);

      return () => {
        // Cleanup: Leave room on unmount or store change
        socket.emit("leave_store", targetRoom);
        console.log(`📡 Leaving store room: ${targetRoom}`);
      };
    }
  }, [socket, isConnected, storeId]);

  return { socket, isConnected };
};

export default useSocket;
