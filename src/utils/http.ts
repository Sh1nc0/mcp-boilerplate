import { logger } from '@utils/logger'

export async function apiFetch<T>(
  baseUrl: string,
  path: string,
  options?: RequestInit,
): Promise<T> {
  const res = await fetch(`${baseUrl}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options?.headers },
  })
  if (!res.ok) throw new Error(`HTTP ${res.status} on ${path}`)
  logger.info(`API call succeeded: ${path}`)
  return res.json() as Promise<T>
}