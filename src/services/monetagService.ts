declare global {
  interface Window {
    monetagZoneId?: string;
    show_10195941?: () => Promise<void>;
    [key: string]: any;
  }
}

export interface AdWatchResult {
  success: boolean;
  rewardEarned: number;
  message: string;
}

export const canWatchAd = (
  adsWatchedToday: number,
  lastAdWatchedAt: number,
  dailyLimit: number,
  cooldownSeconds: number
): { allowed: boolean; remainingCooldown: number; reason?: string } => {
  if (adsWatchedToday >= dailyLimit) {
    return {
      allowed: false,
      remainingCooldown: 0,
      reason: 'Daily ad limit reached. Please come back tomorrow!',
    };
  }

  const now = Date.now();
  const timeSinceLast = (now - lastAdWatchedAt) / 1000;
  if (timeSinceLast < cooldownSeconds) {
    const remaining = Math.ceil(cooldownSeconds - timeSinceLast);
    return {
      allowed: false,
      remainingCooldown: remaining,
      reason: `Ad cooldown active. Please wait ${remaining}s.`,
    };
  }

  return { allowed: true, remainingCooldown: 0 };
};

export const triggerMonetagAd = async (zoneId: string = '10195941'): Promise<boolean> => {
  const functionName = `show_${zoneId}`;
  
  if (typeof window !== 'undefined' && typeof window[functionName] === 'function') {
    try {
      await window[functionName]();
      return true;
    } catch (err) {
      console.warn('Monetag direct SDK call failed or was dismissed, falling back:', err);
      return false;
    }
  }

  return false;
};
