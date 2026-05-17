export const convertToPaisa = (amount: number): number => {
  return Math.round(amount * 100);
};

export const convertToRupeesUnit = (amount: number): number => {
  return amount / 100;
};

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(amount);
}