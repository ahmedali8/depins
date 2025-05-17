export function arrayToObject<T, V>(
  array: T[],
  getKey: (item: T) => string,
  helper: (item: T) => V,
): Record<string, V> {
  return array.reduce(
    (obj, item) => {
      obj[getKey(item)] = helper(item);
      return obj;
    },
    {} as Record<string, V>,
  );
}
