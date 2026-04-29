"use client";

import { useRouter } from "next/navigation";

/**
 * Hook que retorna uma função para redirecionar para login com URL de retorno
 * @returns Função que redireciona para login
 */
export function useAuthRedirect() {
  const router = useRouter();

  /**
   * Redireciona para login com URL de retorno
   * @param currentPath - Path para onde voltar após login bem-sucedido
   */
  const redirectToLoginWithReturn = (currentPath: string) => {
    const returnUrl = encodeURIComponent(currentPath);
    router.push(`/login?return=${returnUrl}`);
  };

  return redirectToLoginWithReturn;
}

/**
 * Lê o parâmetro ?return da query string
 * @returns Path para onde redirecionar após login, ou null
 */
export function getReturnUrl(): string | null {
  if (typeof window === "undefined") return null;
  
  const params = new URLSearchParams(window.location.search);
  const returnUrl = params.get("return");
  
  if (returnUrl) {
    return decodeURIComponent(returnUrl);
  }
  
  return null;
}

