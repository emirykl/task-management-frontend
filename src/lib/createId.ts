/**
 * Benzersiz kimlik üretir.
 * `crypto.randomUUID` desteklenmeyen tarayıcılar için zaman tabanlı bir yedeği vardır.
 */
export function createId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
}
