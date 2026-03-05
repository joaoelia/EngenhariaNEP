// Configuração centralizada da API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export const API_CONFIG = {
  BASE_URL: API_BASE_URL,
  ENDPOINTS: {
    AUTH: {
      LOGIN: "/auth/login",
      REGISTER: "/auth/register",
    },
    FILES: {
      DOWNLOAD: (filename: string) => `/files/download/${filename}`,
      VIEW: (filename: string) => `/files/view/${filename}`,
    },
    ORDENS: {
      LIST: "/ordens",
      CREATE: "/ordens",
      DELETE: (id: string) => `/ordens/${id}`,
      UPDATE_STATUS: (id: string, status: string) =>
        `/ordens/${id}/status?status=${encodeURIComponent(status)}`,
    },
    MATERIAS_PRIMAS: {
      LIST: "/materia-prima",
      CREATE: "/materia-prima",
      UPDATE: (id: string) => `/materia-prima/${id}`,
      DELETE: (id: string) => `/materia-prima/${id}`,
    },
    PECAS: {
      LIST: "/pecas",
      CREATE: "/pecas",
      UPDATE_STATUS: (id: string, status: string) =>
        `/pecas/${id}/status?status=${encodeURIComponent(status)}`,
      DELETE: (id: string) => `/pecas/${id}`,
    },
    CONSUMIVEIS: {
      LIST: "/consumiveis",
      CREATE: "/consumiveis",
    },
    RETIRADAS: {
      CREATE: "/retiradas",
      LIST: "/retiradas/tipo",
    },
  },
} as const;

/**
 * Constrói URL completa com base URL da API
 */
export const buildApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

/**
 * Obtém token JWT de forma segura
 */
export const getAuthToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("jwt_token");
  }
  return null;
};

/**
 * Remove token JWT de forma segura
 */
export const removeAuthToken = (): void => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("jwt_token");
  }
};

/**
 * Configuração padrão para fetch com autenticação
 */
export const getAuthHeaders = (): HeadersInit => {
  const token = getAuthToken();
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};
