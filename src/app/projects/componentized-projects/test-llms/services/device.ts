export interface DeviceInfo {
  isMobile: boolean;
  isLowMemory: boolean;
}

export function detectDevice(): DeviceInfo {
  if (typeof navigator === 'undefined') {
    return { isMobile: false, isLowMemory: false };
  }

  const userAgent = navigator.userAgent ?? '';
  const isMobileUa = /Android|iPhone|iPad|iPod|Mobile/i.test(userAgent);

  const maxTouchPoints =
    typeof navigator.maxTouchPoints === 'number' ? navigator.maxTouchPoints : 0;
  const isTouchTablet =
    maxTouchPoints > 0 && typeof screen !== 'undefined' && screen.width < 1024;

  const platform = (navigator as { platform?: string }).platform ?? '';
  const isIpadInDesktopMode = /MacIntel/i.test(platform) && maxTouchPoints > 1;

  const deviceMemory = (navigator as { deviceMemory?: number }).deviceMemory;
  const isLowMemory = typeof deviceMemory === 'number' && deviceMemory <= 4;

  const isMobile = isMobileUa || isTouchTablet || isIpadInDesktopMode;

  return { isMobile, isLowMemory };
}
