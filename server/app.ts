import express from "express";
import cors from "cors";
import createDigitalSignature from "./commonFunctions";

const PORT = 8080;
const app = express();
const database = { data: "Hello World" };

app.use(cors());
app.use(express.json());

// Routes

app.get("/", (req, res) => {
  const data = database.data;
  const signature = createDigitalSignature(data);
  res.json(signature);
});

app.post("/", (req, res) => {
  database.data = req.body.data;
  res.sendStatus(200);
});

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
