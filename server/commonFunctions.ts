import crypto from "crypto";
import fs from 'fs';
import path from 'path';
import cron from 'node-cron';


//tried implementing digital signature but somehow i am facing issue with the unique key.

export default function createDigitalSignature(data:string){
    return crypto.createHash('sha256').update(data).digest('hex');
}


//to ensure data is tracked, logging is implemented with time stamp
export function dataHistory(logEntry: any){
    fs.appendFileSync(path.join(__dirname, '..', 'dataHistory.log'), JSON.stringify(logEntry) + '\n');
    fs.appendFileSync(path.join(__dirname, '..', 'datafile.log'), logEntry.data + '\n');
}

// Function to perform the backup every time interval
function performBackup() {
    const dataFilePath = path.join(__dirname, '..', 'datafile.log');
    const backupDir = path.resolve(__dirname, '..', 'backup.log'); 

    try {
        const data = fs.readFileSync(dataFilePath, 'utf8');
        //backing up the data to the backup file
        fs.appendFileSync(backupDir, data, 'utf8');

        //creating a new backup file with current timestamp
        const filePath = `../backups/backup-${getCurrentNumericDate()}.log`; 
        fs.writeFile(filePath,data , (err) => {
            if (err) {
                console.error('There was an error writing to the file:', err);
            } else {
                console.log('File was written successfully');
            }
        });

const filePathEncrypted = `../encryptedBackup/backup-${getCurrentNumericDate()}.log`; 

const algorithm = 'aes-256-cbc'; //can be taken from env file
const secretKey = 'vOVH6sdmpNWjRRIqCc7rdxs01lwHzfr3'; //can be taken from env file
const iv = crypto.randomBytes(16);

function encrypt(text:any) {
    const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
    const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
    return { iv: iv.toString('hex'), content: encrypted.toString('hex') };
  }
        fs.writeFile(filePathEncrypted,JSON.stringify(encrypt(data)) , (err) => {
            if (err) {
                console.error('There was an error writing to the encrypted file:', err);
            } else {
                console.log('Encrypted file was written successfully');
            }
        });

    } catch (error: any) {
        console.error('Error during backup:', error.message);
        console.error('Error code:', error.code);
    }
}

//cron job to make backup of the data
cron.schedule('* * * * *', () => {
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