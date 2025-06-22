// src/index.ts
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { Zermelo } from "zermelo.ts";

dotenv.config();

const app = express();
const PORT = 4000;

app.use(cors());

// Auth callback handler
app.get("/api/auth/callback", async (req, res) => {
  const { code, school } = req.query;

  if (!code || !school) {
    return res.status(400).send("Code or school missing");
  }

  try {
    const token = await Zermelo.getAccessToken(
      school as string,
      code as string,
      {
        clientId: process.env.ZERMELO_CLIENT_ID!,
        clientSecret: process.env.ZERMELO_CLIENT_SECRET!,
        redirectUri: process.env.ZERMELO_REDIRECT_URI!,
      }
    );

    const api = Zermelo.getAPI(school as string, token.access_token);
    const userInfo = await api.users.get("~me");

    res.json({ token: token.access_token, user: userInfo.response.data[0] });
  } catch (err) {
    console.error(err);
    res.status(500).send("Token fetch or user call failed");
  }
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
