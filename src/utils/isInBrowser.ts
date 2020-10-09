export function isInBrowser() {
  return typeof window === 'object' && typeof document === 'object'
}
