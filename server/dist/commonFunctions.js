"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = __importDefault(require("crypto"));
function createDigitalSignature(data) {
    return crypto_1.default.createHash('sha256').update(data).digest('hex');
}
exports.default = createDigitalSignature;
