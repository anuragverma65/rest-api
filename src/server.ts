import express, { Request, Response } from "express";

const app = express();

const PORT = 5000;

app.get("/", (_req: Request, res: Response) => {
  return res.send("Hello world!");
});

app.listen(PORT, () => {
  console.log("Server is running on port 5000");
});
