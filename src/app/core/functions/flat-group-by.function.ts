export function flatGroupBy<T, K>(list: Array<T>, getKey: (item: T) => K): Map<K, T> {
  const map = new Map<K, T>();
  list.forEach((item) => {
    const key = getKey(item);
    map.set(key, item);
  });

  return map;
}
