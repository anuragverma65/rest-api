import {
  addCard,
  CreditCard,
  deleteCard,
  findCardbyCardNumber,
  findCardbyId,
  getAllCardsFromDb,
  getPaginatedCardsFromDb,
  updateCardLimit,
} from "../dal";
import { getSanitizedCardNumber } from "../utils";

export const getPaginatedCardsService = async (
  limit: number,
  offset: number
): Promise<CreditCard[]> => {
  return await getPaginatedCardsFromDb(limit, offset);
};

export const getAllCardsService = async (): Promise<CreditCard[]> => {
  return await getAllCardsFromDb();
};

export const updateCardService = async (
  id: string,
  limit: number
): Promise<Number | null> => {
  const card = await findCardbyId(id);
  if (!card) {
    return null;
  }
  return await updateCardLimit(id, limit);
};

export const deleteCardService = async (id: string): Promise<string | null> => {
  const card = await findCardbyId(id);
  if (!card) {
    return null;
  }
  return await deleteCard(id);
};

export const addCardService = async (
  creditCardInput: CreditCard
): Promise<string[]> => {
  const sanitizedCardNumber = getSanitizedCardNumber(
    creditCardInput.card_number
  );
  const card = await findCardbyCardNumber(sanitizedCardNumber);
  if (card) {
    return [];
  }
  return await addCard({
    ...creditCardInput,
    card_number: sanitizedCardNumber,
  });
};
