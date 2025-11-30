/**
 * Decodifica o payload de um JWT no browser, sem depender de Buffer (Node).
 */
export const decodeJwt = (token: string): any => {
  const parts = token.split('.');
  if (parts.length < 2) {
    throw new Error('Token JWT inválido');
  }

  const base64Url = parts[1];
  // Ajusta Base64 URL-safe para Base64 padrão
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');

  const json = atob(padded);
  return JSON.parse(json);
};
