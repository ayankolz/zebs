import { db } from './db.js';  // reuse your already connected db instance

async function testInsertSensorData() {
    try {
        const sensorsCollection = db.collection('sensors');

        // Dummy test data
        const testSensorData = {
            microcontroller: 1,
            timestamp: new Date(),
            temperature: 26.5,
            humidity: 60,
            moistureOne: 530,
            moistureTwo: 550
        };

        // Insert into MongoDB
        const result = await sensorsCollection.insertOne(testSensorData);
        console.log('✅ Test sensor data inserted with ID:', result.insertedId);
    } catch (err) {
        console.error('❌ Error inserting test data:', err);
    }
}

testInsertSensorData();
