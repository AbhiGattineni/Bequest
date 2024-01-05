"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const PORT = 8080;
const app = (0, express_1.default)();
const database = { data: "Hello World" };
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Routes
app.get("/", (req, res) => {
    res.json(database);
});
app.post("/", (req, res) => {
    database.data = req.body.data;
    res.sendStatus(200);
});
app.listen(PORT, () => {
    console.log("Server running on port " + PORT);
});