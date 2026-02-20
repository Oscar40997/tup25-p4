'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Carrito, CarritoItem, obtenerCarrito } from '../services/carrito';

interface CarritoContextType {
  carrito: Carrito;
  loading: boolean;
  refrescar: () => Promise<void>;
  agregarItem: (item: CarritoItem) => Promise<void>;
}

const CarritoContext = createContext<CarritoContextType | undefined>(undefined);

export function CarritoProvider({ children }: { children: ReactNode }) {
  const [carrito, setCarrito] = useState<Carrito>({ items: [], total: 0 });
  const [loading, setLoading] = useState(true);

  const refrescar = async () => {
    try {
      const nuevoCarrito = await obtenerCarrito();
      setCarrito(nuevoCarrito);
    } catch (error) {
      console.error('Error al refrescar carrito:', error);
    }
  };

  const agregarItem = async (item: CarritoItem) => {
    try {
      await refrescar();
    } catch (error) {
      console.error('Error al agregar item:', error);
    }
  };

  useEffect(() => {
    refrescar().finally(() => setLoading(false));
  }, []);

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
