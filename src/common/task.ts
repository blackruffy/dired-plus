import { Task } from 'fp-ts/lib/Task';
import * as task_ from 'fp-ts/lib/Task';

export const fromPromise = <A>(p: () => Promise<A>): Task<A> => p;

export const error =
  <A>(err: Error): Task<A> =>
  () =>
    Promise.reject(err);

export const run = <A>(self: Task<A>): void => {
  self();
};

export const task = {
  ...task_,
  fromPromise,
  error,
  run,
};
