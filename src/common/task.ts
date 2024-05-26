import { Task } from 'fp-ts/lib/Task';

export * from 'fp-ts/lib/Task';

export const fromPromise = <A>(p: () => Promise<A>): Task<A> => p;

export const error =
  <A>(err: Error): Task<A> =>
  () =>
    Promise.reject(err);

export const run = <A>(self: Task<A>): void => {
  self();
};
