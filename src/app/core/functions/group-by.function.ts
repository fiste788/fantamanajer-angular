export function groupBy<T, K>(list: T[], getKey: (item: T) => K): Map<K, T[]> {
  const map = new Map<K, T[]>();
  for (const item of list) {
    const key = getKey(item);
    const collection = map.get(key);
    if (collection) {
      collection.push(item);
    } else {
      map.set(key, [item]);
    }
  }

  return map;
}
