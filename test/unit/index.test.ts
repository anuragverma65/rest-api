import * as creditCardData from "../fixtures/credit_card.json";
import * as invalidData from "../fixtures/invalid_data.json";
import request from "supertest";
import { app } from "../../src/app";
import { validCreditCard } from "../../src/validator";

jest.mock("../../src/dal");

describe("Add credit card details", () => {
  it("should return 400 for invalid data", async () => {
    const res = await request(app).post("/api/v1/add").send(invalidData);
    expect(res.body.status).toBe(400);
  });

  it("should return 200 for valid data", async () => {
    const res = await request(app).post("/api/v1/add").send(creditCardData);
    expect(res.body.status).toBe(200);
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
