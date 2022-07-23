export function flatGroupBy<T, K>(list: Array<T>, getKey: (item: T) => K): Map<K, T> {
  const map = new Map<K, T>();
  for (const item of list) {
    const key = getKey(item);
    map.set(key, item);
  }

  return map;
}
