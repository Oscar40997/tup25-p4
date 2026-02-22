'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Carrito, CarritoItem, obtenerCarrito } from '../services/carrito';
import { useAuth } from './AuthContext';

interface CarritoContextType {
  carrito: Carrito;
  loading: boolean;
  refrescar: (token: string) => Promise<void>;
  agregarItem: (item: CarritoItem, token: string) => Promise<void>;
}

const CarritoContext = createContext<CarritoContextType | undefined>(undefined);

export function CarritoProvider({ children }: { children: ReactNode }) {
  const [carrito, setCarrito] = useState<Carrito>({ items: [], total: 0 });
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  const refrescar = async (authToken: string) => {
    try {
      const nuevoCarrito = await obtenerCarrito(authToken);
      setCarrito(nuevoCarrito);
    } catch (error) {
      console.error('Error al refrescar carrito:', error);
      setCarrito({ items: [], total: 0 });
    }
  };

  const agregarItem = async (item: CarritoItem, authToken: string) => {
    try {
      await refrescar(authToken);
    } catch (error) {
      console.error('Error al agregar item:', error);
    }
  };

  useEffect(() => {
    if (token) {
      refrescar(token).finally(() => setLoading(false));
    } else {
      setCarrito({ items: [], total: 0 });
      setLoading(false);
    }
  }, [token]);

  return (
    <CarritoContext.Provider value={{ carrito, loading, refrescar, agregarItem }}>
      {children}
    </CarritoContext.Provider>
  );
}

export function useCarrito() {
  const context = useContext(CarritoContext);
  if (!context) {
    throw new Error('useCarrito debe ser usado dentro de CarritoProvider');
  }
  return context;
}
