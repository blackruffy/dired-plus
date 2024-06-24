const normalizeIndex = (index: number, len: number): number => {
  const a = index % len;
  return a < 0 ? len + a : a;
};

const insertItem = <A>(
  xs: readonly A[],
  item: A,
  index: number,
  maxSize: number,
): [readonly A[], number] => {
  const len = xs.length;
  const diff = len + 1 - maxSize;
  const idx = normalizeIndex(index, len);
  if (len === 0) {
    return [[item], 0];
  } else if (item === xs[idx]) {
    return [xs, idx];
  } else {
    const [start, end] =
      diff > 0
        ? idx > len / 2
          ? [diff, len - 1]
          : [0, len - 1 - diff]
        : [0, len - 1];
    const { ys, j } = xs.reduce(
      ({ ys, j }, x, i) => {
        if (i >= start && i <= end) {
          if (i === idx) {
            ys.push(item, x);
            return { ys, j: ys.length - 1 };
          } else {
            ys.push(x);
            return { ys, j };
          }
        } else {
          return { ys, j };
        }
      },
      { ys: [] as A[], j: idx },
    );
    return [ys, j];
  }
};

console.log(normalizeIndex(0, 5));
console.log(normalizeIndex(-1, 5));
console.log(normalizeIndex(-2, 5));

console.log(insertItem([], 10, 0, 100), [10]);
console.log(insertItem([1], 10, 0, 100), [10, 1]);
console.log(insertItem([1], 10, 0, 1), [10]);
console.log(insertItem([1, 2], 10, 0, 2), [10, 2]);
console.log(insertItem([1, 2], 10, 1, 2), [1, 10]);
console.log(insertItem([1, 2, 3, 4, 5], 10, 2, 100));
console.log(insertItem([1, 2, 3, 4, 5], 10, 5, 100));
console.log(insertItem([1, 2, 3, 4, 5], 10, -1, 100));
console.log(insertItem([1, 2, 3, 4, 5], 10, 3, 5));
console.log(insertItem([1, 2, 3, 4, 5], 10, 1, 5));
