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
        fs.appendFileSync(backupDir, data, 'utf8');
        console.log('Backup successful:', backupDir);
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