export const removeCardNumberFormatting = (cardNumber: string): number[] => {
  return cardNumber.replace(/\D/g, "").split("").map(Number);
};

export const getSanitizedCardNumber = (cardNumber: string): string => {
  return removeCardNumberFormatting(cardNumber).join("");
};
