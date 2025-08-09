import { formatAmount } from '../src/utils/numberUtils';

describe('formatAmount', () => {
  it('formats numbers with thousand separators and two decimals', () => {
    expect(formatAmount('1234.5678')).toBe('1,234.56');
  });

  it('handles multiple decimal points', () => {
    expect(formatAmount('1234.56.78')).toBe('1,234.56');
  });
});
