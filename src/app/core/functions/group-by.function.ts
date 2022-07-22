export function groupBy<T, K>(list: Array<T>, getKey: (item: T) => K): Map<K, Array<T>> {
  const map = new Map<K, Array<T>>();
  list.forEach((item) => {
    const key = getKey(item);
    const collection = map.get(key);
    if (!collection) {
      map.set(key, [item]);
    } else {
      collection.push(item);
    }
  });

  return map;
}
