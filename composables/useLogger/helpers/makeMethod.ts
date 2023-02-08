import { LogName } from '../types';
import { makeMessageStyle } from './makeMessageStyle';

export function makeMethod(logEnum: LogName, fn: (...data: any[]) => void) {
  return () => {
    return Function.prototype.bind.apply(fn, [
      console,
      ...makeMessageStyle(logEnum)
    ]);
  };
}
