import * as creditCardData from "../fixtures/credit_card.json";
import * as invalidData from "../fixtures/invalid_data.json";
import request from "supertest";
import { app } from "../../src/app";
import { validCreditCard } from "../../src/validator";
import {
  addCardService,
  updateCardService,
  getAllCardsService,
  deleteCardService,
  getPaginatedCardsService,
} from "../../src/services";

jest.mock("../../src/dal");

jest.mock("../../src/services");

describe("Add credit card details", () => {
  it("should return 400 for invalid data", async () => {
    const res = await request(app).post("/api/v1/add").send(invalidData);
  });
  it("should return 200 for valid data", async () => {
    const res = await request(app).post("/api/v1/add").send(creditCardData);
    expect(res.body.status).toBe(200);
  });

  it("should return 400 for invalid data", async () => {
    (
      addCardService as jest.MockedFunction<typeof addCardService>
    ).mockResolvedValue([]);
    const res = await request(app).post("/api/v1/add").send(creditCardData);
    expect(res.body.status).toBe(400);
  });
  it("should return 500 for invalid data", async () => {
    (
      addCardService as jest.MockedFunction<typeof addCardService>
    ).mockRejectedValue(Error);
    const res = await request(app).post("/api/v1/add").send(creditCardData);
    expect(res.body.status).toBe(500);
  });
});

describe("Update credit card details", () => {
  it("should return 400 for invalid data", async () => {
    const res = await request(app)
      .patch("/api/v1/update")
      .send({ limit: "", id: "eb103315-2269-4f33-a18b-23dbdb42b26e" });
    expect(res.body.status).toBe(400);
  });

  it("should return 400 for valid data if the card is not present in the system", async () => {
    const res = await request(app)
      .patch("/api/v1/update")
      .send({ limit: 5000, id: "eb103315-2269-4f33-a18b-23dbdb42b26e" });
    expect(res.body.status).toBe(400);
    expect(res.body.message).toBe("credit card not present in the system");
  });
  it("should return 500 in case of error", async () => {
    (
      updateCardService as jest.MockedFunction<typeof updateCardService>
    ).mockRejectedValue(Error);
    const res = await request(app)
      .patch("/api/v1/update")
      .send({ limit: 5000, id: "eb103315-2269-4f33-a18b-23dbdb42b26e" });
    expect(res.body.status).toBe(500);
  });
});

describe("Get credit card details", () => {
  it("should return 500 for error", async () => {
    (
      getAllCardsService as jest.MockedFunction<typeof getAllCardsService>
    ).mockRejectedValue(Error);
    const res = await request(app).get("/api/v1/get-all").send();
    expect(res.body.status).toBe(500);
  });

  it("should return no data found if there is no data", async () => {
    (
      getAllCardsService as jest.MockedFunction<typeof getAllCardsService>
    ).mockResolvedValue([]);
    const res = await request(app).get("/api/v1/get-all").send();
    expect(res.body.message).toBe("No credit card data found");
  });
  (
    getPaginatedCardsService as jest.MockedFunction<
      typeof getPaginatedCardsService
    >
  ).mockRejectedValue(Error);
  it("should return 500 for error", async () => {
    const res = await request(app).get("/api/v1/get-cards").send();
    expect(res.body.status).toBe(500);
  });
});

describe("Delete credit card details", () => {
  (
    deleteCardService as jest.MockedFunction<typeof deleteCardService>
  ).mockRejectedValue(Error);
  it("should return 500 for error", async () => {
    const res = await request(app).delete("/api/v1/delete").send({
      id: "eb103315-2269-4f33-a18b-23dbdb42b26e",
    });
    expect(res.body.status).toBe(500);
  });
});

describe("luhn algorithm", () => {
  it("should return throw an error for empty value", () => {
    expect(validCreditCard("")).toBe(false);
  });
  it("should return false for incorrect card value", () => {
    expect(validCreditCard("abcd1577358")).toBe(false);
  });
  it("should return false for long card value", () => {
    expect(validCreditCard("12341234123412341234")).toBe(false);
  });
  it("should return true for correct credit card", () => {
    const res = validCreditCard("5105105105105100");
    expect(res).toBe(true);
  });
  it("should return false for correct credit card", () => {
    const res = validCreditCard("5105105105105101");
    expect(res).toBe(false);
  });
});
