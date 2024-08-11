type KeyMap<T extends keyof any, V> = {
  [Key in T]: V;
};
