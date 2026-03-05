/**
 * Sistema de logging seguro que não expõe dados sensíveis
 * Em produção, apenas log errors críticos sem detalhes
 */

const isDevelopment = process.env.NODE_ENV === "development";

export const logger = {
  /**
   * Log de erro seguro - não expõe stack trace completo
   */
  error: (context: string, error: unknown): void => {
    if (!isDevelopment) {
      // Em produção, apenas registra o contexto
      console.error(`[${context}] An error occurred`);
      return;
    }

    // Em desenvolvimento, mostra mais detalhes
    if (error instanceof Error) {
      console.error(`[${context}]`, error.message);
    } else {
      console.error(`[${context}]`, error);
    }
  },

  /**
   * Log de aviso seguro
   */
  warn: (context: string, message: string): void => {
    if (isDevelopment) {
      console.warn(`[${context}] ${message}`);
    }
  },

  /**
   * Log de informação (apenas em desenvolvimento)
   */
  info: (context: string, message: string): void => {
    if (isDevelopment) {
      console.info(`[${context}] ${message}`);
    }
  },
};

/**
 * Função segura para verificação de autenticação
 */
export const requireAuth = (token: string | null): boolean => {
  if (!token) {
    logger.warn("Auth", "Token not found");
    return false;
  }
  return true;
};
