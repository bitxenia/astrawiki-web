const now = Date.now();
export function formatTime(timestamp: number): string {
  const diffMs = now - timestamp;
  const msPerHour = 60 * 60 * 1000;
  const msPerDay = 24 * msPerHour;

  if (diffMs < msPerHour) {
    return `${Math.max(1, Math.floor(diffMs / (60 * 1000)))}m ago`;
  }
  if (diffMs < msPerDay) {
    return `${Math.floor(diffMs / (60 * 60 * 1000))}h ago`;
  }
  if (diffMs < 7 * msPerDay) {
    return `${Math.floor(diffMs / msPerDay)}d ago`;
  }
  return new Date(timestamp).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
