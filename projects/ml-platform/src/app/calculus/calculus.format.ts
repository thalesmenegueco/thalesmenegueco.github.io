export function formatNumber(value: number, decimals = 3): string {
  if (!Number.isFinite(value)) {
    return 'indefinido';
  }
  return value.toFixed(decimals);
}
