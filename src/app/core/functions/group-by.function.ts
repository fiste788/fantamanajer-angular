export function groupBy<T, K>(list: Array<T>, getKey: (item: T) => K): Map<K, Array<T>> {
  const map = new Map<K, Array<T>>();
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
