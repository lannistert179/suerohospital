/**
 * Sanitizes database error messages to prevent information leakage
 * Maps known error patterns to user-friendly messages
 */
export const getErrorMessage = (error: Error | unknown): string => {
  const message = error instanceof Error ? error.message : String(error);
  
  // Log full error for debugging (only visible in dev tools)
  console.error('Operation error:', error);
  
  // Map known error patterns to user-friendly messages
  if (message.includes('duplicate key') || message.includes('unique constraint')) {
    return 'This item already exists. Please use a different name or value.';
  }
  
  if (message.includes('foreign key') || message.includes('violates foreign key')) {
    return 'Cannot complete this action: the item is referenced by other records.';
  }
  
  if (message.includes('violates check constraint')) {
    return 'Invalid data provided. Please check your input and try again.';
  }
  
  if (message.includes('violates row-level security') || message.includes('RLS')) {
    return 'You do not have permission to perform this action.';
  }
  
  if (message.includes('not found') || message.includes('does not exist')) {
    return 'The requested item could not be found.';
  }
  
  if (message.includes('network') || message.includes('fetch')) {
    return 'Network error. Please check your connection and try again.';
  }
  
  if (message.includes('timeout')) {
    return 'The operation timed out. Please try again.';
  }
  
  if (message.includes('unauthorized') || message.includes('401')) {
    return 'Your session has expired. Please log in again.';
  }
  
  // Generic fallback - don't expose internal details
  return 'An error occurred. Please try again or contact support if the problem persists.';
};
