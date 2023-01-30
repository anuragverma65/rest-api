import knex from "../database/knex";

export type CreditCard = {
  id: string;
  linked_user_full_name: string;
  card_number: string;
  limit: number;
  card_provider: string;
};

export const getAllCardsFromDb = async (): Promise<CreditCard[]> => {
  return await knex("credit_cards");
};

export const updateCardLimit = async (
  id: string,
  limit: number
): Promise<number> => {
  return await knex<CreditCard>("credit_cards")
    .update({ limit })
    .where("id", id)
    .returning("limit");
};

export const deleteCard = async (id: string): Promise<string> => {
  return await knex<CreditCard>("credit_cards")
    .where("id", id)
    .del()
    .returning("id");
};

export const getPaginatedCardsFromDb = async (
  limit: number,
  offset: number
): Promise<CreditCard[]> => {
  return await knex("credit_cards").limit(limit).offset(offset);
};

export const addCard = async (
  creditCardInput: CreditCard
): Promise<string[]> => {
  return await knex<CreditCard>("credit_cards")
    .insert(creditCardInput)
    .returning("id");
};

export const findCardbyId = async (id: string): Promise<CreditCard> => {
  return await knex("credit_cards").where("id", id).first();
};

export const findCardbyCardNumber = async (
  card_number: string
): Promise<CreditCard | undefined> => {
  return await knex("credit_cards").where("card_number", card_number).first();
};
