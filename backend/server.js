import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

const app = express();

app.use(cors());
app.use(bodyParser.json());

const API_ENDPOINT = process.env.API_ENDPOINT;
const BEARER_TOKEN = process.env.BEARER_TOKEN;

app.post("/api/chat", async (req, res) => {
  try {
    const body = req.body;
    const response = await fetch(API_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${BEARER_TOKEN}`,
      },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    console.error("Error forwarding request:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

const PORT=process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });