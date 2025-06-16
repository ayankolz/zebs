import mqtt from 'mqtt';
import { db } from './db.js';
import { config } from './config.js';

// Connect to MQTT broker using values from your env file
const client = mqtt.connect(config.mqttUri, {
    username: config.mqttUsername,
    password: config.mqttPassword,
    clientId: config.mqttClientId,
    rejectUnauthorized: false
});

client.on('connect', () => {
    console.log('✅ Connected to MQTT broker');

    const topics = [
        'farm/control/moisture_low',
        'farm/control/moisture_high',
        'microcontroller1/system',
        'microcontroller1/sensors',
        'microcontroller1/irrigation',
        'microcontroller1/motion',
        'microcontroller2/system',
        'microcontroller2/sensors',
        'microcontroller2/irrigation',
        'microcontroller2/motion',
        'microcontroller3/system',
        'microcontroller3/sensors',
        'microcontroller3/irrigation',
        'microcontroller3/motion',
        'microcontroller4/system',
        'microcontroller4/sensors',
        'microcontroller4/irrigation',
        'microcontroller4/motion'
    ];

    client.subscribe(topics, (err) => {
        if (err) {
            console.error('❌ Subscription error:', err.message);
        } else {
            console.log('✅ Subscribed to topics');
        }
    });
});

client.on('error', (err) => {
    console.error('❌ MQTT Connection Error:', err.message);
});

client.on('message', async (topic, message) => {
    const msgStr = message.toString();
    const timestamp = new Date();

    console.log('📥 Raw MQTT Message:', msgStr);
    console.log('🔍 Topic:', topic);

    const microcontroller = parseInt(topic.charAt(14)); // extract microcontroller id

    try {
        if (topic.includes('/sensors')) {
            const sensorsCollection = db.collection('sensors');
            const jsonData = JSON.parse(msgStr); // still expect JSON

            await sensorsCollection.insertOne({
                microcontroller,
                timestamp,
                temperature: jsonData.temperature,
                humidity: jsonData.humidity,
                moistureOne: jsonData.moistureOne,
                moistureTwo: jsonData.moistureTwo
            });

            console.log('✅ Sensors data saved to MongoDB');
        }

        else if (topic.includes('/irrigation')) {
            const irrigationCollection = db.collection('irrigation');
            const jsonData = JSON.parse(msgStr); // still expect JSON

            await irrigationCollection.insertOne({
                microcontroller,
                timestamp,
                action: jsonData.action,
                action_timestamp: jsonData.timestamp
            });

            console.log('✅ Irrigation data saved to MongoDB');
        }

        else if (topic.includes('/system')) {
            const systemCollection = db.collection('system');

            await systemCollection.insertOne({
                microcontroller,
                data: msgStr,  // store raw string directly
                timestamp
            });

            console.log('✅ System data saved to MongoDB');
        }
        else if (topic.includes('/motion')) {
            const motionCollection = db.collection('motion');

            // Parse the boolean message
            let motionValue;
            try {
                motionValue = JSON.parse(msgStr);  // convert "true" or "false" string to actual boolean
            } catch (err) {
                console.error('❌ Failed to parse motion boolean:', msgStr);
                return;
            }

            const motionText = motionValue ? "motion detected" : "no motion";

            await motionCollection.insertOne({
                microcontroller,
                data: motionText,
                timestamp
            });

            console.log('✅ Motion data saved to MongoDB');
        }


        else {
            console.warn('⚠️ Unhandled topic:', topic);
        }
    } catch (err) {
        console.error('❌ MongoDB Insert Error:', err.message);
    }
});
