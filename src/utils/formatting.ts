export const formatAmount = (amount: number): string => {
    const absAmount = Math.abs(amount);
    let numStr = absAmount.toString();
    let lastThree = numStr.substring(numStr.length - 3);
    let otherNumbers = numStr.substring(0, numStr.length - 3);
    if (otherNumbers !== '') lastThree = ',' + lastThree;
    const formatted = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + lastThree;
    return `₹${formatted}`;
  };  