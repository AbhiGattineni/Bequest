import express from "express";
import cors from "cors";
import createDigitalSignature, { dataHistory } from "./commonFunctions";

const PORT = 8080;
const app = express();
const database = { data: "Hello World" };

app.use(cors());
app.use(express.json());

// Routes

app.get("/", (req, res) => {
  const data = database.data; 
  //creating a hash of the data
  const hash = createDigitalSignature(data); 
  res.json({ data, hash });
});

app.put("/", (req, res) => {
  const { originalData, hashedData } = req.body;

  //rehashing the data to check if the data has been tampered with
  const rehashedData = createDigitalSignature(originalData);

  if (rehashedData === hashedData) {
    const currentData = database.data;
    const currentHash = hashedData;
    const logEntry = {
      data: currentData, 
      hash: currentHash, 
      timestamp: new Date()
    };
    
    //logging each time data is chnaged, this will enable us to track the history of data changes
    dataHistory(logEntry);

    database.data = originalData; 
    res.sendStatus(200);
  } else {
    res.status(400).send("Data integrity check failed");
  }
});

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
