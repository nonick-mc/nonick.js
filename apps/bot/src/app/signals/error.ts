import { execute, Signal, Signals } from 'sunar';

export const signal = new Signal(Signals.Error);

execute(signal, (error) => {
  console.error(error);
});
