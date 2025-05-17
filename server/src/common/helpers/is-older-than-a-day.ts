export function isOlderThanADay(date: Date): boolean {
  return Date.now() - new Date(date).getTime() > 86_400_000; // 86_400_000 = 24×60×60×1000 ms
}
