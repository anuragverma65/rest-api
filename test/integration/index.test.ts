import request from "supertest";
import { app } from "../../src/app";
import { CreditCard } from "../../src/dal";
import knex from "../../src/database/knex";

var fs = require("fs");
var seedData = JSON.parse(
  fs.readFileSync("test/fixtures/seed_data.json", "utf8")
);

var validData = JSON.parse(
  fs.readFileSync("test/fixtures/credit_card.json", "utf8")
);

var invalidData = JSON.parse(
  fs.readFileSync("test/fixtures/invalid_data.json", "utf8")
);

beforeAll(async () => {
  await knex.migrate.latest();
  await knex("credit_cards").insert(seedData);
});

describe("POST API", () => {
  it("should have data and 200 status when created with correct data", async () => {
    const res = await request(app).post("/api/v1/add").send(validData);
    expect(res.body.status).toBe(200);
  });
  it("should have 400 status when created with already present data", async () => {
    const res = await request(app).post("/api/v1/add").send(validData);
    expect(res.body.status).toBe(400);
  });
  it("should have 400 status when created with incorrect data", async () => {
    const res = await request(app).post("/api/v1/add").send(invalidData);
    expect(res.body.status).toBe(400);
  });
});

describe("GET API", () => {
  it("should return 6 records", async () => {
    const res = await request(app).get("/api/v1/get-all").send();

    expect(res.body).toHaveProperty("data");
    expect(res.body.message).toBe("6 credit card data found");
    expect(res.body.data.length).toBe(6);
  });
  it("should return 3 record if limit is set to 3", async () => {
    const res = await request(app).get("/api/v1/get-cards?limit=3").send();

    expect(res.body).toHaveProperty("data");
    expect(res.body.message).toBe("3 credit card data found");
    expect(res.body.data.length).toBe(3);
  });
  it("should return 1 record if offset is set to 5", async () => {
    const res = await request(app)
      .get("/api/v1/get-cards?limit=3&offset=5")
      .send();

    expect(res.body).toHaveProperty("data");
    expect(res.body.message).toBe("1 credit card data found");
    expect(res.body.data.length).toBe(1);
  });
  it("should return 0 record if offset is set to 6", async () => {
    const res = await request(app)
      .get("/api/v1/get-cards?limit=3&offset=6")
      .send();

    expect(res.body).toHaveProperty("data");
    expect(res.body.message).toBe("No credit card data found");
    expect(res.body.data.length).toBe(0);
  });
});

describe("PATCH API", () => {
  it("should update the first record limit to 10000", async () => {
    const card = await knex<CreditCard>("credit_cards").first();
    const res = await request(app).patch("/api/v1/update").send({
      limit: 10000,
      id: card?.id,
    });
    expect(res.body.message).toBe("card limit updated successfully!");
  });
  it("should return card not in system if update is requested for card not in the system", async () => {
    const res = await request(app).patch("/api/v1/update").send({
      limit: 10000,
      id: "eb103315-2269-4f33-a18b-23dbdb42b266",
    });
    expect(res.body.message).toBe("credit card not present in the system");
  });
});

describe("DELETE API", () => {
  it("should delete the first record", async () => {
    const card = await knex<CreditCard>("credit_cards").first();
    const res = await request(app).delete("/api/v1/delete").send({
      id: card?.id,
    });
    const cards = await knex<CreditCard>("credit_cards");
    expect(cards.length).toBe(5);
  });
  it("should return card not in system for unknown card details", async () => {
    const res = await request(app).delete("/api/v1/delete").send({
      id: "c98bde5f-3d99-4a85-98a5-6aa6f8800872",
    });
    expect(res.body.message).toBe("credit card not present in the system");
  });
});

describe("Knex - Check rollback works", () => {
  it("should rollback the migrations successfully", async () => {
    const t = await knex.migrate.rollback();

    expect(t[1].length).toBeGreaterThan(0);
  });
});

afterAll((done) => {
  // Closing the DB connection to allow Jest to exit successfully.
  knex.destroy();
  done();
});
