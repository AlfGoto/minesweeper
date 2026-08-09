export async function chunkPromiseAll<T, R>(
  items: T[],
  fn: (item: T) => Promise<R>,
  chunkSize = 10
): Promise<R[]> {
  const results: R[] = []

  for (let i = 0; i < items.length; i += chunkSize) {
    const chunk = items.slice(i, i + chunkSize)
    const chunkResults = await Promise.all(chunk.map(fn))
    results.push(...chunkResults)
  }

  return results
}
