export const formatAmount = (amount: number): string => {
  const absAmount = Math.abs(amount);
  let numStr = absAmount.toString();
  let lastThree = numStr.substring(numStr.length - 3);
  let otherNumbers = numStr.substring(0, numStr.length - 3);
  if (otherNumbers !== '') lastThree = ',' + lastThree;
  const formatted = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + lastThree;
  return `₹${formatted}`;
};

export const truncateText = (text: string, maxLength: number) => {
  return text.length > maxLength ? text.substring(0, maxLength - 2) + '...' : text;
};



export const formatLastTransaction = (date: Date) => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days === 0) {
    return 'Today';
  } else if (days === 1) {
    return 'Yesterday';
  } else if (days < 7) {
    return `${days} days ago`;
  } else {
    return date.toLocaleDateString();
  }
};