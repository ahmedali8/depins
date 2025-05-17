export function convertToUnixTimestamp(timestamp?: number): number {
  timestamp = timestamp || Date.now();

  // Check if timestamp is in milliseconds (13 digits)
  if (timestamp.toString().length === 13) {
    return Math.floor(timestamp / 1000); // Convert to seconds
  }

  // If it's already in UNIX format (10 digits), return as is
  return timestamp;
}
export function daysOldTimestamp(days = 1) {
  const dayAgo = new Date();
  dayAgo.setDate(dayAgo.getDate() - days);

  return convertToUnixTimestamp(dayAgo.getTime());
}
