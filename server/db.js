import { MongoClient } from 'mongodb';
import { config } from './config.js';


const client = new MongoClient(config.mongoUri); 

let db;

async function connectToMongo() {
    try {
        await client.connect();
        db = client.db(config.dbName);
        console.log("✅ MongoDB connected");
    } catch (err) {
        console.error("❌ MongoDB connection error:", err.message);
        process.exit(1);
    }
}

await connectToMongo();

export { db };
