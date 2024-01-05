
## How does the client ensure that the data has not been tampered with?

The system employs a hash-based approach to ensure data integrity:

Client-Side Integrity Check: On the client side, the data's integrity is verified by re-computing the hash of the received data using the same hashing method (SHA-256). The client compares this newly computed hash with the received hash. If they match, the data is confirmed to be intact and unaltered.

React Component Behavior: The App component in the React frontend is designed to automatically fetch data and its hash from the server. It then performs an integrity check using the verifyDataIntegrity function, comparing the server-provided hash with a locally generated hash of the data.

## If the data has been tampered with, how can the client recover the lost data?

The system provides mechanisms for data recovery in case of tampering:

Data History Logging: The server maintains a log of all data changes, as implemented in the dataHistory function. Each entry in the log includes the data, its hash, and a timestamp.

Data Backup and Encryption: A cron job runs periodically to backup the current state of the data. The data is stored in both plain text and encrypted forms, using AES-256 encryption. This ensures that even in the event of a security breach, the data remains protected.



```I really tried to implement digital signature creation but because of issues i faced with key , I skipped that one still working on it.If i figure it out on issue with the key generation, i will push those changes too.```
