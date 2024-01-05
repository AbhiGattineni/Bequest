"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const commonFunctions_1 = __importDefault(require("./commonFunctions"));
const PORT = 8080;
const app = (0, express_1.default)();
const database = { data: "Hello World" };
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Routes
app.get("/", (req, res) => {
    const data = database.data;
    const hash = (0, commonFunctions_1.default)(data);
    res.json({ data, hash });
});
app.put("/", (req, res) => {
    const { originalData, hashedData } = req.body;
    const rehashedData = (0, commonFunctions_1.default)(originalData);
    if (rehashedData === hashedData) {
        database.data = originalData;
        res.sendStatus(200);
    }
    else {
        res.status(400).send("Data integrity check failed");
    }
});
app.listen(PORT, () => {
    console.log("Server running on port " + PORT);
});
