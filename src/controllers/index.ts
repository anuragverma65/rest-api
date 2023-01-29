import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { CreditCard } from "../dal";
import {
  addCardService,
  deleteCardService,
  getAllCardsService,
  getPaginatedCardsService,
  updateCardService,
} from "../services";
export const addCard = async (req: Request, res: Response) => {
  const id = uuidv4();
  try {
    const dataToUpdate: CreditCard = {
      id,
      limit: req.body.limit,
      card_number: req.body.card_number,
      card_provider: req.body.card_provider,
      linked_user_full_name: req.body.linked_user_full_name,
    };
    const data = await addCardService(dataToUpdate); // only return the uuid so as to not expose PII unless needed
    return res.send({
      data,
      message: "credit card details added successfully",
      status: 200,
    });
  } catch (e) {
    return res.json({ e, message: "Something went wrong", status: 500 });
  }
};

export const getAllCards = async (_req: Request, res: Response) => {
  try {
    const data = await getAllCardsService();
    const message =
      data.length > 0
        ? `${data.length} credit card data found`
        : "No credit card data found";
    return res.send({ message, data });
  } catch (e) {
    return res.json({ e, message: "Something went wrong", status: 500 });
  }
};

export const updateCard = async (req: Request, res: Response) => {
  try {
    const id = req.body.id;
    const limit = req.body.limit;
    const data = await updateCardService(id, limit);
    if (!data) {
      return res.json({
        message: "credit card not present in the system",
        status: 400,
      });
    }
    const message = "card limit updated successfully!";
    return res.send({ message, data });
  } catch (e) {
    return res.json({ e, message: "Something went wrong", status: 500 });
  }
};

export const deleteCard = async (req: Request, res: Response) => {
  const id = req.body.id;
  try {
    const data = await deleteCardService(id);
    if (!data) {
      return res.json({
        message: "credit card not present in the system",
        status: 400,
      });
    }
    const message = "card details deleted successfully!";
    return res.send({ message, data });
  } catch (e) {
    return res.json({ e, message: "Something went wrong", status: 500 });
  }
};

export const getCards = async (req: Request, res: Response) => {
  const limit = (req.query.limit as number | undefined) || 10;
  const offset = req.query.offset as unknown as number;
  try {
    const data = await getPaginatedCardsService(limit, offset);
    const message =
      data.length > 0
        ? `${data.length} credit card data found`
        : "No credit card data found";
    return res.send({ message, data });
  } catch (e) {
    return res.json({ e, message: "Something went wrong", status: 500 });
  }
};
