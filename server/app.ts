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
  const hash = createDigitalSignature(data); 
  res.json({ data, hash });
});

app.put("/", (req, res) => {
  const { originalData, hashedData } = req.body;

  const rehashedData = createDigitalSignature(originalData);

  if (rehashedData === hashedData) {
    database.data = originalData; 
    res.sendStatus(200);
  } else {
    res.status(400).send("Data integrity check failed");
  }
});

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
