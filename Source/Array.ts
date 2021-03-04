type ConcatItem<T> = T | T[];

export function concatItems<T>(...values: ConcatItem<T>[]) {
  return ([] as T[]).concat(...values);
}

export function times<T>(count: number, fillCall: (index: number) => T): T[] {
  let items: T[] = [];
  for (let i = 0; i < count; i++) {
    items[i] = fillCall(i);
  }
  return items;
}
