import BaseRepository from './BaseRepository';

export default function createInitializedProxy<T extends BaseRepository<any>>(target: T): T {
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
