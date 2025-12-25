import { useState, useCallback, useRef } from 'react';

interface RateLimiterConfig {
  maxAttempts: number;
  windowMs: number;
  lockoutMs: number;
}

interface RateLimiterState {
  attempts: number;
  isLocked: boolean;
  lockoutEndTime: number | null;
  remainingTime: number;
}

const DEFAULT_CONFIG: RateLimiterConfig = {
  maxAttempts: 5,
  windowMs: 60 * 1000, // 1 minute window
  lockoutMs: 5 * 60 * 1000, // 5 minute lockout
};

/**
 * Rate limiter hook for preventing brute force attacks
 * Implements exponential backoff after failed attempts
 */
export function useRateLimiter(config: Partial<RateLimiterConfig> = {}) {
  const { maxAttempts, windowMs, lockoutMs } = { ...DEFAULT_CONFIG, ...config };
  
  const [state, setState] = useState<RateLimiterState>({
    attempts: 0,
    isLocked: false,
    lockoutEndTime: null,
    remainingTime: 0,
  });
  
  const attemptTimestamps = useRef<number[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const updateRemainingTime = useCallback(() => {
    if (state.lockoutEndTime) {
      const remaining = Math.max(0, state.lockoutEndTime - Date.now());
      if (remaining === 0) {
        // Lockout ended
        setState({
          attempts: 0,
          isLocked: false,
          lockoutEndTime: null,
          remainingTime: 0,
        });
        attemptTimestamps.current = [];
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
      } else {
        setState(prev => ({ ...prev, remainingTime: remaining }));
      }
    }
  }, [state.lockoutEndTime]);

  const checkRateLimit = useCallback((): boolean => {
    const now = Date.now();
    
    // Check if currently locked out
    if (state.isLocked && state.lockoutEndTime && now < state.lockoutEndTime) {
      return false;
    }
    
    // Clear expired attempts from window
    attemptTimestamps.current = attemptTimestamps.current.filter(
      timestamp => now - timestamp < windowMs
    );
    
    return true;
  }, [state.isLocked, state.lockoutEndTime, windowMs]);

  const recordAttempt = useCallback((success: boolean) => {
    const now = Date.now();
    
    if (success) {
      // Reset on successful attempt
      attemptTimestamps.current = [];
      setState({
        attempts: 0,
        isLocked: false,
        lockoutEndTime: null,
        remainingTime: 0,
      });
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }
    
    // Record failed attempt
    attemptTimestamps.current.push(now);
    
    // Clean up old attempts
    attemptTimestamps.current = attemptTimestamps.current.filter(
      timestamp => now - timestamp < windowMs
    );
    
    const currentAttempts = attemptTimestamps.current.length;
    
    if (currentAttempts >= maxAttempts) {
      // Lockout with exponential backoff
      const lockoutMultiplier = Math.min(Math.pow(2, Math.floor(currentAttempts / maxAttempts) - 1), 4);
      const lockoutDuration = lockoutMs * lockoutMultiplier;
      const lockoutEndTime = now + lockoutDuration;
      
      setState({
        attempts: currentAttempts,
        isLocked: true,
        lockoutEndTime,
        remainingTime: lockoutDuration,
      });
      
      // Start countdown timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      timerRef.current = setInterval(updateRemainingTime, 1000);
    } else {
      setState(prev => ({
        ...prev,
        attempts: currentAttempts,
      }));
    }
  }, [maxAttempts, windowMs, lockoutMs, updateRemainingTime]);

  const formatRemainingTime = useCallback((ms: number): string => {
    const seconds = Math.ceil(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    if (minutes > 0) {
      return `${minutes}m ${remainingSeconds}s`;
    }
    return `${remainingSeconds}s`;
  }, []);

  const getRemainingAttempts = useCallback((): number => {
    return Math.max(0, maxAttempts - state.attempts);
  }, [maxAttempts, state.attempts]);

  return {
    isLocked: state.isLocked,
    attempts: state.attempts,
    remainingTime: state.remainingTime,
    checkRateLimit,
    recordAttempt,
    formatRemainingTime,
    getRemainingAttempts,
    maxAttempts,
  };
}
