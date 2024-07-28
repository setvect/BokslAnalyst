import { InitializedRepository } from './InitializedRepository';

export default function createInitializedProxy<T extends InitializedRepository>(target: T): T {
  return new Proxy(target, {
    get(target, prop, receiver) {
      const value = Reflect.get(target, prop, receiver);
      if (typeof value === 'function' && prop !== 'initDb') {
        return async (...args: any[]) => {
          await target.initPromise;
          return value.apply(target, args);
        };
      }
      return value;
    },
  });
}
