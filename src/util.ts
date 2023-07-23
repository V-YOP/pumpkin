
export function distinctBy<T, R>(mapper: (t: T) => R): (r: T) => boolean {
  const set = new Set<R>()
  return value => {
    const key = mapper(value)
    if (set.has(key)) return false
    set.add(key)
    return true
  }
}

export function groupBy<T, R extends string | number | symbol>(arr: T[], keyMapper: (t: T) => R): Record<R, T[]> {
  const res = {} as Record<R, T[]>
  arr.forEach(item => {
    const key = keyMapper(item)
    if (!res[key]) res[key] = []
    res[key].push(item)
  })
  return res
}