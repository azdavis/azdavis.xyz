export function absurd<T>(x: never): T {
  throw new Error(`absurd(${x})`);
}
