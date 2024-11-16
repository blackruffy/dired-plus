class Next<A> {
  constructor(public readonly value: A) {}
}

class Done<A> {
  constructor(public readonly value: A) {}
}

export const next = <A>(a: A): Next<A> => new Next(a);

export const done = <A>(a: A): Done<A> => new Done(a);

export const isDone = <A>(a: Next<A> | Done<A>): boolean => a instanceof Done;

export const async = async <A>(
  f: (acc: A) => Promise<Next<A> | Done<A>>,
  acc: Promise<A>,
): Promise<A> => {
  let unsafe_status = true;
  let unsafe_acc = acc;
  while (unsafe_status) {
    const r = await f(await unsafe_acc);
    unsafe_acc = Promise.resolve(r.value);
    if (isDone(r)) {
      unsafe_status = false;
    }
  }
  return unsafe_acc;
};
