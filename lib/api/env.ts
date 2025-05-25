export function getApiUrl() {
  const apiUrl = process.env.API_URL;
  if (!apiUrl) {
    throw new Error("API_URL is not set");
  }
  return apiUrl;
}

export function getVerifierUrl() {
  const verifierUrl = process.env.NEXT_PUBLIC_VERIFIER_URL;
  if (!verifierUrl) {
    throw new Error("NEXT_PUBLIC_VERIFIER_URL is not set");
  }
  return verifierUrl;
}

export function enableMockPassport() {
  return process.env.ENABLE_MOCK_PASSPORT === "true";
}

export function getJwtSecret() {
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    throw new Error("JWT_SECRET is not set");
  }
  return jwtSecret;
}
