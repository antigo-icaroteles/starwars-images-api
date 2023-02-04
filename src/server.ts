import "dotenv/config";
import cors from "cors";
import express, { Request, Response } from "express";
import { load } from "cheerio";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/:name", async (req: Request, res: Response) => {
  const { name } = req.params;

  try {
    const response = await fetch(`https://www.starwars.com/databank/${name}`, {
      method: "GET",
    });
    const html = await response.text();
    const $ = load(html);
    const url = $("#ref-1-5 .thumb").attr("data-src");

    if (url) {
      return res.status(200).json({ url });
    } else {
      return res.status(404).json({ error: "Url not found" });
    }
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
