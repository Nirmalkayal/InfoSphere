import React, { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';

// Socket event types
export interface SlotUpdateEvent {
  slotId: string;
  status: string;
  platform?: string;
  customerName?: string;
}

export interface LockEvent {
  lockId: string;
  slotId: string;
  action: 'acquired' | 'released' | 'expired';
  platform: string;
}

export interface BookingEvent {
  bookingId: string;
  slotId: string;
  platform: string;
  customerName: string;
}

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  // Subscribe to events
  onSlotUpdate: (callback: (data: SlotUpdateEvent) => void) => () => void;
  onLockEvent: (callback: (data: LockEvent) => void) => () => void;
  onBookingEvent: (callback: (data: BookingEvent) => void) => () => void;
  // Join/leave rooms for specific turfs
  joinTurfRoom: (turfId: string) => void;
  leaveTurfRoom: (turfId: string) => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

interface SocketProviderProps {
  children: ReactNode;
}

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const { user, isAuthenticated } = useAuth();

  // Initialize socket connection when authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
        setIsConnected(false);
      }
      return;
    }

    const token = localStorage.getItem('turfhub_token');
    
    const newSocket = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    newSocket.on('connect', () => {
      console.log('Socket connected');
      setIsConnected(true);
      
      // Auto-join turf room if user has turfId
      if (user?.turfId) {
        newSocket.emit('join:turf', user.turfId);
      }
    });

    newSocket.on('disconnect', () => {
      console.log('Socket disconnected');
      setIsConnected(false);
    });

    newSocket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      setIsConnected(false);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [isAuthenticated, user?.turfId]);

  // Event subscription handlers
  const onSlotUpdate = useCallback((callback: (data: SlotUpdateEvent) => void) => {
    if (!socket) return () => {};
    
    socket.on('slot:update', callback);
    return () => {
      socket.off('slot:update', callback);
    };
  }, [socket]);

  const onLockEvent = useCallback((callback: (data: LockEvent) => void) => {
    if (!socket) return () => {};
    
    socket.on('lock:event', callback);
    return () => {
      socket.off('lock:event', callback);
    };
  }, [socket]);

  const onBookingEvent = useCallback((callback: (data: BookingEvent) => void) => {
    if (!socket) return () => {};
    
    socket.on('booking:event', callback);
    return () => {
      socket.off('booking:event', callback);
    };
  }, [socket]);

  // Room management
  const joinTurfRoom = useCallback((turfId: string) => {
    if (socket && isConnected) {
      socket.emit('join:turf', turfId);
    }
  }, [socket, isConnected]);

  const leaveTurfRoom = useCallback((turfId: string) => {
    if (socket && isConnected) {
      socket.emit('leave:turf', turfId);
    }
  }, [socket, isConnected]);

  const value: SocketContextType = {
    socket,
    isConnected,
    onSlotUpdate,
    onLockEvent,
    onBookingEvent,
    joinTurfRoom,
    leaveTurfRoom,
  };

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
};

export default SocketContext;
