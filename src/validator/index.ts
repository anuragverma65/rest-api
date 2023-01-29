import { body, query } from "express-validator";

/*
The Luhn Algorithm
How the algorithm works
The algorithm works as follows:
Given a card number, starting from the left mode index double every other digit
Sum of all the digits of the individual result i.e. 14 would be 1 + 4
if the sum is a multiple of 10 then its a valid card number
*/

export const validCreditCard = (value: string): boolean => {
  if (!value || typeof value !== "string") {
    return false;
  }
  // accept only digits, dashes or spaces
  if (/[^0-9-\s]+/.test(value)) return false;

  const digits = value.replace(/\D/g, "").split("").map(Number);
  if (digits.length > 19) return false;
  const checkSum = digits.reduce((acc, digit, index) => {
    if (index % 2 === 0) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    acc += digit;
    return acc;
  }, 0);

  return checkSum % 10 === 0;
};

export const validateCreateCardInputs = () => {
  return [
    body("card_number")
      .notEmpty()
      .withMessage("Card number value cant be blank")
      .custom(validCreditCard)
      .withMessage("Invalid card number"),
    body("linked_user_full_name")
      .notEmpty()
      .withMessage("Card user full name cant be blank"),
    body("card_provider")
      .notEmpty()
      .withMessage("Card provider name cant be blank"),
    body("limit").optional().isNumeric(),
  ];
};

export const validateGetQueryParams = () => {
  return [
    query("limit")
      .optional()
      .isInt({ min: 1, max: 10 })
      .withMessage("The limit value should be number and between 1-10"),
    query("offset")
      .optional()
      .isNumeric()
      .withMessage("The value should be number"),
  ];
};

export const validateDeleteInput = () => {
  return [
    body("id")
      .notEmpty()
      .withMessage("card id cant be blank")
      .isUUID()
      .withMessage("Invalid card id"),
  ];
};

// only validating limit as ideally no other data points should be updated
export const validateUpdateInput = () => {
  return [
    body("limit").optional().isNumeric(),
    body("id")
      .notEmpty()
      .withMessage("card id cant be blank")
      .isUUID()
      .withMessage("Invalid card id"),
  ];
};
