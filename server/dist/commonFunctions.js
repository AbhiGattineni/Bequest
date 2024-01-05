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
//tried implementing digital signature but somehow i am facing issue with the unique key.
function createDigitalSignature(data) {
    return crypto_1.default.createHash('sha256').update(data).digest('hex');
}
exports.default = createDigitalSignature;
//to ensure data is tracked, logging is implemented with time stamp
function dataHistory(logEntry) {
    fs_1.default.appendFileSync(path_1.default.join(__dirname, '..', 'dataHistory.log'), JSON.stringify(logEntry) + '\n');
    fs_1.default.appendFileSync(path_1.default.join(__dirname, '..', 'datafile.log'), logEntry.data + '\n');
}
exports.dataHistory = dataHistory;
// Function to perform the backup every time interval
function performBackup() {
    const dataFilePath = path_1.default.join(__dirname, '..', 'datafile.log');
    const backupDir = path_1.default.resolve(__dirname, '..', 'backup.log');
    try {
        const data = fs_1.default.readFileSync(dataFilePath, 'utf8');
        //backing up the data to the backup file
        fs_1.default.appendFileSync(backupDir, data, 'utf8');
        //creating a new backup file with current timestamp
        const filePath = `../backups/backup-${getCurrentNumericDate()}.log`;
        fs_1.default.writeFile(filePath, data, (err) => {
            if (err) {
                console.error('There was an error writing to the file:', err);
            }
            else {
                console.log('File was written successfully');
            }
        });
        const filePathEncrypted = `../encryptedBackup/backup-${getCurrentNumericDate()}.log`;
        const algorithm = 'aes-256-cbc';
        const secretKey = 'vOVH6sdmpNWjRRIqCc7rdxs01lwHzfr3';
        const iv = crypto_1.default.randomBytes(16);
        function encrypt(text) {
            const cipher = crypto_1.default.createCipheriv(algorithm, secretKey, iv);
            const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
            return { iv: iv.toString('hex'), content: encrypted.toString('hex') };
        }
        fs_1.default.writeFile(filePathEncrypted, JSON.stringify(encrypt(data)), (err) => {
            if (err) {
                console.error('There was an error writing to the encrypted file:', err);
            }
            else {
                console.log('Encrypted file was written successfully');
            }
        });
    }
    catch (error) {
        console.error('Error during backup:', error.message);
        console.error('Error code:', error.code);
    }
}
//cron job to make backup of the data
node_cron_1.default.schedule('* * * * *', () => {
    console.log('Running scheduled backup...');
    performBackup();
});
function getCurrentNumericDate() {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    const hours = String(currentDate.getHours()).padStart(2, '0');
    const minutes = String(currentDate.getMinutes()).padStart(2, '0');
    const seconds = String(currentDate.getSeconds()).padStart(2, '0');
    return `${year}${month}${day}${hours}${minutes}${seconds}`;
}
