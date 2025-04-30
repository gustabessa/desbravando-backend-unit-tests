export function sumEvenNumbers(arg1: number, arg2: number): number | null {
  if (arg1 % 2 !== 0 || arg2 % 2 !== 0) {
    return null;
  }
  return arg1 + arg2;
}
