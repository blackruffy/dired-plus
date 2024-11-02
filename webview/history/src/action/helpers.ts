import { task } from '@common/task';
import { openFile } from '@core/native/api';
import { Item, State } from '@history/store';
import { Task } from 'fp-ts/lib/Task';
import { pipe } from 'fp-ts/lib/function';

export const openItem = (item: Item): Task<Partial<State>> =>
  pipe(
    task.fromPromise(() => openFile(item)),
    task.map(() => ({})),
  );
