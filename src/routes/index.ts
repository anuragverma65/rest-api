import express from "express";
import {
  addCard,
  getAllCards,
  updateCard,
  deleteCard,
  getCards,
} from "../controllers";
import { handleValidationErrors } from "../middleware";
import {
  validateCreateCardInputs,
  validateUpdateInput,
  validateDeleteInput,
  validateGetQueryParams,
} from "../validator";

export const router = express.Router();

router.post(
  "/add",
  validateCreateCardInputs(),
  handleValidationErrors,
  addCard
);

router.get("/get-all", getAllCards);

router.patch(
  "/update",
  validateUpdateInput(),
  handleValidationErrors,
  updateCard
);

router.delete(
  "/delete",
  validateDeleteInput(),
  handleValidationErrors,
  deleteCard
);

// Add paginatated route to serve limited data. Default is set to 10
router.get(
  "/get-cards",
  validateGetQueryParams(),
  handleValidationErrors,
  getCards
);
