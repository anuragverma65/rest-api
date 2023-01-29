import express, { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { v4 as uuidv4 } from "uuid";

import knex from "./database/knex";
import {
  validateCreateCardInputs,
  validateDeleteInput,
  validateGetQueryParams,
  validateUpdateInput,
} from "./validator";

type CreditCard = {
  id: string;
  linked_user_full_name: string;
  card_number: string;
  limit: number;
  card_provider: string;
};

const app = express();

const PORT = 5000;

start_server();

app.use(express.json());

app.get("/", async (_req: Request, res: Response) => {
  return res.send("Rest API is operational!");
});

app.post(
  "/add",
  validateCreateCardInputs(),
  (req: Request, res: Response, next: NextFunction) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res
        .status(400)
        .json({ error, message: "invalid card data supplied" });
    }
    next();
  },
  async (req: Request, res: Response) => {
    const id = uuidv4();
    try {
      const data = await knex<CreditCard>("credit_cards")
        .insert({
          ...req.body,
          id,
        })
        .returning("id"); // only return the uuid so as to not expose PII unless needed
      return res.send({
        data,
        message: "credit card details added successfully",
        status: 200,
      });
    } catch (e) {
      return res.status(500).json({ e, message: "Something went wrong" });
    }
  }
);

app.get("/get-all", async (_req: Request, res: Response) => {
  try {
    const data = await knex("credit_cards");
    const message =
      data.length > 0 ? `${data.length} card data found` : "No card data found";
    return res.send({ message, data });
  } catch (e) {
    return res.status(500).json({ e, message: "Something went wrong" });
  }
});

app.patch(
  "/update",
  validateUpdateInput(),
  (req: Request, res: Response, next: NextFunction) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res
        .status(400)
        .json({ error, message: "invalid card data supplied" });
    }
    next();
  },
  async (req: Request, res: Response) => {
    try {
      const id = req.body.id;
      const limit = req.body.limit;
      const data = await knex<CreditCard>("credit_cards")
        .update({ limit })
        .where("id", id)
        .returning("limit");
      const message = "card limit updated successfully!";
      return res.send({ message, data });
    } catch (e) {
      return res.status(500).json({ e, message: "Something went wrong" });
    }
  }
);

app.delete(
  "/delete",
  validateDeleteInput(),
  (req: Request, res: Response, next: NextFunction) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res
        .status(400)
        .json({ error, message: "invalid card data supplied" });
    }
    next();
  },
  async (req: Request, res: Response) => {
    const id = req.body.id;
    try {
      const data = await knex<CreditCard>("credit_cards")
        .where("id", id)
        .del()
        .returning("id");
      const message = "card details deleted successfully!";
      return res.send({ message, data });
    } catch (e) {
      return res.status(500).json({ e, message: "Something went wrong" });
    }
  }
);

// Add paginatated route to serve limited data. Default is set to 10
app.get(
  "/get-cards",
  validateGetQueryParams(),
  (req: Request, res: Response, next: NextFunction) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(400).json({ error, message: "invalid query params" });
    }
    next();
  },
  async (req: Request, res: Response) => {
    const id = req.body.id;
    const dataLimit = (req.query.limit as number | undefined) || 10;
    const dataOffset = req.query.offset as unknown as number;
    try {
      const data = await knex("credit_cards")
        .limit(dataLimit)
        .offset(dataOffset);
      const message =
        data.length > 0
          ? `${data.length} card data found`
          : "No card data found";
      return res.send({ message, data });
    } catch (e) {
      return res.status(500).json({ e, message: "Something went wrong" });
    }
  }
);

async function start_server() {
  try {
    await knex.migrate.latest();
    console.log("Database migration succesful. Database is ready");
  } catch (e) {
    console.error("database migration failed", e);
  }
  app.listen(PORT, () => {
    console.log("Server is running on port 5000");
  });
}
