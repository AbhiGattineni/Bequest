import crypto from "crypto";

export default function createDigitalSignature(data:string){
    return crypto.createHash('sha256').update(data).digest('hex');
}