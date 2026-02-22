'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { UsuarioResponse } from '@/app/types';
import { obtenerToken, guardarToken, limpiarToken, obtenerPerfil } from '../services/auth';

interface AuthContextType {
  usuario: UsuarioResponse | null;
  token: string | null;
  loading: boolean;
  login: (token: string, usuario: UsuarioResponse) => void;
  logout: () => void;
  actualizarPerfil: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<UsuarioResponse | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const login = (newToken: string, usuarioData: UsuarioResponse) => {
    guardarToken(newToken);
    setToken(newToken);
    setUsuario(usuarioData);
  };

  const logout = () => {
    limpiarToken();
    setToken(null);
    setUsuario(null);
  };

  const actualizarPerfil = async () => {
    const currentToken = obtenerToken();
    if (currentToken) {
      try {
        const perfil = await obtenerPerfil(currentToken);
        setUsuario(perfil);
      } catch (error) {
        console.error('Error al actualizar perfil:', error);
        logout();
      }
    }
  };

  // Cargar token al iniciar
  useEffect(() => {
    const tokenGuardado = obtenerToken();
    if (tokenGuardado) {
      setToken(tokenGuardado);
      obtenerPerfil(tokenGuardado)
        .then(perfil => setUsuario(perfil))
        .catch(() => logout())
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ usuario, token, loading, login, logout, actualizarPerfil }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
}
