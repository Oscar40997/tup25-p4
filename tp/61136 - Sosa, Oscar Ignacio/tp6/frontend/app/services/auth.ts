import { UsuarioResponse } from '@/app/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface CredencialesLogin {
  email: string;
  contraseña: string;
}

export interface DatosRegistro {
  nombre: string;
  email: string;
  contraseña: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
  usuario: UsuarioResponse;
}

export async function registroUsuario(datos: DatosRegistro): Promise<TokenResponse> {
  const response = await fetch(`${API_URL}/auth/registro`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Error en el registro');
  }

  return response.json();
}

export async function loginUsuario(credenciales: CredencialesLogin): Promise<TokenResponse> {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credenciales),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Error en el login');
  }

  return response.json();
}

export async function obtenerPerfil(token: string): Promise<UsuarioResponse> {
  const response = await fetch(`${API_URL}/auth/perfil`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Error al obtener perfil');
  }

  return response.json();
}

export function guardarToken(token: string) {
  localStorage.setItem('token', token);
}

export function obtenerToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
}

export function limpiarToken() {
  localStorage.removeItem('token');
}
