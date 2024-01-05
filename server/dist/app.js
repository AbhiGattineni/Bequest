"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const commonFunctions_1 = __importStar(require("./commonFunctions"));
const PORT = 8080;
const app = (0, express_1.default)();
const database = { data: "Hello World" };
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Routes
app.get("/", (req, res) => {
    const data = database.data;
    //creating a hash of the data
    const hash = (0, commonFunctions_1.default)(data);
    res.json({ data, hash });
});
app.put("/", (req, res) => {
    const { originalData, hashedData } = req.body;
    //rehashing the data to check if the data has been tampered with
    const rehashedData = (0, commonFunctions_1.default)(originalData);
    if (rehashedData === hashedData) {
        const currentData = database.data;
        const currentHash = hashedData;
        const logEntry = {
            data: currentData,
            hash: currentHash,
            timestamp: new Date()
        };
        //logging each time data is chnaged, this will enable us to track the history of data changes
        (0, commonFunctions_1.dataHistory)(logEntry);
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
