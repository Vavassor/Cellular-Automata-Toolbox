type ConcatItem<T> = T | T[];
type ConcatTruthyItem<T> = ConcatItem<T> | null | undefined;

export function add<T>(array: T[], value: T, index: number): T[] {
  return array.slice(0, index).concat(value, array.slice(index));
}

export function concatItems<T>(...values: ConcatItem<T>[]) {
  return ([] as T[]).concat(...values);
}

export function concatTruthyItems<T>(...values: ConcatTruthyItem<T>[]) {
  const truthyValues = values.filter(
    (value): value is ConcatItem<T> => !!value
  );
  return concatItems(...truthyValues);
}

export function remove<T>(array: T[], index: number): T[] {
  return array.slice(0, index).concat(array.slice(index + 1));
}

export function times<T>(count: number, fillCall: (index: number) => T): T[] {
  let items: T[] = [];
  for (let i = 0; i < count; i++) {
    items[i] = fillCall(i);
  }
  return items;
}

export function unique<T>(array: T[]) {
  return [...new Set(array)];
}
