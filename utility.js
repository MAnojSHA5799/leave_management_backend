const crypto = require("crypto")
const algorithm = "aes-256-cbc";

function decryptData(encryptedText) {
    try {
        console.log({encryptedText})
        const initVector = Buffer.alloc(16, 0);
        const encryptionKey = "abcd"//same encryption key
        const key = crypto.createHash('sha256').update(String(encryptionKey)).digest('base64').substr(0, 32);
        const decipher = crypto.createDecipheriv(algorithm, key, initVector);
        let decryptedData = decipher.update(encryptedText, "hex", "utf-8");
        decryptedData += decipher.final("utf8");
        console.log("Decrypted message: " + decryptedData);
        return decryptedData;
    } catch (decryptDataError) {
        console.error(decryptDataError);
        return encryptedText;
    }
}

/**
 * 
 * @param {*} text 
 * @returns 
 */
function encryptData(data) {
    try {
        console.log({ data });
        const initVector = Buffer.alloc(16, 0);
        const encryptionKey = "abcd";//encryption-key
        const key = crypto.createHash('sha256').update(String(encryptionKey)).digest('base64').substr(0, 32);
        const cipher = crypto.createCipheriv(algorithm, key, initVector);
        let encryptedData = cipher.update(data, "utf-8", "hex");
        encryptedData += cipher.final("hex");
        console.log("Encrypted message: " + encryptedData);
        return encryptedData;
    } catch (encryptDataError) {
        console.error(encryptDataError);
        return data;
    }
}

// const encr = encryptData("This is node");
// console.log({encr});
 const dec = decryptData("f471786253c06ba9ce93243e41a6dbd5");
 console.log({dec})
 module.exports = {encryptData,decryptData}
