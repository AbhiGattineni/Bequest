"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dataHistory = void 0;
const crypto_1 = __importDefault(require("crypto"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const node_cron_1 = __importDefault(require("node-cron"));
function createDigitalSignature(data) {
    return crypto_1.default.createHash('sha256').update(data).digest('hex');
}
exports.default = createDigitalSignature;
function dataHistory(logEntry) {
    fs_1.default.appendFileSync(path_1.default.join(__dirname, '..', 'dataHistory.log'), JSON.stringify(logEntry) + '\n');
    fs_1.default.appendFileSync(path_1.default.join(__dirname, '..', 'datafile.log'), logEntry.data + '\n');
}
exports.dataHistory = dataHistory;
// Function to perform the backup
function performBackup() {
    const dataFilePath = path_1.default.join(__dirname, '..', 'datafile.log');
    const backupDir = path_1.default.resolve(__dirname, '..', 'backup.log');
    try {
        const data = fs_1.default.readFileSync(dataFilePath, 'utf8');
        fs_1.default.appendFileSync(backupDir, data, 'utf8');
        console.log('Backup successful:', backupDir);
    }
    catch (error) {
        console.error('Error during backup:', error.message);
        console.error('Error code:', error.code);
    }
}
node_cron_1.default.schedule('* * * * *', () => {
    console.log('Running scheduled backup...');
    performBackup();
});
