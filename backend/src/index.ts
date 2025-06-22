import express from "express";
import type { Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import { Zermelo } from "zermelo.ts";

dotenv.config();

const app = express();
const PORT = 4000;

app.use(cors());

app.get("/api/test/schedule", async (req: Request, res: Response) => {
  try {
    const token = process.env.ZERMELO_ACCESS_TOKEN!;
    const school = process.env.ZERMELO_SCHOOL!;

    const api = Zermelo.getAPI(school, token);
    const data = await api.liveschedule.get({ user: "~me" });

    res.json(data.response.data);
  } catch (err) {
    console.error(err);
    res.status(500).send("Kon rooster niet ophalen");
  }
});

app.listen(PORT, () => {
  console.log(`✅ Backend draait op http://localhost:${PORT}`);
});
