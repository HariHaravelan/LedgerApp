// src/utils/numberUtils.ts
export const formatAmount = (value: string): string => {
    // Remove all non-numeric characters except decimal point
    let cleaned = value.replace(/[^0-9.]/g, '');
    
    // Ensure only one decimal point
    const parts = cleaned.split('.');
    if (parts.length > 2) cleaned = parts[0] + '.' + parts[1];
    
    // Limit to 2 decimal places
    if (parts.length > 1) {
      cleaned = parts[0] + '.' + parts[1].slice(0, 2);
    }
  
    // Add thousand separators
    const whole = parts[0];
    const decimal = parts[1] || '';
    const withCommas = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    
    return decimal ? `${withCommas}.${decimal}` : withCommas;
  };
  
  export const parseAmount = (value: string): number => {
    // Remove all non-numeric characters except decimal point
    const cleaned = value.replace(/[^0-9.]/g, '');
    return parseFloat(cleaned) || 0;
  };